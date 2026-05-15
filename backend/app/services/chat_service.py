from __future__ import annotations

import json
import os
import logging
from datetime import datetime
from typing import List

from fastapi import HTTPException
from langchain_groq import ChatGroq

from ..config import HISTORY_FILE, SETTINGS_FILE, get_default_settings
from ..models import ChatRequest, ChatResponse, ChatSettings, Citation, HistoryItem
from ..utils.medical_guardrails import (
    DISCLAIMER,
    detect_emergency,
    infer_severity,
    precaution_tips,
    safe_otc_suggestions,
)
from ..utils.storage import read_json, write_json
from .rag_service import retrieve_context


logger = logging.getLogger(__name__)

GROQ_ALLOWED_MODELS = {
    "llama-3.1-8b-instant",
    "llama-3.1-70b-versatile",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
}


def _normalize_groq_settings(settings: ChatSettings) -> ChatSettings:
    if settings.model_name not in GROQ_ALLOWED_MODELS:
        settings.model_name = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    return settings

SYSTEM_PROMPT = """
You are MediAssist AI, a helpful and conversational healthcare guidance assistant.
Your goal is to provide supportive guidance based on the retrieved context and history.

RULES:
1. Use the retrieved context first. Never claim to be a doctor.
2. If the user is reporting new symptoms for the first time, provide a structured assessment in these sections:
   - Possible conditions
   - Severity
   - General precautions
   - OTC guidance
   - When to see a doctor
3. If the user is asking a follow-up question (check the conversation history), be conversational, directly answer their specific question, and refer back to previous advice if relevant. Avoid repeating the same full assessment if it was already provided.
4. Never provide dangerous prescriptions, antibiotics, opioids, or steroids.
5. Always include the exact disclaimer at the end of your response:
"This chatbot is not a licensed medical professional. Consult a doctor for emergencies or accurate diagnosis."
"""


def _build_prompt(request: ChatRequest, context_blocks: List[str], severity: str, emergency: bool) -> str:
    history_text = "\n".join(
        f"{item.get('role', 'user')}: {item.get('content', '')}"
        for item in request.history[-6:]
    )
    context = "\n\n".join(context_blocks)
    return f"""
{SYSTEM_PROMPT}

Emergency detected: {emergency}
Severity hint: {severity}

Conversation history:
{history_text}

Retrieved healthcare context:
{context}

User message:
{request.message}
"""


def _fallback_answer(request: ChatRequest, citations: List[Citation], severity: str, emergency: bool) -> str:
    precautions = precaution_tips(request.message)
    otc = safe_otc_suggestions(request.message)
    lines = [
        "Possible conditions: Based on the symptoms, common causes may include viral infection, mild inflammation, allergy-related illness, or another condition that needs clinical confirmation.",
        f"Severity: {severity}.",
        "General precautions: " + "; ".join(precautions) + ".",
        "OTC guidance: " + ("; ".join(otc) if otc else "No medicine suggestion beyond supportive care at this time") + ".",
        "When to see a doctor: Seek professional care if symptoms worsen, persist, or include high fever, breathing issues, confusion, dehydration, or severe pain.",
    ]
    if emergency:
        lines.append("Seek immediate medical attention.")
    lines.append(DISCLAIMER)
    if citations:
        lines.append("Sources were used from the local healthcare knowledge base.")
    return "\n\n".join(lines)


def _extract_conditions(citations: List[Citation]) -> List[str]:
    return [citation.title for citation in citations if citation.title][:3]


def ask_healthcare_assistant(request: ChatRequest) -> ChatResponse:
    settings = _normalize_groq_settings(request.settings or get_default_settings())
    docs = retrieve_context(request.message, settings)
    citations = [
        Citation(
            title=doc.metadata.get("title", "Healthcare source"),
            source=doc.metadata.get("source", "Local RAG dataset"),
            preview=doc.page_content[:180],
        )
        for doc in docs
    ]
    severity = infer_severity(request.message)
    emergency = detect_emergency(request.message)
    precautions = precaution_tips(request.message)
    otc_medicines = safe_otc_suggestions(request.message)

    prompt = _build_prompt(
        request,
        [doc.page_content for doc in docs],
        severity,
        emergency,
    )

    try:
        if not os.getenv("GROQ_API_KEY"):
            raise HTTPException(
                status_code=503,
                detail="Missing GROQ_API_KEY. Set it in backend/.env and restart the backend.",
            )

        llm = ChatGroq(
            temperature=settings.temperature,
            model_name=settings.model_name,
            max_tokens=settings.max_tokens,
        )

        result = llm.invoke(prompt)
        answer = getattr(result, "content", str(result)).strip()
        if DISCLAIMER not in answer:
            answer = f"{answer}\n\n{DISCLAIMER}"
        if emergency and "Seek immediate medical attention." not in answer:
            answer = f"Seek immediate medical attention.\n\n{answer}"
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Groq LLM call failed")
        raise HTTPException(
            status_code=502,
            detail=f"Groq LLM call failed: {type(exc).__name__}",
        ) from exc

    follow_up = [
        "How long have you had these symptoms?",
        "Do you have any allergies, chronic illness, or high fever?",
        "Would you like nearby hospitals or pharmacies?",
    ]
    nearby_specialists = ["General physician", "Internal medicine", "ENT specialist"]
    if any(term in request.message.lower() for term in {"skin", "rash"}):
        nearby_specialists = ["Dermatologist", "General physician"]
    elif any(term in request.message.lower() for term in {"headache", "migraine"}):
        nearby_specialists = ["General physician", "Neurologist"]

    history = read_json(HISTORY_FILE, default=[])
    now = datetime.utcnow().isoformat()
    history.extend(
        [
            HistoryItem(role="user", content=request.message, timestamp=now).model_dump(),
            HistoryItem(role="assistant", content=answer, timestamp=now).model_dump(),
        ]
    )
    write_json(HISTORY_FILE, history[-100:])
    write_json(SETTINGS_FILE, settings.model_dump())

    return ChatResponse(
        answer=answer,
        severity=severity,
        emergency=emergency,
        possible_conditions=_extract_conditions(citations),
        precautions=precautions,
        otc_medicines=otc_medicines,
        citations=citations,
        follow_up=follow_up,
        nearby_specialists=nearby_specialists,
        used_settings=settings,
    )


def get_history() -> list[dict]:
    return read_json(HISTORY_FILE, default=[])


def get_settings() -> dict:
    persisted = read_json(SETTINGS_FILE, default=get_default_settings().model_dump())
    merged = {**get_default_settings().model_dump(), **persisted}
    return _normalize_groq_settings(ChatSettings(**merged)).model_dump()


def save_settings(payload: dict) -> dict:
    merged = {**get_default_settings().model_dump(), **payload}
    normalized = _normalize_groq_settings(ChatSettings(**merged)).model_dump()
    write_json(SETTINGS_FILE, normalized)
    return normalized

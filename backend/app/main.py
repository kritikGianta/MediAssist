from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .config import ensure_runtime_files
from .models import ChatRequest, NearbyRequest, UploadResponse
from .services.chat_service import ask_healthcare_assistant, get_history, get_settings, save_settings
from .services.location_service import find_nearby_healthcare
from .services.report_service import extract_text_from_pdf, save_upload, summarize_report_text

ensure_runtime_files()

app = FastAPI(
    title="MediAssist AI API",
    description="RAG-powered healthcare guidance chatbot using free/open-source tools.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/debug/env")
def debug_env() -> dict:
    env_path = Path(__file__).resolve().parent.parent / ".env"
    key = os.getenv("GROQ_API_KEY", "")
    return {
        "env_path": str(env_path),
        "env_file_exists": env_path.exists(),
        "has_groq_api_key": bool(key),
        "groq_api_key_len": len(key),
    }


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "disclaimer": "This chatbot is not a licensed medical professional. Consult a doctor for emergencies or accurate diagnosis.",
    }


@app.get("/")
def root() -> JSONResponse:
    return JSONResponse(
        {
            "message": "MediAssist AI backend is running.",
            "frontend_url": "http://localhost:5173",
            "health_url": "/health",
            "docs_url": "/docs",
            "disclaimer": "This chatbot is not a licensed medical professional. Consult a doctor for emergencies or accurate diagnosis.",
        }
    )


@app.post("/chat")
def chat(request: ChatRequest):
    return ask_healthcare_assistant(request)


@app.post("/upload-report", response_model=UploadResponse)
async def upload_report(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF uploads are supported in this version.")
    content = await file.read()
    save_upload(file.filename, content)
    text = extract_text_from_pdf(content)
    summary, citations = summarize_report_text(text)
    return UploadResponse(summary=summary, citations=citations)


@app.post("/nearby-doctors")
def nearby_doctors(request: NearbyRequest):
    try:
        return {
            "results": [item.model_dump() for item in find_nearby_healthcare(request.latitude, request.longitude, request.radius_km)]
        }
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Location lookup failed: {exc}") from exc


@app.get("/settings")
def settings():
    return get_settings()


@app.post("/settings")
def update_settings(payload: dict):
    return save_settings(payload)


@app.get("/history")
def history():
    return get_history()

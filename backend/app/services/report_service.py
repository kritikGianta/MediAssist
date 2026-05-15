from __future__ import annotations

from io import BytesIO
from pathlib import Path
from typing import List

from langchain.docstore.document import Document
from pypdf import PdfReader

from ..config import UPLOAD_DIR
from ..models import Citation


def save_upload(filename: str, data: bytes) -> Path:
    path = UPLOAD_DIR / filename
    path.write_bytes(data)
    return path


def extract_text_from_pdf(data: bytes) -> str:
    reader = PdfReader(BytesIO(data))
    text_parts: List[str] = []
    for page in reader.pages:
        text_parts.append(page.extract_text() or "")
    return "\n".join(text_parts).strip()


def summarize_report_text(text: str) -> tuple[str, List[Citation]]:
    short_text = text[:4000] if text else "No readable text found in the PDF."
    summary = (
        "Report summary:\n"
        f"- Key extracted content: {short_text[:600]}\n"
        "- Review this report with a qualified clinician, especially for abnormal values.\n"
        "- This chatbot is not a licensed medical professional. Consult a doctor for emergencies or accurate diagnosis."
    )
    return summary, [
        Citation(
            title="Uploaded health report",
            source="User PDF upload",
            preview=short_text[:180] or "No readable text available.",
        )
    ]

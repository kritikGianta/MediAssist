from __future__ import annotations

import json
import logging
import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

from .models import ChatSettings

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = BASE_DIR / "uploads"
SETTINGS_FILE = BASE_DIR / "settings.json"
HISTORY_FILE = BASE_DIR / "history.json"

ENV_PATH = BASE_DIR.parent / ".env"
_dotenv_loaded = load_dotenv(ENV_PATH, override=True)
if not _dotenv_loaded:
    logger.warning("No .env loaded from %s", ENV_PATH)


@lru_cache(maxsize=1)
def get_default_settings() -> ChatSettings:
    return ChatSettings(
        model_name=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
        temperature=float(os.getenv("DEFAULT_TEMPERATURE", "0.2")),
        max_tokens=int(os.getenv("DEFAULT_MAX_TOKENS", "256")),
        top_k=int(os.getenv("DEFAULT_TOP_K", "4")),
        chunk_size=int(os.getenv("DEFAULT_CHUNK_SIZE", "500")),
        chunk_overlap=int(os.getenv("DEFAULT_CHUNK_OVERLAP", "80")),
        embedding_model=os.getenv(
            "EMBEDDING_MODEL",
            "sentence-transformers/all-MiniLM-L6-v2",
        ),
    )


def ensure_runtime_files() -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    if not SETTINGS_FILE.exists():
        SETTINGS_FILE.write_text(
            json.dumps(get_default_settings().model_dump(), indent=2),
            encoding="utf-8",
        )
    if not HISTORY_FILE.exists():
        HISTORY_FILE.write_text("[]", encoding="utf-8")

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ChatSettings(BaseModel):
    model_name: str = "llama-3.1-8b-instant"
    temperature: float = 0.2
    max_tokens: int = 256
    top_k: int = 4
    chunk_size: int = 500
    chunk_overlap: int = 80
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=2)
    history: List[Dict[str, str]] = Field(default_factory=list)
    settings: Optional[ChatSettings] = None


class Citation(BaseModel):
    title: str
    source: str
    preview: str


class NearbyRequest(BaseModel):
    latitude: float
    longitude: float
    radius_km: float = 5.0


class NearbyPlace(BaseModel):
    name: str
    category: str
    latitude: float
    longitude: float
    address: str
    distance_km: float
    osm_url: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    severity: str
    emergency: bool
    possible_conditions: List[str]
    precautions: List[str]
    otc_medicines: List[str]
    citations: List[Citation]
    follow_up: List[str]
    nearby_specialists: List[str]
    used_settings: ChatSettings


class HistoryItem(BaseModel):
    role: str
    content: str
    timestamp: str


class UploadResponse(BaseModel):
    summary: str
    citations: List[Citation]

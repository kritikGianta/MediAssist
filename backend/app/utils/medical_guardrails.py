from __future__ import annotations

from typing import List

EMERGENCY_KEYWORDS = {
    "chest pain",
    "shortness of breath",
    "difficulty breathing",
    "breathing difficulty",
    "stroke",
    "face drooping",
    "arm weakness",
    "slurred speech",
    "seizure",
    "unconscious",
    "fainting",
    "blue lips",
    "severe bleeding",
}

SERIOUS_KEYWORDS = {
    "high fever",
    "persistent vomiting",
    "dehydration",
    "blood in stool",
    "confusion",
    "severe pain",
}

MODERATE_KEYWORDS = {
    "fever",
    "vomiting",
    "diarrhea",
    "migraine",
    "sore throat",
    "wheezing",
}

DISCLAIMER = (
    "This chatbot is not a licensed medical professional. Consult a doctor "
    "for emergencies or accurate diagnosis."
)


def detect_emergency(text: str) -> bool:
    lowered = text.lower()
    return any(keyword in lowered for keyword in EMERGENCY_KEYWORDS)


def infer_severity(text: str) -> str:
    lowered = text.lower()
    if detect_emergency(lowered):
        return "Serious"
    if any(keyword in lowered for keyword in SERIOUS_KEYWORDS):
        return "Serious"
    if any(keyword in lowered for keyword in MODERATE_KEYWORDS):
        return "Moderate"
    return "Mild"


def safe_otc_suggestions(text: str) -> List[str]:
    lowered = text.lower()
    suggestions: List[str] = []
    if any(token in lowered for token in {"fever", "headache", "body ache"}):
        suggestions.append("Paracetamol/acetaminophen as labeled for fever or mild pain")
    if any(token in lowered for token in {"headache", "muscle pain"}):
        suggestions.append("Ibuprofen as labeled if previously tolerated and not contraindicated")
    if any(token in lowered for token in {"runny nose", "congestion", "cold"}):
        suggestions.append("Saline nasal spray for congestion support")
    if any(token in lowered for token in {"diarrhea", "vomiting", "dehydration"}):
        suggestions.append("Oral rehydration solution in small frequent sips")
    return suggestions[:3]


def precaution_tips(text: str) -> List[str]:
    lowered = text.lower()
    tips = ["Monitor symptoms and rest", "Stay hydrated with water or oral fluids"]
    if "fever" in lowered:
        tips.append("Track temperature and seek care if fever becomes high or persistent")
    if "sore throat" in lowered:
        tips.append("Use warm fluids and consider salt-water gargles if comfortable")
    if any(token in lowered for token in {"cough", "cold", "flu"}):
        tips.append("Limit close contact and practice hand hygiene")
    return tips[:4]

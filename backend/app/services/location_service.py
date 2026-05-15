from __future__ import annotations

import math
from typing import List

import requests

from ..models import NearbyPlace

OVERPASS_URL = "https://overpass-api.de/api/interpreter"


def _distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lon / 2) ** 2
    )
    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def find_nearby_healthcare(latitude: float, longitude: float, radius_km: float) -> List[NearbyPlace]:
    radius_m = int(radius_km * 1000)
    query = f"""
    [out:json];
    (
      node["amenity"~"hospital|clinic|doctors|pharmacy"](around:{radius_m},{latitude},{longitude});
      way["amenity"~"hospital|clinic|doctors|pharmacy"](around:{radius_m},{latitude},{longitude});
      relation["amenity"~"hospital|clinic|doctors|pharmacy"](around:{radius_m},{latitude},{longitude});
    );
    out center tags;
    """
    response = requests.get(
        OVERPASS_URL,
        params={"data": query},
        timeout=20,
        headers={"User-Agent": "MediAssist-AI/1.0"},
    )
    response.raise_for_status()
    items = response.json().get("elements", [])
    results: List[NearbyPlace] = []

    for item in items[:12]:
        tags = item.get("tags", {})
        lat = item.get("lat") or item.get("center", {}).get("lat")
        lon = item.get("lon") or item.get("center", {}).get("lon")
        if lat is None or lon is None:
            continue
        results.append(
            NearbyPlace(
                name=tags.get("name", "Nearby healthcare location"),
                category=tags.get("amenity", "healthcare"),
                latitude=lat,
                longitude=lon,
                address=", ".join(
                    part
                    for part in [
                        tags.get("addr:street"),
                        tags.get("addr:city"),
                        tags.get("addr:postcode"),
                    ]
                    if part
                )
                or "OpenStreetMap listing",
                distance_km=round(_distance_km(latitude, longitude, lat, lon), 2),
                osm_url=f"https://www.openstreetmap.org/{item['type']}/{item['id']}",
            )
        )

    results.sort(key=lambda place: place.distance_km)
    return results[:8]

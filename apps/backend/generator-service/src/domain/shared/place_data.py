from dataclasses import dataclass
from typing import Dict

@dataclass
class PlaceData:
    id: str
    lat: float
    lon: float
    tags: Dict[str, str]

@dataclass
class VectoredPlaceData: 
    id: str
    lat: float
    lon: float
    tags: Dict[str, str]
    vector: list[float]
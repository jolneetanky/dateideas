from dataclasses import dataclass
from typing import Dict

@dataclass
class PlaceData:
    id: str
    lat: float
    lon: float
    tags: Dict[str, str]
# Shape of the message received from job queue
import uuid
from dataclasses import dataclass

@dataclass
class Location:
    lat: float
    lon: float
    radius_km: float
@dataclass
class JobQueueConsumedMessage:
    job_id: uuid.UUID
    location: Location
    prompt: str = ""
    budget: int = -1
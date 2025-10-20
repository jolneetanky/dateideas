from dataclasses import dataclass
import uuid
from enum import Enum
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base

# ───────────────────────────────
# LOCATION (shared struct)
# ───────────────────────────────
@dataclass
class Location:
    lat: float
    lon: float
    radius_km: float
    location_str: str

    def __repr__(self):
        return (
            f"Location(lat={self.lat:.4f}, lon={self.lon:.4f}, "
            f"radius_km={self.radius_km}, loc='{self.location_str}')"
        )

# ───────────────────────────────
# JOB QUEUE MESSAGE (shared DTO)
# ───────────────────────────────
@dataclass
class JobQueueConsumedMessage:
    job_id: uuid.UUID
    location: Location
    prompt: str = ""
    budget: int = -1

    def __repr__(self):
        short_id = str(self.job_id)[:8]  # shorten UUID for logs
        return (
            f"JobQueueConsumedMessage(job_id={short_id}..., "
            f"prompt='{self.prompt}', budget={self.budget}, "
            f"location={repr(self.location)})"
        )

# ───────────────────────────────
# DATABASE MODELS
# ───────────────────────────────
Base = declarative_base() # Singleton

@dataclass
class Job(Base):
    __tablename__ = "jobs"

    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status: str = Column(String)

    def __repr__(self):
        short_id = str(self.id)[:8] if self.id else None
        return f"Job(id={short_id}..., status='{self.status}')"

# ───────────────────────────────
# ENUMS
# ───────────────────────────────
class Status(Enum):
    SUCCESS="success"
    PENDING="pending"
    ERROR="error"

    def __repr__(self):
        return f"Status.{self.name}"
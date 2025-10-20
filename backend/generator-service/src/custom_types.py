from dataclasses import dataclass
import uuid
from enum import Enum
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base

@dataclass
class Location:
    lat: float
    lon: float
    radius_km: float
    location_str: str

# Thisis a shared data type that is passed around.
@dataclass
class JobQueueConsumedMessage:
    job_id: uuid.UUID
    location: Location
    prompt: str = ""
    budget: int = -1

# TYPES FOR JOB REPO

Base = declarative_base() # Singleton

@dataclass
class Job(Base):
    __tablename__ = "jobs"

    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status: str = Column(String)

class Status(Enum):
    SUCCESS="success"
    PENDING="pending"
    ERROR="error"
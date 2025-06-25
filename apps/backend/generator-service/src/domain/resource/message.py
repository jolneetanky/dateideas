# Shape of the message received from job queue
import uuid
from dataclasses import dataclass

@dataclass
class JobQueueConsumedMessage:
    job_id: uuid.UUID
    prompt: str = ""
    location: str = ""
    budget: int = -1
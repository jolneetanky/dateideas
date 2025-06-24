# Shape of the message received from job queue
from dataclasses import dataclass

@dataclass
class JobQueueConsumedMessage:
    job_id: str = ""
    prompt: str = ""
    location: str = ""
    budget: int = -1
from dataclasses import dataclass
import uuid
from enum import Enum

class Status(Enum):
    SUCCESS="success"
    PENDING="pending"
    ERROR="error"

@dataclass
class Job:
    id: uuid.UUID
    status: Status
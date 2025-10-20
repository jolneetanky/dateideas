# import uuid
# from dataclasses import dataclass
# from sqlalchemy import Column, String
# from sqlalchemy.dialects.postgresql import UUID
# from domain.entity.base import Base

# @dataclass
# class Job(Base):
#     __tablename__ = "jobs"

#     id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     status: str = Column(String)

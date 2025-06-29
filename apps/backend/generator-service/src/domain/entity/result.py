from domain.entity.base import Base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

class Result(Base):
    __tablename__ = 'results'
    id = Column(Integer, primary_key=True, autoincrement=True)

    dateidea_id = Column(Integer)  # Acts like a soft pointer

    job_id = Column(UUID(as_uuid=True), ForeignKey('jobs.id'))
from abc import ABC, abstractmethod
import uuid
from lib.db.generatordb import generatorDB
# from repository.base import Base
from custom_types import Base
# from domain.entity.result import Result
from lib.logger import initLogger

from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

# Type definition for SQLAlchemy
class Result(Base):
    __tablename__ = 'results'
    id = Column(Integer, primary_key=True, autoincrement=True)

    job_id = Column(UUID(as_uuid=True), ForeignKey('jobs.id'))
    description = Column(String)  # Stores the generated date idea text
    node_id = Column(String)      # Stores the overpass node ID (as string)

class ResultRepo(ABC):
    def __init__(self):
        pass

    # UNDO 
    def insert_results(self, job_id: uuid.UUID, desc: str, node_ids: list[str]):
        pass

class ResultRepoImpl(ResultRepo):
    # NOTE: for scalability, we caan use this function with batched results.
    def insert_results(self, job_id: uuid.UUID, desc: str, node_ids: list[str]):
        logger = initLogger("ResultRepo.insert_results")
        logger.info(f"Inserting results for jobID {job_id}...")

        if len(node_ids) == 0:
            logger.error("Cannot insert results: node_ids is empty")
            raise ValueError("Cannot insert results: node_ids is empty")

        results = [
            Result(job_id=job_id, description=desc, node_id=node_id)
            for node_id in node_ids
        ]
        generatorDB.session.add_all(results)
        generatorDB.session.commit()    
        logger.info(f"Successfully inserted results for jobID {job_id}")
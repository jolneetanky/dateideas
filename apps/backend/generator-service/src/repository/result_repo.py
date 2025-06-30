from abc import ABC, abstractmethod
import uuid
from lib.db.generatordb import generatorDB
from domain.entity.result import Result
from lib.logger import initLogger

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
        results = [
            Result(job_id=job_id, description=desc, node_id=node_id)
            for node_id in node_ids
        ]
        generatorDB.session.add_all(results)
        generatorDB.session.commit()    
        logger.info(f"Successfully inserted results for jobID {job_id}")
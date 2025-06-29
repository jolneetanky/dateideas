from abc import ABC, abstractmethod
import uuid
from lib.db.generatordb import generatorDB
from domain.entity.result import Result
from lib.logger import initLogger

class ResultRepo(ABC):
    def __init__(self):
        pass

    # UNDO 
    def insert_results(self, job_id: uuid.UUID, dateidea_ids: list[int]):
        pass

class ResultRepoImpl(ResultRepo):
    # NOTE: for scalability, we caan use this function with batched results.
    def insert_results(self, job_id: uuid.UUID, dateidea_ids: list[int]):
        logger = initLogger("ResultRepo.insert_results")
        logger.info(f"Inserting results for jobID {job_id}...")
        results = [
            Result(job_id=job_id, dateidea_id=dateidea_id)
            for dateidea_id in dateidea_ids
        ]
        # logger.info("HIII")
        generatorDB.session.add_all(results)
        # logger.info("success..")
        generatorDB.session.commit()    
        # logger.info("COMMITTED")
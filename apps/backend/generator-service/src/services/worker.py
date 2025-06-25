from abc import ABC, abstractmethod
from domain.resource.message import JobQueueConsumedMessage
from repository.job_repo import JobRepo
from lib.logger import initLogger

# abstract class
class Worker(ABC):
    def __init__(self, repo: JobRepo):
        pass

    @abstractmethod
    def generate(self):
        pass

class WorkerImpl(Worker):
    def __init__(self, repo: JobRepo):
        self.repo = repo

    def generate(self, data: JobQueueConsumedMessage):
        logger = initLogger("worker.generate")
        logger.info("inserting jobID into DB...")

        job_id = data.job_id
        # self.repo.insert_job(job_id, status)
        try:
            self.repo.insert_job(job_id, "pending")
        except Exception as e:
            logger.error(f"Error inserting job into DB: {e}")
            raise # rethrow exception after logging 

        # simulate job completion
        # generate date ideas...
        # after geneneration, mark job id as either "success" or "error"
        try:
            self.repo.update_job(job_id, "success")
        except Exception as e:
            logger.error(f"Error updating job id as success: {e}")
            raise # rethrow exception after logging 
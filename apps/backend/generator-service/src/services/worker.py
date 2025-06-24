import logging
from abc import ABC, abstractmethod
from domain.resource.message import JobQueueConsumedMessage
from repository.job_repo import JobRepo

# abstract class
class Worker(ABC):
    def __init__(self, repo: JobRepo):
        pass

    @abstractmethod
    def generate(self):
        pass

# implementing class
class WorkerImpl(Worker):
    def __init__(self, repo: JobRepo):
        self.repo = repo

    def generate(self, data: JobQueueConsumedMessage):
        logger = logging.getLogger("[services.worker.generate]")
        logger.info("Generating... jobId: ${data.job_id}")
        print("GENERATING", data.prompt) 
        job_id = data.job_id
        status = "Pending"
        self.repo.insert_job("6", status) # so it does insert, just for some reason when it's not refelcted in the container
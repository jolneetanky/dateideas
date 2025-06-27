from abc import ABC, abstractmethod
from domain.resource.message import JobQueueConsumedMessage
from domain.shared.job import Status
from repository.job_repo import JobRepo
from lib.logger import initLogger

# abstract class
class Worker(ABC):
    def __init__(self, jobRepo: JobRepo):
        pass

    @abstractmethod
    def generate(self):
        pass

# for now we'll just say every job get's these results.
MOCK_DATEIDEAS_IDS = [
    "1",
    "2",
    "3",
    "4",
    "5",
]

class WorkerImpl(Worker):
    def __init__(self, jobRepo: JobRepo):
        self.jobRepo = jobRepo

    def generate(self, data: JobQueueConsumedMessage):
        logger = initLogger("worker.generate")
        logger.info("inserting jobID into DB...")

        job_id = data.job_id
        # self.repo.insert_job(job_id, status)
        try:
            self.jobRepo.insert_job(job_id, Status.PENDING)
        except Exception as e:
            logger.error(f"Error inserting job into DB: {e}")
            raise # rethrow exception after logging 

        # 1) GENERATE RESULTS. ASSUME IT WORKS AND WE SOMEHOW GET AN ARRAY OF DATEIDEAID.
        # 2) STORE THIS ARRAY OF DATEIDEADB WITH THIS JOBID IN THE RESULTDB.
        # TODO: setup `results` DB
        # self.result_repo.insert_rows(jobid: dateideas_id for id in MOCK_DATEIDEAS_ID)

        # simulate job completion
        # generate date ideas...
        # after geneneration, mark job id as either "success" or "error"
        try:
            self.jobRepo.update_job(job_id, Status.SUCCESS)
        except Exception as e:
            logger.error(f"Error updating job id as success: {e}")
            raise # rethrow exception after logging 
from lib.psycopg import postgresJobDB
from lib.logger import initLogger
from abc import ABC, abstractmethod

# abstract class
# NOTE: this layer is just an abstraction so that we can swap out the underlying DB anytime.
class JobRepo(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def insert_job(self, job_id, status):
        pass

class JobRepoImpl(JobRepo):
    def insert_job(self, job_id, status):
        logger = initLogger("jobRepo.insert_job")
        logger.info("inserting jobID into DB...")
        postgresJobDB.insert_job(job_id, status)
    
    def update_job(self, job_id, status):
        logger = initLogger("jobRepo.update_job")
        logger.info("updating job status...")
        postgresJobDB.update_job_status(job_id, status)

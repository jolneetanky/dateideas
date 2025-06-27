# from lib.psycopg import postgresJobDB
from lib.logger import initLogger
from abc import ABC, abstractmethod
from lib.db.generatordb import generatorDB
from domain.entity.job import Job
from domain.shared.job import Status
import uuid

# abstract class
# NOTE: this layer is just an abstraction so that we can swap out the underlying DB anytime.

class JobRepo(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def insert_job(self, job_id: uuid.UUID, status:Status):
        pass

    @abstractmethod
    def update_job(self, job_id: uuid.UUID, status: Status):
        pass

class JobRepoImpl(JobRepo):
    def insert_job(self, job_id: uuid.UUID, status:Status):
        logger = initLogger("jobRepo.insert_job")
        logger.info("inserting jobID into DB...")

        session = generatorDB.session  # get the session
        print("[POSTGRESJOBDB] inserting...")
        try:
            new_job = Job(id=job_id, status=status.value)
            session.add(new_job)
            session.commit()
        except Exception as e:
            session.rollback()
            print(f"Failed to insert job: {e}")
            raise
 
    
    def update_job(self, job_id: uuid.UUID, status:Status):
        logger = initLogger("jobRepo.update_job")
        logger.info("updating job status...")
        # postgresJobDB.update_job_status(job_id, status)
        session = generatorDB.session  # get the session
        try:
            job = session.query(Job).filter_by(id=job_id).first()
            if job:
                job.status = status.value 
                session.commit()
        except Exception as e:
            session.rollback()
            print(f"Failed to update job status: {e}")
            raise
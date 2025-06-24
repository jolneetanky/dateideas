from lib.psycopg import postgresJobDB
from abc import ABC, abstractmethod

# abstract class
class JobRepo(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def insert_job(self, job_id, status):
        pass

class JobRepoImpl(JobRepo):
    def insert_job(self, job_id, status):
        print("[JOBREPO] INSERT JOB")
        postgresJobDB.insert_job(job_id, status)
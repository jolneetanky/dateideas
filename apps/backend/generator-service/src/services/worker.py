from abc import ABC, abstractmethod
from domain.shared.job import Status
from repository.job_repo import JobRepo
from repository.result_repo import ResultRepo
from lib.logger import initLogger
from initializers.main import generator
from initializers.main import filterer
from initializers.main import overpassApiClient

class Worker(ABC):
    def __init__(self, jobRepo: JobRepo, resultRepo: ResultRepo):
        pass

    @abstractmethod
    def generate(self):
        pass

# 2) input: prompt. then worker will give us keywords to query by.
# but i think this is qutie dumb lol
class WorkerImpl(Worker):
    def __init__(self, jobRepo: JobRepo, resultRepo: ResultRepo):
        self.jobRepo = jobRepo
        self.resultRepo = resultRepo

    def generate(self, job_id, prompt, location, budget):
        logger = initLogger("worker.generate")
        logger.info("Generating...")

        self.jobRepo.insert_job(job_id, Status.PENDING)
        logger.info(f"Successfully inserted job id {job_id}")

        data = overpassApiClient.gather_data("Orchard")[:1] # trim to length 20 first
        logger.info(f"Successfully gathered data")

        desc = generator.generate(prompt)
        logger.info(f"Successfully generated date idea")
        logger.info(f"DESC: {desc}")

        res = filterer.filter(desc, data)
        logger.info(f"Successfully got matching nodeIDs")
        logger.info(f"RES: {res}")

        mock_results = [
            1,
            2,
            4,
        ]
        self.resultRepo.insert_results(job_id, mock_results)

        try:
            self.jobRepo.update_job(job_id, Status.SUCCESS)
            logger.info(f"Successfully updated job id {job_id}")
        except Exception as e:
            logger.error(f"Error updating job id as success: {e}")
            raise # rethrow exception after logging 
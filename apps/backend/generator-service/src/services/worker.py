from abc import ABC, abstractmethod
from domain.shared.job import Status
from repository.job_repo import JobRepo
from repository.result_repo import ResultRepo
from lib.logger import initLogger
from initializers.main import generator
from initializers.main import filterer
from initializers.main import overpassApiClient
from dataclasses import dataclass
from lib.vectordb.base import VectorDB
from lib.embedder.base import Embedder
class Worker(ABC):
    def __init__(self, jobRepo: JobRepo, resultRepo: ResultRepo):
        pass

    @abstractmethod
    def generate(self):
        pass

# @dataclass
# class LocationFilter(): 
#     country: str 
#     city?: string;
#     region?: string;
#     lat?: number;
#     lon?: number;
#     radius_km?: number;

# TODO: write a vectorDB.get_top_k(k) function to return us the top k nodes in the DB that match the given prompt.

class WorkerImpl(Worker):
    def __init__(self, jobRepo: JobRepo, resultRepo: ResultRepo, vectorDB: VectorDB, embedder: Embedder):
        self.jobRepo = jobRepo
        self.resultRepo = resultRepo
        self.vectorDB = vectorDB
        self.embedder = embedder

    def generate(self, job_id, prompt, location, budget):
        logger = initLogger("worker.generate")
        logger.info(f"Generating for job_id: {job_id}, prompt: {prompt}, location: {location}, budget: {budget}")

        data = overpassApiClient.gather_data("Orchard")[:1] # trim to length 20 first
        logger.info(f"Successfully gathered data")

        # Generate date idea description
        desc = generator.generate(prompt)
        logger.info(f"Successfully generated date idea")
        logger.info(f"DESC: {desc}")

        # Get matching nodes.
        # node_ids = filterer.filter(desc, data, 1)
        vector = self.embedder.embed(prompt)
        nodes = self.vectorDB.getTopKNodes(vector, 10)
        logger.info(f"FILTERED NODES: {nodes}")

        node_ids = map(lambda node: node.id, nodes)

        logger.info(f"Successfully got matching nodeIDs")
        logger.info(f"NODEIDs: {node_ids}")

        self.resultRepo.insert_results(job_id=job_id, desc=desc, node_ids=node_ids)

        try:
            self.jobRepo.update_job(job_id, Status.SUCCESS)
            logger.info(f"Successfully updated job id {job_id}")
        except Exception as e:
            logger.error(f"Error updating job id as success: {e}")
            raise # rethrow exception after logging 
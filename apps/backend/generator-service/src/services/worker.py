from abc import ABC, abstractmethod
from domain.shared.job import Status
from repository.job_repo import JobRepo
from repository.result_repo import ResultRepo
from lib.logger import initLogger
from initializers.main import generator
from lib.embedder.base import Embedder
import uuid
from lib.vectordb.qdrant import QdrantDB

class Worker(ABC):
    def __init__(self, jobRepo: JobRepo, resultRepo: ResultRepo):
        pass

    @abstractmethod
    def generate(self):
        pass

class WorkerImpl(Worker):
    MAX_RES_LEN = 100

    def __init__(self, jobRepo: JobRepo, resultRepo: ResultRepo, qdrantDB: QdrantDB, embedder: Embedder):
        self.jobRepo = jobRepo
        self.resultRepo = resultRepo
        self.qdrantDB = qdrantDB
        self.embedder = embedder

    def generate(self, job_id: uuid.UUID, prompt: str, loc_str: str, lat: float, lon: float, radius_km: float, budget: int) -> Status:
        logger = initLogger("worker.generate()")
        logger.info(f"Generating for job_id: {job_id}, prompt: {prompt}, loc_str: {loc_str} , lat: {lat}, lon: {lon}, radius: {radius_km}, budget: {budget}")

        # Generate date idea description
        desc = generator.generate(prompt, loc_str)
        logger.info(f"Successfully generated date idea")
        logger.info(f"DESC: {desc}")

        logger.info(f"Embedding prompt...")
        vector = self.embedder.embed(prompt)

        self.qdrantDB.testPayload()

        # Get first 100 matching nodes
        logger.info(f"Querying vectorDB...") 
        nodes = self.qdrantDB.getTopKNodesWithLocation(vector, self.MAX_RES_LEN, lat, lon, radius_km)
        logger.info(f"FILTERED NODES LENGTH: {len(nodes)}")

        node_ids = list(map(lambda node: node.id, nodes))

        logger.info(f"Successfully got matching nodeIDs")
        logger.info(f"NODEIDs: {node_ids}")

        # Insert results into DB
        self.resultRepo.insert_results(job_id=job_id, desc=desc, node_ids=node_ids)

        return Status.SUCCESS
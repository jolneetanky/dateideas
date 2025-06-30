from abc import ABC, abstractmethod
from lib.logger import initLogger

class SemanticFilterer(ABC):
    @abstractmethod
    def filter(self, desc: str):

        pass

class TestFilterer(SemanticFilterer):
    def filter(self, desc: str, data: list[dict]):
        logger = initLogger("testfilterer")
        logger.info(f"Filtering based on description '{desc}...'")
        logger.info(f"DATA: {data}")


        pass
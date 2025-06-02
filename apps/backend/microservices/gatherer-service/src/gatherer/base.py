import logging
from abc import abstractmethod
from formatter.base import Formatter
class Gatherer():
    def __init__(self, formatter: Formatter):
        # logger = logging.getLogger("gatherer_service.gatherer")
        self.formatter = formatter
    
    # gather data from somewhere,
    @abstractmethod
    def gather(self):
        pass
from abc import abstractmethod
from producer.base import Producer

# defines the Gatherer class, an abstract class.
# Gatherer has a Producer to determine what's to be done with the data after.
class Gatherer():
    def __init__(self, producer: Producer):
        self._producer = producer
    
    @abstractmethod
    def gather(self) -> None:
        pass
from abc import ABC, abstractmethod
from formatter._types import FormattedData

class Formatter(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def format(self, data) -> FormattedData:
        pass
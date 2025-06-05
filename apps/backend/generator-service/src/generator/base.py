from abc import ABC, abstractmethod
from domain.resource.generated_data import GeneratedData

class Generator(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def generate(self, data) -> list[GeneratedData]:
        pass
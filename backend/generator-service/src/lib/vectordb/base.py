from abc import ABC, abstractmethod
from domain.shared.place_data import VectoredPlaceData

class VectorDB():
    @abstractmethod
    def initDB(self):
        pass
    
    @abstractmethod
    def upsertNodes(self, nodes: list[VectoredPlaceData]):
        pass

    @abstractmethod
    def getTopKNodes(self, vector: list[float], k: int) -> list[VectoredPlaceData]:
        pass

    @abstractmethod
    def getTopKNodesWithLocation(self, vector: list[float], k: int, lat: float, lon: float, radius_km: float) -> list[VectoredPlaceData]:
        pass

    @abstractmethod
    def getAllNodes(self):
        pass
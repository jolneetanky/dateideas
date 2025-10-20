from abc import ABC, abstractmethod

class PostgresDB(ABC):
    @abstractmethod
    def connect_db(self):
        pass
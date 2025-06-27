from abc import ABC, abstractmethod

# Abstract class, allow us to integrate with external DBs.
class DB(ABC):
    @abstractmethod
    def connect_db(self):
        pass

class PostgresTable(ABC):
    @abstractmethod
    def setup_table():
        pass
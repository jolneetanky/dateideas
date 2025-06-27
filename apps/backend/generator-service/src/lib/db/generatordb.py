# IMPORT THE SQALCHEMY LIBRARY's CREATE_ENGINE METHOD
from sqlalchemy import text
from lib.logger import initLogger
from lib.db.postgresdb import PostgresDB
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from domain.entity.base import Base
from domain.entity.job import Job
from domain.entity.result import Result
import os


# PYTHON FUNCTION TO CONNECT TO THE POSTGRESQL DATABASE AND
# RETURN THE SQLACHEMY ENGINE OBJECT
# this class is purposely as exposed as possible as the DB can always change (eg. new tables etc.)
# it's as simple as possible to expose the engine and session to the repository layer.

# DB
class GeneratorDB(PostgresDB):
    def __init__(self):
        self.engine = None
        self.session = None
        
    def connect_db(self):
        logger = initLogger("generatorDB.connect_db")
        logger.info("Connecting to DB...")
        try:
            logger.info("Creating engine...")
            engine = self.get_connection() 
            self.engine = engine

            logger.info("Creating session...")
            Session = sessionmaker(bind=engine)
            self.session = Session()
        except Exception as e:
            logger.error(f"Failed to connect to DB: {e}")

    def get_connection(self):
        # DEFINE THE DATABASE CREDENTIALS
        user = os.getenv("GENERATOR_DB_USER")
        password = os.getenv("GENERATOR_DB_PASSWORD")
        host = os.getenv("GENERATOR_DB_HOST")
        port = os.getenv("GENERATOR_DB_PORT")
        database = os.getenv("GENERATOR_DB_NAME")

        engine = create_engine(
            url="postgresql://{0}:{1}@{2}:{3}/{4}".format(
                user, password, host, port, database
            ),
            echo=True
        )
        return engine
    
    def set_all_tables(self):
        logger = initLogger("generatorDB.set_all_tables")
        logger.info("Setting tables...")
        Base.metadata.create_all(self.engine)

    def reset_all_tables(self):
        logger = initLogger("generatorDB.reset_all_tables")
        logger.info("Resetting tables...")

        try:
            with self.engine.connect() as conn:
                conn.execute(text("DROP TABLE IF EXISTS results CASCADE;"))
                conn.execute(text("DROP TABLE IF EXISTS jobs CASCADE;"))
                conn.commit()  # commit the transaction if needed

            Base.metadata.create_all(self.engine)
        except Exception as e:
            logger.error(f"Failed to reset tables: {e}")
            raise

    
# create a singleton
generatorDB = GeneratorDB()
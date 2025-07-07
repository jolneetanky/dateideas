import sys
import os
from services.worker import WorkerImpl
from repository.job_repo import JobRepoImpl
from repository.result_repo import ResultRepoImpl
# from lib.rabbitmq import consume_queue
from lib.db.generatordb import generatorDB
from lib.logger import initLogger
from dotenv import load_dotenv
from initializers.main import qdrantDB, embedder
from lib.rabbitmq import initQueueConsumer

# TODO: add retry logic for connecting to DB. Then check that a specific table exists

def main():
    load_dotenv()
    logger = initLogger("main")
    generatorDB.connect_db()

    # After successful connection, wait for 

    qdrantDB.initDB()
    # qdrantDB.deleteAllNodes()
    # nodes = overpassApiClient.gather_data("Pasir Ris")[:20]
    # vectored_nodes = list(map(lambda x: VectoredPlaceData(x.id, x.lat, x.lon, x.tags, embedder.embed(stringifyPlaceData(x))), nodes))

    # qdrantDB.upsertNodes(vectored_nodes)

    # Internal objects
    jobRepo = JobRepoImpl() #  This is the one that interacts with `postgresJobDB`. Flexible internal impl can be modified to use other ORMS.
    resultRepo = ResultRepoImpl()
    worker = WorkerImpl(jobRepo, resultRepo, qdrantDB, embedder)
    queue_consumer = initQueueConsumer(worker, jobRepo)

    queue_consumer.consume_queue() # blocking

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("Interrupted")
        try:
            sys.exit(0) # exit with no problems
        except SystemExit:
           os._exit(0) 
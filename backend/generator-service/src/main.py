import sys
import os
# from services.worker import WorkerImpl
# from repository.job_repo import JobRepoImpl
# from repository.result_repo import ResultRepoImpl

from job_queue import QueueConsumer
from worker import Worker

# from lib.rabbitmq import consume_queue
# from lib.db.generatordb import generatorDB

from lib.logger import initLogger
from dotenv import load_dotenv

# from initializers.main import overpassApiClient, qdrantDB, embedder
# from domain.shared.place_data import VectoredPlaceData
# from utils.main import stringifyPlaceData
# from lib.rabbitmq import initQueueConsumer

# from domain.resource.message import JobQueueConsumedMessage
# import json
# import uuid

# def callback(ch, method, properties, body: bytes):
#     logger = initLogger("consumer")
#     print(f"RECEIVED: {body}")

#     formatted_body = format_message(body)
    
    # worker.generate_desc()
    # job_repo.update() 
    
    # set result DB

    # lat, lon = formatted_body.location["lat"], formatted_body.location["lon"]
    # job_id = formatted_body.job_id

    # try:
    #     formatted_body = format_message(body)
    #     lat, lon = formatted_body.location["lat"], formatted_body.location["lon"]
    #     loc_str = get_loc_str(lat, lon)

    #     logger.info("Generating...")
    #     status = self.worker.generate(job_id, formatted_body.prompt, loc_str, formatted_body.location["lat"], formatted_body.location["lon"], formatted_body.location["radius_km"], formatted_body.budget)

    #     logger.info(f"STATUS: {status.value}")
    #     self.job_repo.update_job(job_id, status)
    # except Exception as e:
    #     logger.error(f"ERROR: {e}") 
    #     ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

    #     # TODO: update job status to "error"
    #     self.job_repo.update_job(job_id, Status.ERROR)

        # return

    # ch.basic_ack(delivery_tag=method.delivery_tag)



def main():
    load_dotenv()
    # generatorDB.connect_db()

    # qdrantDB.initDB()
    # qdrantDB.deleteAllNodes()
    # nodes = overpassApiClient.gather_data("Pasir Ris")[:20]
    # vectored_nodes = list(map(lambda x: VectoredPlaceData(x.id, x.lat, x.lon, x.tags, embedder.embed(stringifyPlaceData(x))), nodes))

    # qdrantDB.upsertNodes(vectored_nodes)

    # Internal objects
    # jobRepo = JobRepoImpl() #  This is the one that interacts with `postgresJobDB`. Flexible internal impl can be modified to use other ORMS.
    # resultRepo = ResultRepoImpl()

    worker = Worker()
    queue_consumer = QueueConsumer(worker)
    queue_consumer.start()

    # 

    # worker = WorkerImpl(jobRepo, resultRepo, qdrantDB, embedder)
    # queue_consumer = initQueueConsumer(worker, jobRepo)

    # queue_consumer.consume_queue() # blocking

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("Interrupted")
        try:
            sys.exit(0) # exit with no problems
        except SystemExit:
           os._exit(0) 
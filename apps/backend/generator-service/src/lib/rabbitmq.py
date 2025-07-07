import uuid
import json
import pika
from domain.resource.message import JobQueueConsumedMessage
from services.worker import WorkerImpl
from lib.logger import initLogger
from geopy.geocoders import Nominatim
from repository.job_repo import JobRepoImpl
from domain.shared.job import Status
import os

# TODO: reformat into a class
# formats message into the resource we need
def format_message(body: bytes) -> JobQueueConsumedMessage:
    data = json.loads(body)

    return JobQueueConsumedMessage(
        job_id=uuid.UUID(data["job_id"]),
        prompt=data["prompt"],
        location=data["location"],
        budget=data["budget"],
    )

def get_loc_str(lat: float, lon: float):
    logger = initLogger("[rabbitmq.py.utils.get_loc_str()]")
    logger.info(f"Getting location string for lat {lat}, lon {lon}")
    geolocator = Nominatim(user_agent=os.getenv("GEOLOCATOR_USER_AGENT"))

    # Displaying Latitude and Longitude
    location = geolocator.reverse((lat, lon))

    # Display location
    logger.info(f"\nLocation of the given Latitude and Longitude: {location}")
    return location

job_repo = JobRepoImpl() # TODO: pass  in as dependency
class QueueConsumer:
    def __init__(self, worker: WorkerImpl, job_repo: JobRepoImpl):
        self.worker = worker
        self.job_repo = job_repo 

    def consume_queue(self):
        logger = initLogger("[QueueConsumer.consume_queue()]")
        def callback(ch, method, properties, body: bytes):
            logger = initLogger("consumer")
            print(f"RECEIVED: {body}")

            formatted_body = format_message(body)
            lat, lon = formatted_body.location["lat"], formatted_body.location["lon"]
            job_id = formatted_body.job_id

            try:
                formatted_body = format_message(body)
                lat, lon = formatted_body.location["lat"], formatted_body.location["lon"]
                loc_str = get_loc_str(lat, lon)


                logger.info("Generating...")
                status = self.worker.generate(job_id, formatted_body.prompt, loc_str, formatted_body.location["lat"], formatted_body.location["lon"], formatted_body.location["radius_km"], formatted_body.budget)

                logger.info(f"STATUS: {status.value}")
                self.job_repo.update_job(job_id, status)
            except Exception as e:
                logger.error(f"ERROR: {e}") 
                ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

                # TODO: update job status to "error"
                self.job_repo.update_job(job_id, Status.ERROR)

                return

            ch.basic_ack(delivery_tag=method.delivery_tag)

        # setup connection to rabbitmq and consume
        # pika works by having an infinite loop that keeps listening for messages.
        connection = pika.BlockingConnection(pika.URLParameters(os.getenv("RABBITMQ_CONNECTION_URL")))
        channel = connection.channel()

        # Declare the queue from which to consume messages
        # Must match the one the producer is producing to
        channel.queue_declare(queue="job_queue", durable=True) # TODO: try durable and not durable

        # Uncomment this to see how the behaviour changes when we limit the prefetch count to 1
        channel.basic_qos(prefetch_count=1)

        channel.basic_consume(queue="job_queue", on_message_callback=callback, auto_ack=False) 
        # set auto_ack to false f\for manual ack and gereater reliability

        logger.info("Waiting for messages...")
        channel.start_consuming() # blocking
        connection.close()

def initQueueConsumer(worker: WorkerImpl, job_repo: JobRepoImpl):
    return QueueConsumer(worker, job_repo)
import uuid
import json
from worker import Worker
import pika
from lib.logger import initLogger
from repository.job_repo import Status
from custom_types import JobQueueConsumedMessage

class QueueConsumer:
    def __init__(self, worker: Worker):
        self.worker = worker

    def _on_message(self, ch, method, properties, body: bytes):
        try:
            logger = initLogger("queue consumer")
            job = self._format_message(body)
            self.worker.process_job(job)
            # formatted_body = format_message(body)
            # lat, lon = formatted_body.location["lat"], formatted_body.location["lon"]
            # loc_str = get_loc_str(lat, lon)

            # logger.info("Generating...")
            # status = self.worker.generate(job_id, formatted_body.prompt, loc_str, formatted_body.location["lat"], formatted_body.location["lon"], formatted_body.location["radius_km"], formatted_body.budget)

            # logger.info(f"STATUS: {status.value}")
            # self.job_repo.update_job(job_id, status)
        except Exception as e:
            logger.error(f"ERROR: {e}") 
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

            # TODO: update job status to "error"
            # self.job_repo.update_job(job.job_id, Status.ERROR)

            return

        ch.basic_ack(delivery_tag=method.delivery_tag)

    # format message in quuee to this shared data type.
    def _format_message(self, body: bytes) -> JobQueueConsumedMessage:
        data = json.loads(body)

        return JobQueueConsumedMessage(
            job_id=uuid.UUID(data["job_id"]),
            prompt=data["prompt"],
            location=data["location"],
            budget=data["budget"],
        )

    def start(self):
        # setup connection to rabbitmq and consume
        # pika works by having an infinite loop that keeps listening for messages.
        connection = pika.BlockingConnection(pika.URLParameters("amqp://guest:guest@localhost:5672/"))
        channel = connection.channel()

        # Declare the queue from which to consume messages
        # Must match the one the producer is producing to
        channel.queue_declare(queue="job_queue", durable=True) # TODO: try durable and not durable

        # Uncomment this to see how the behaviour changes when we limit the prefetch count to 1
        channel.basic_qos(prefetch_count=1)

        channel.basic_consume(queue="job_queue", on_message_callback=self._on_message, auto_ack=False) 
        # set auto_ack to false f\for manual ack and gereater reliability

        print("Waiting for messages...")
        channel.start_consuming() # blocking
        connection.close()
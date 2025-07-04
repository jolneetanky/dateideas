import uuid
import json
import pika
from domain.resource.message import JobQueueConsumedMessage
from services.worker import WorkerImpl
from lib.logger import initLogger

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

def consume_queue(worker: WorkerImpl):
    def callback(ch, method, properties, body: bytes):
        logger = initLogger("consumer")
        print(f"RECEIVED: {body}")

        formatted_body = format_message(body)
        try:
            logger.info("Generating...")
            worker.generate(formatted_body.job_id, formatted_body.prompt, formatted_body.location["lat"], formatted_body.location["lon"], formatted_body.location["radius_km"], formatted_body.budget)
        except Exception as e:
            logger.error(f"ERROR: {e}") 
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
            return

        ch.basic_ack(delivery_tag=method.delivery_tag)

    # setup connection to rabbitmq and consume
    # pika works by having an infinite loop that keeps listening for messages.
    connection = pika.BlockingConnection(pika.URLParameters("amqp://guest:guest@localhost:5672/"))
    channel = connection.channel()

    # Declare the queue from which to consume messages
    # Must match the one the producer is producing to
    channel.queue_declare(queue="job_queue", durable=True) # TODO: try durable and not durable

    # Uncomment this to see how the behaviour changes when we limit the prefetch count to 1
    channel.basic_qos(prefetch_count=1)

    channel.basic_consume(queue="job_queue", on_message_callback=callback, auto_ack=False) 
    # set auto_ack to false f\for manual ack and gereater reliability

    print("Waiting for messages...")
    channel.start_consuming() # blocking
    # try:
    #     channel.start_consuming() # blocks
    # except KeyboardInterrupt:
    #     channel.stop_consuming()
    connection.close()
from custom_types import JobQueueConsumedMessage

class Worker:
    def __init__(self):
        pass

    def process_job(self, job: JobQueueConsumedMessage):
        print("I'm a worker and I'm processing a job")
        # 1. Generate description
        # 2. Select places from placesDB that match
        # 3. Update JobDB with status
        # 4. Update ResultDB with results
        pass
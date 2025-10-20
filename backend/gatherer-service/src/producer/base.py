class Producer():
    # handles a few target cases: "stdout", "queue",
    def __init__(self, target: str = "stdout"):
        self.target = target

    def produce(self, data: list[dict]) -> None:
        if self.target == "stdout":
            print(data)

        elif self.target == "queue":
            print("enqueued:", data)
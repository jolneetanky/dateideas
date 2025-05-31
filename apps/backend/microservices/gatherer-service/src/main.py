from config.logging_config import logger
from factory.factory import build_producer
from factory.factory import build_gatherers

def main() -> None:
    producer = build_producer("queue")
    gatherers = build_gatherers(producer)

    for gatherer in gatherers:
        gatherer.gather()

if __name__ == '__main__':
    main()
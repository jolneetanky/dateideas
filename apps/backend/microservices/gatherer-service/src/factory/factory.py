from producer.base import Producer
from gatherer.base import Gatherer
from gatherer.mock_gatherer import MockGatherer
from gatherer.scraper import Scraper

def build_producer(target: str) -> Producer:
    return Producer(target)

def build_gatherers(producer: Producer) -> list[Gatherer]:
    gatherers = [
        MockGatherer(producer),
        Scraper(producer),
    ]

    return gatherers
from gatherer.base import Gatherer

# a concrete implementation of Gatherer, using mock data.
class MockGatherer(Gatherer):
    def gather(self) -> None:

        data = [
            {"title": "Botanic Gardens", "description": "Nice walk"},
            {"title": "ArtScience Museum", "description": "Sike"},
        ]

        print(self.formatter.format(data))
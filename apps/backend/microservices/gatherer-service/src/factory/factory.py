from gatherer.base import Gatherer
from gatherer.mock_gatherer import MockGatherer
from gatherer.scraper_gatherer import ScraperGatherer
from formatter.base import Formatter
from formatter.scraper_formatter import ScraperFormatter

scraper_formatter = ScraperFormatter()

# initialize scrapers
# mock_gatherer = MockGatherer(scraper_formatter)
scraper_gatherer = ScraperGatherer(scraper_formatter)

def build_gatherers():
    return [
        # mock_gatherer,
        scraper_gatherer,
    ]
from gatherer.base import Gatherer
from gatherer.mock_gatherer import MockGatherer
from gatherer.scraper_gatherer import ScraperGatherer
from gatherer.osm_gatherer import OSMGatherer
from formatter.base import Formatter
from formatter.scraper_formatter import ScraperFormatter
from formatter.osm_formatter import OSMFormatter

scraper_formatter = ScraperFormatter()
osm_formatter = OSMFormatter()

# initialize scrapers
# mock_gatherer = MockGatherer(scraper_formatter)
scraper_gatherer = ScraperGatherer(scraper_formatter)
osm_gatherer = OSMGatherer(osm_formatter)

def build_gatherers():
    return [
        # mock_gatherer,
        # scraper_gatherer,
        osm_gatherer,
    ]
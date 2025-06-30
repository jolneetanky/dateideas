from lib.generator.base import initGenerator
from lib.semantic_filterer.base import initSemanticFilterer
from lib.embedder.base import initEmbedder
from lib.overpass_api.main import initOverpassApiClient

generator = initGenerator()
embedder = initEmbedder()
filterer = initSemanticFilterer(embedder)
overpassApiClient = initOverpassApiClient()
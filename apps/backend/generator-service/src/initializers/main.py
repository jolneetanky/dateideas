from lib.generator.base import initGenerator
from lib.embedder.base import initEmbedder
from lib.overpass_api.main import initOverpassApiClient
from lib.vectordb.qdrant import initQdrantDB

generator = initGenerator()
embedder = initEmbedder()
overpassApiClient = initOverpassApiClient()
qdrantDB = initQdrantDB()
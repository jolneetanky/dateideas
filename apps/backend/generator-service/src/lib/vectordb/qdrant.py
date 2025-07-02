from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from lib.logger import initLogger
from domain.shared.place_data import VectoredPlaceData
from ..vectordb.base import VectorDB

class QdrantDB(VectorDB):
    COLLECTION_NAME = "osm_nodes"
    VECTOR_DIM = 1024

    def initDB(self):
        logger = initLogger("[QdrantDB.initDB()]")
        logger.info("Connecting to Qdrant...")
        # 1. Connect to Qdrant
        self.qdrant_client = QdrantClient(
            url="https://d00548b8-eefd-45ed-9b16-a96ff49d6601.us-west-1-0.aws.cloud.qdrant.io:6333", 
            api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.CfRfdiuExqOs72i32kUasYvnYdIgDnlrHzOfJuzdqqY",
        )

        # 3. Create collection if not exists
        logger.info("Checking if collection exists...")
        try:
            self.qdrant_client.get_collection(self.COLLECTION_NAME)
            logger.info(f"Collection '{self.COLLECTION_NAME}' already exists. Skipping creation.")
        except Exception as e:
            logger.info(f"Collection '{self.COLLECTION_NAME}' not found. Creating new collection...")
            self.qdrant_client.recreate_collection(
                collection_name=self.COLLECTION_NAME,
                vectors_config=VectorParams(size=self.VECTOR_DIM, distance=Distance.COSINE)
            )
    
    def upsertNodes(self, nodes: list[VectoredPlaceData]):
        logger = initLogger("[qdrantDB.upsertNodes()]")
        logger.info("Gathering dummy nodes...")
        # 4. Prepare dummy nodes
        # nodes = overpassApiClient.gather_data("Orchard")[:10] # trim to length 20 first

        # 5. Upsert into Qdrant
        points = [
            PointStruct(
                id=node.id,
                vector=node.vector,
                payload={
                    "lat": node.lat,
                    "lon": node.lon,
                    "tags": node.tags,
                }
            )
            for node in nodes
        ]

        logger.info(f"POINTS: {points}")

        self.qdrant_client.upsert(collection_name=self.COLLECTION_NAME, points=points)

        logger.info(f"Inserted {len(points)} nodes into Qdrant collection '{self.COLLECTION_NAME}'")

    def getTopKNodes(self, vector: list[float], k: int) -> VectoredPlaceData:
        logger = initLogger("[QdrantDB.getTopKNodes()]")
        logger.info(f"Searching for top {k} similar nodes...")

        results = self.qdrant_client.search(
            collection_name=self.COLLECTION_NAME,
            query_vector=vector,
            limit=k
        )

        nodes = []
        # format result
        for res in results:
            lat = res.payload['lat']
            lon = res.payload['lon']
            tags = res.payload['tags']

            node = VectoredPlaceData(res.id, lat, lon, tags, None)
            nodes.append(node)
        return nodes

def initQdrantDB() -> VectorDB:
    return QdrantDB()
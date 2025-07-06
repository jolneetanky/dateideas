from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, Range, PayloadSchemaType
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

        # 4. Set index on lat and lon
        logger.info("Creating indexes on lat and lon...")
        self.qdrant_client.create_payload_index(
            collection_name=self.COLLECTION_NAME,
            field_name="lat",
            field_schema=PayloadSchemaType.FLOAT,
        )

        self.qdrant_client.create_payload_index(
            collection_name=self.COLLECTION_NAME,
            field_name="lon",
            field_schema=PayloadSchemaType.FLOAT,
        )
    
    def testPayload(self):
        res = self.qdrant_client.scroll(
            collection_name=self.COLLECTION_NAME,
            limit=1,
        )[0]
        print("TEST", res)
    
    def upsertNodes(self, nodes: list[VectoredPlaceData]):
        logger = initLogger("[qdrantDB.upsertNodes()]")
        logger.info("Gathering dummy nodes...")

        # 5. Upsert into Qdrant
        points = [
            PointStruct(
                id=node.id,
                vector=node.vector,
                payload={
                    "lat": float(node.lat),
                    "lon": float(node.lon),
                    "tags": node.tags,
                }
            )
            for node in nodes
        ]

        logger.info(f"POINTS: {points}")

        self.qdrant_client.upsert(collection_name=self.COLLECTION_NAME, points=points)

        logger.info(f"Inserted {len(points)} nodes into Qdrant collection '{self.COLLECTION_NAME}'")

    def getTopKNodes(self, vector: list[float], k: int) -> list[VectoredPlaceData]:
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

    def getTopKNodesWithLocation(self, vector: list[float], k: int, lat: float, lon: float, radius_km: float) -> list[VectoredPlaceData]:
        logger = initLogger("[QdrantDB.getTopKNodesWithLocation()]")
        logger.info(f"Searching for top {k} similar nodes near ({lat}, {lon}) within {radius_km}km...")

        # 1° of latitude ≈ 111km
        delta_deg = radius_km / 111.0

        # Construct bounding box
        lat_min, lat_max = lat - delta_deg, lat + delta_deg
        lon_min, lon_max = lon - delta_deg, lon + delta_deg

        # Create filter
        locFilter = Filter(
            must=[
                FieldCondition(key="lat", range=Range(gte=lat_min, lte=lat_max)),
                FieldCondition(key="lon", range=Range(gte=lon_min, lte=lon_max)),
            ]
        )

        results = self.qdrant_client.search(
            collection_name=self.COLLECTION_NAME,
            query_vector=vector,
            limit=k,
            query_filter=locFilter,
        )

        nodes = []
        for res in results:
            lat = res.payload['lat']
            lon = res.payload['lon']
            tags = res.payload['tags']
            node = VectoredPlaceData(res.id, lat, lon, tags, None)
            nodes.append(node)

        return nodes

    def getAllNodes(self):
        logger = initLogger("[QdrantDB.getAllNodes()]")
        logger.info(f"Getting all nodes...")

        all_points = []
        scroll_offset = None

        while True:
            points, next_offset = self.qdrant_client.scroll(
                collection_name=self.COLLECTION_NAME,
                limit=20,
                offset=scroll_offset,
                with_payload=False,
                with_vectors=False,
            )
            all_points.extend([point.id for point in points])
            if next_offset is None:
                break
            scroll_offset = next_offset

        return all_points
    
    def deleteAllNodes(self):
        """
        Deletes all points in the given Qdrant collection.
        """

        print(f"Deleting all points from collection '{self.COLLECTION_NAME}'...")

        self.qdrant_client.delete(
            collection_name=self.COLLECTION_NAME,
            points_selector=Filter(
                must=[]  # An empty filter matches all points
            )
        )

        print(f"All points deleted from '{self.COLLECTION_NAME}'.")

def initQdrantDB() -> QdrantDB:
    return QdrantDB()
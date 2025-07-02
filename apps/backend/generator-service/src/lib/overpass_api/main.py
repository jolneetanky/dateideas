# helper functions to help us interact with overpass API
# also helps us format nicely to PlaceData.
from domain.shared.main import PlaceData
from lib.logger import initLogger
import overpy

class OverpassApiClient:
    def __init__(self):
        self.api = overpy.Overpass()
    
    def gather_data(self, area: str) -> list[PlaceData]:
        res = []
        logger = initLogger("lib.OverpassApiClient.gather_data")
        logger.info("Gathering data...")
        # NOTE: in overpass, we can limit our search to an area + bounding box (so that we don't get results from all over the world.)
        result = self.api.query(f"""
                        area["name:en"="{area}"]->.a;
                        node(area.a)["name"];
                        out center;
                        """)

        logger.info("Formatting nodes...") 
        for node in result.get_nodes():
            res.append(format_node(node))
        logger.info("DONE")
        return res
    
    def get_node_by_id(self, id: str) -> PlaceData:
        logger = initLogger("lib.OverpassApiClient.get_node_by_id")
        logger.info(f"Getting node with ID {id}")
        # NOTE: in overpass, we can limit our search to an area + bounding box (so that we don't get results from all over the world.)
        result = self.api.query(f"""
                        node({id});
                        out;
                        """)
        node = result.get_nodes()[0]
        formatted_node = format_node(node)
        logger.info(f"FORMATTED NODE: {formatted_node}")
        return formatted_node
    
    def query(self, query: str) -> PlaceData:
        result = self.api.query(query)
        nodes = result.get_nodes()
        formatted_nodes = list(map(lambda node: format_node(node), nodes))
        return formatted_nodes

# format nodes into a dict
def format_node(node) -> PlaceData:

    formatted_node = PlaceData(
        id=node.id,
        lat=node.lat,
        lon=node.lon,
        tags=node.tags
    )

    return formatted_node

def initOverpassApiClient():
    return OverpassApiClient()
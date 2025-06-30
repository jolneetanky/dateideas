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
                        area["name:en"={area}]->.a;
                        node(area.a)["name"];
                        out center;
                        """)

        logger.info("Formatting nodes...") 
        for node in result.get_nodes():
            res.append(format_node(node))
        return res
    
    def get_node_by_id(self, id: str):
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
        
    # logger.info("Formatting nodes...") 
    # for node in result.get_nodes():
    #     res.append(format_node(node))
    # return res

# simulates our data gathering + data cleaning svc, for now store in `dateideas` array.
# dateidea: { address, link, img_link, amenity }
# IDEA: for now treat OSM as our "database" which is the source of all our info. If from there we can gather a list of viable dateideas then that's great.
# start with a subset of locations.

# overpass has many tags, we want a recommender that can recommend us ideas based on tags
# for now we'll just filter by name and country lol eg. orchard, Singapore

# PROBLEM: sometimes the location to filter is found in the prompt. How to process?

# What if we pre-process the prompt and extract locations from there??
# have something to help us do that, then we filter data based on those areas:w
# but for now just assume users is good and just gives us a single location.


# format nodes into a dict
def format_node(node) -> PlaceData:
    # tags  we're interested in
    # tag_features = set(['amenity', 'name', 'website'])
    
    # formatted_node = {
    #     "id": node.id,
    #     "lat":  node.lat,
    #     "lon":  node.lon,
    #     "tags": node.tags,
        # "name": node.tags.get("name", ""), # for some reason, this is empthyy string even if node.tags contains `name`
        # "tags": node.tags,

        # "name": node['tags'].get('nayeah im thinking if i should flatten the tme', ""),
        # "street": row['tags'].get('addr:street', ""),
        # "city": row['tags'].get('addr:city', ""),
        # "house_number": row['tags'].get('addr:housenumber', ""),
        # "floor": row['tags'].get('addr:floor', ""),
        # "unit": row['tags'].get('addr:unit', ""),
        # "amenity": "",
        # "website": "",
    # }

    formatted_node = PlaceData(
        id=node.id,
        lat=node.lat,
        lon=node.lon,
        tags=node.tags
    )

    return formatted_node

def initOverpassApiClient():
    return OverpassApiClient()
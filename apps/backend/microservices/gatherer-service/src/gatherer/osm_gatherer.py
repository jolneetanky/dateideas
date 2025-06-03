from gatherer.base import Gatherer
import requests
import json
import overpy

class OSMGatherer(Gatherer):
    def gather(self):
        # fetch data from Overpass API.
        # api = overpy.Overpass()

        # # fetch all ways and nodes
        # # I want to get all nodes in orchard.
        # result = api.query("""
        #     way(50.746,7.154,50.748,7.157) ["highway"];
        #     (._;>;);
        #     out body;
        #     """)
        
        # print("RESULT", result)

        # for way in result.ways:
        #     print("Name: %s" % way.tags.get("name", "n/a"))
        #     print("  Highway: %s" % way.tags.get("highway", "n/a"))
        #     print("  Nodes:")
        #     for node in way.nodes:
        #         print("    Lat: %f, Lon: %f" % (node.lat, node.lon))
        #         print(node.)
        overpass_url = "http://overpass-api.de/api/interpreter"
        overpass_query = """
        [out:json][timeout:25];
        // Define the bounding box (SW Lat, SW Lon, NE Lat, NE Lon)
        (
        node["amenity"](1.3015,103.8315,1.3095,103.8380);
        node["shop"](1.3015,103.8315,1.3095,103.8380);
        node["tourism"](1.3015,103.8315,1.3095,103.8380);
        node["leisure"](1.3015,103.8315,1.3095,103.8380);
        );
        out body;
        >;
        out skel qt;
        """
        response = requests.get(overpass_url, 
                                params={'data': overpass_query})
        data = response.json() 
        print(data)
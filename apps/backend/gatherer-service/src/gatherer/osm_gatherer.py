from gatherer.base import Gatherer
import requests
import json
import overpy

class OSMGatherer(Gatherer):
    def gather(self):
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

        data = response.json()["elements"]
        formatted_data = self.formatter.format(data)
        print(data)
        print("FORMATTED")
        print(formatted_data)
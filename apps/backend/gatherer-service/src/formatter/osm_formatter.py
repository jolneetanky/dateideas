from formatter.base import Formatter
from formatter.base import FormattedData
from urllib.parse import quote

class OSMFormatter(Formatter):
    def format(self, data) -> FormattedData:
        tag_features = set(['amenity', 'name', 'website'])

        res = []
        for row in data:
            row = row.copy()
            
            dct = {
                "name": row['tags'].get('name', ""),
                "street": row['tags'].get('addr:street', ""),
                "city": row['tags'].get('addr:city', ""),
                "house_number": row['tags'].get('addr:housenumber', ""),
                "floor": row['tags'].get('addr:floor', ""),
                "unit": row['tags'].get('addr:unit', ""),
            }

            for k, v in dct.items():
                row[k] = v

            query = dct['name']
            if query != "":
                query += f", {dct['street']}"
            formatted_query = quote(query)
            if query == "":
                formatted_query = quote(f"{row['lat']},{row['lon']}")    
            gmaps_link = f"https://google.com/maps/search/?api=1&query={formatted_query}"

            row['link'] = gmaps_link
            # row['address'] = addr

            # flatten `tags`
            for k, v in row.get('tags', {}).items():
                if k in tag_features:
                    row[k] = v
            
            # remove unneeded fields
            row.pop('type', '')
            row.pop('id', '')
            row.pop('tags', {})
            res.append(row)
        
        return res
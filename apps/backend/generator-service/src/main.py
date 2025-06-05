from urllib.parse import quote
from dataclasses import dataclass
from generator.ollama_generator import OllamaGenerator
@dataclass
class FormattedData(): 
    name: str
    amenity: str
    lat: str
    lon: str
    street: str
    city: str
    house_number: str
    floor: str
    unit: str
    website: str
    link: str

mock_data = [
    {'type': 'node', 'id': 11663229533, 'lat': 1.3070705, 'lon': 103.8337662, 'tags': {'access': 'permissive', 'amenity': 'drinking_water', 'bottle': 'yes', 'fee': 'no'}},
    {'type': 'node', 'id': 11663229536, 'lat': 1.3057988, 'lon': 103.831926, 'tags': {'addr:housenumber': '350', 'addr:street': 'Orchard Road', 'air_conditioning': 'yes', 'amenity': 'restaurant', 'check_date': '2024-02-25', 'cuisine': 'japanese', 'diet:vegetarian': 'yes', 'level': '0', 'name': 'Aburi En', 'outdoor_seating': 'no', 'payment:cash': 'yes', 'payment:credit_cards': 'yes', 'payment:debit_cards': 'yes'}},
    {'type': 'node', 'id': 11663229543, 'lat': 1.3070445, 'lon': 103.8337414, 'tags': {'access': 'yes', 'amenity': 'toilets', 'check_date': '2024-02-24'}},
    {'type': 'node', 'id': 11663229544, 'lat': 1.3071143, 'lon': 103.8338507, 'tags': {'addr:floor': '2', 'addr:housenumber': '14', 'addr:street': 'Scotts Road', 'amenity': 'cafe', 'check_date': '2024-02-24', 'level': '1', 'name': 'Good Morning Nanyang Cafe'}},
    {'type': 'node', 'id': 11663229545, 'lat': 1.306957, 'lon': 103.8337088, 'tags': {'addr:housenumber': '#02-106', 'addr:street': '14 Scotts Road, Far East Plaza', 'check_date': '2024-02-24', 'level': '1', 'name': 'Watch Hunt', 'shop': 'watches'}},
    {'type': 'node', 'id': 11663229547, 'lat': 1.3057002, 'lon': 103.8318578, 'tags': {'addr:housenumber': '350', 'addr:street': 'Orchard Road', 'amenity': 'ice_cream', 'brand': 'Gelatissimo', 'brand:wikidata': 'Q105270111', 'check_date': '2024-02-24', 'cuisine': 'ice_cream', 'level': '0', 'name': 'Gelatissimo', 'takeaway': 'only'}},
    {'type': 'node', 'id': 11663229548, 'lat': 1.3072663, 'lon': 103.8337311, 'tags': {'addr:floor': '2', 'addr:housenumber': '#02-94', 'addr:street': '14 Scotts Rd', 'air_conditioning': 'yes', 'amenity': 'cafe', 'check_date': '2024-02-24', 'cuisine': 'coffee_shop', 'level': '1', 'name': 'Community Coffee', 'outdoor_seating': 'no'}},
    {'type': 'node', 'id': 11724980052, 'lat': 1.3070112, 'lon': 103.833273, 'tags': {'alt_name': "Dunkin' Donuts", 'amenity': 'fast_food', 'brand': "Dunkin'", 'brand:wikidata': 'Q847743', 'check_date': '2024-03-12', 'cuisine': 'donut;coffee_shop', 'level': '0', 'name': "Dunkin'", 'takeaway': 'yes'}},
    {'type': 'node', 'id': 11724980053, 'lat': 1.3068585, 'lon': 103.8332013, 'tags': {'amenity': 'fast_food', 'check_date': '2024-03-12', 'cuisine': 'korean', 'name': 'Seoul Bunsik'}},
    {'type': 'node', 'id': 11724980055, 'lat': 1.3069226, 'lon': 103.8332277, 'tags': {'amenity': 'ice_cream', 'check_date': '2024-03-12', 'name': 'Ice Lab'}},
    {'type': 'node', 'id': 11724980056, 'lat': 1.3074978, 'lon': 103.8333595, 'tags': {'amenity': 'cafe', 'check_date': '2024-03-12', 'cuisine': 'bubble_tea', 'name': 'Hi Tea'}},
    {'type': 'node', 'id': 11743566717, 'lat': 1.3072375, 'lon': 103.8355633, 'tags': {'amenity': 'parking_entrance'}},
    {'type': 'node', 'id': 12206907457, 'lat': 1.3047491, 'lon': 103.8338135, 'tags': {'addr:unit': '01-43', 'air_conditioning': 'yes', 'amenity': 'restaurant', 'level': '0', 'name': 'Bebek Goreng Pak Ngdut', 'payment:mastercard': 'yes', 'payment:mastercard_contactless': 'yes', 'payment:visa': 'yes', 'payment:visa_contactless': 'yes'}},
    {'type': 'node', 'id': 12206907458, 'lat': 1.3030974, 'lon': 103.8362816, 'tags': {'addr:city': 'Singapore', 'addr:country': 'SG', 'addr:housenumber': '270', 'addr:postcode': '238857', 'addr:street': 'Orchard Road', 'addr:unit': '03-02', 'amenity': 'bank', 'brand': 'UOB', 'brand:zh': '大华银行', 'name': 'UOB Privilege Banking', 'name:zh': '大华银行'}},
    {'type': 'node', 'id': 12231175231, 'lat': 1.3039667, 'lon': 103.8356428, 'tags': {'addr:housenumber': '#B1-07', 'addr:street': 'Paragon', 'amenity': 'restaurant', 'name': '三盅兩件 Soup Restaurant'}},
    {'type': 'node', 'id': 12531878544, 'lat': 1.3033118, 'lon': 103.8357536, 'tags': {'addr:housenumber': '#B1-30/31', 'addr:street': 'Paragon', 'name': 'iStudio', 'shop': 'electronics'}},
    {'type': 'node', 'id': 12769447601, 'lat': 1.302079, 'lon': 103.83669, 'tags': {'addr:housenumber': '333A #03', 'addr:postcode': '238897', 'addr:street': 'Orchard Road', 'amenity': 'cafe', 'cuisine': 'breakfast;coffee_shop;vegetarian', 'name': 'WILD HONEY', 'phone': '+65 6235 3900', 'website': 'https://www.wildhoney.com.sg/'}},
    {'type': 'node', 'id': 12798233450, 'lat': 1.3072114, 'lon': 103.8333749, 'tags': {'addr:floor': '2', 'addr:housenumber': '14', 'addr:postcode': '228213', 'addr:street': 'Scotts Road', 'addr:unit': '52', 'brand': 'Apple;CMF by Nothing;Google;HONOR;Nokia;Nothing;OnePlus;OPPO;Realme;Samsung;Sharp;vivo;Xiaomi', 'contact:facebook': 'https://www.facebook.com/mobyshopsingapore', 'contact:twitter': 'https://twitter.com/mobysingapore', 'email': 'sales@mobyshop.com.sg', 'level': '1', 'name': 'Mobyshop', 'opening_hours': 'Mo-Sa 12:00-21:00; Su,PH 12:00-20:00', 'payment:cash': 'yes', 'payment:credit_cards': 'yes', 'payment:mastercard': 'yes', 'payment:visa': 'yes', 'payment:wire_transfer': 'yes', 'phone': '+65 6733 4110', 'second_hand': 'yes', 'shop': 'mobile_phone', 'short_name': 'Moby', 'website': 'https://mobyshop.com.sg/'}},
]
mock_query = "Date for 2 at orchard cafe"

# flatten tags and see how it goes lol
# this should be in gatherer service.
def format_data(data):
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

def main():
    ollama_generator = OllamaGenerator()
    mock_formatted_data = format_data(mock_data)
    print(ollama_generator.generate("Date for 2 in orchard", mock_formatted_data))

if __name__ == '__main__':
    main()
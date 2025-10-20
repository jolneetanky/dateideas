from dataclasses import dataclass

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
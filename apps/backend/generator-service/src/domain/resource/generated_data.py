from dataclasses import dataclass

# This is the return type of our generator service.
@dataclass
class GeneratedData:
    name: str = ""
    amenity: str = ""
    street: str = ""
    city: str = ""
    house_number: str = ""
    floor: str = ""
    unit: str = ""
    website: str = ""
    link: str = ""
    budget: str = ""
    description: str = ""
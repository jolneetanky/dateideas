from domain.shared.place_data import PlaceData

def stringifyPlaceData(node: PlaceData):
    return f"""
    latitude: {node.lat},
    longitude: {node.lon},
    tags: {node.tags}
    """
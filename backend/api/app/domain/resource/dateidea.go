package resource

type DateLocation struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	Amenity string `json:"amenity"`
	Link    string `json:"link"`
	Address string `json:"address"`
}

type DateIdea struct {
	Description   string         `json:"description"`
	DateLocations []DateLocation `json:"date_locations"`
}

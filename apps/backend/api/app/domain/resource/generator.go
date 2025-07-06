package resource

type FilterOptions struct {
	Location string `json:"location"`
	Budget   int    `json:"budget"`
}

type Location struct {
	Lat      float64 `json:"lat"`
	Lon      float64 `json:"lon"`
	RadiusKm float64 `json:"radius_km"`
}
type GenerateIdeasRequest struct {
	Prompt   string   `json:"prompt"`
	Location Location `json:"location"`
	Budget   int      `json:"budget"`
}

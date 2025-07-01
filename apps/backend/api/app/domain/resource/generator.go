package resource

type FilterOptions struct {
	Location string `json:"location"`
	Budget   int    `json:"budget"`
}
type GenerateIdeasRequest struct {
	Prompt   string `json:"prompt"`
	Location string `json:"location"`
	Budget   int    `json:"budget"`
}

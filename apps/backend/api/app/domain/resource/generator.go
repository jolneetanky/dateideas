package resource

type FilterOptions struct {
	Location string `json:"location"`
	Budget   int    `json:"budget"`
}
type GenerateIdeasRequest struct {
	Prompt string `json:"prompt" binding:"required"`
	// Filters *FilterOptions/* Pointer to some object of type `FilterOptions` */ `json:"filters"`
	Location string `json:"location"`
	Budget   int    `json:"budget"`
}

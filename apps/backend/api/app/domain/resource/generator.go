package resource

type FilterOptions struct {
	Location string
	Budget   int
}
type GenerateIdeasRequest struct {
	Prompt  string         `json:"prompt" binding:"required"`
	Filters *FilterOptions // Pointer to some object of type `FilterOptions`
}

package resource

// Creating enum-like type for `Status`
type Status string

// Enum-like constants for `Status`
const (
	Success Status = "success"
	Error   Status = "error"
)

type ApiResponse[T any] struct {
	Status  Status `json:"status"`
	Message string `json:"message"`
	Error   string `json:"error"`
	Data    T      `json:"data"`
}

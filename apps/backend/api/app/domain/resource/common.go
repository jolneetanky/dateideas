package resource

type CursorResponse[T any] struct {
	Data       T      `json:"data"`
	NextCursor string `json:"next_cursor"`
}

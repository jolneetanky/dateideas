package resource

type CursorResponse[T any] struct {
	Data       T      `json:"data"`
	PrevCursor string `json:"prev_cursor"`
	NextCursor string `json:"next_cursor"`
}

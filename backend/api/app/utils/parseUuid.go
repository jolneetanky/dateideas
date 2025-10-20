package utils

import "github.com/google/uuid"

func ParseUUID(s string) (uuid.UUID, error) {
	id, err := uuid.Parse(s)
	if err != nil {
		return uuid.Nil, err // Invalid UUID string
	}
	return id, nil
}

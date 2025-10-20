package utils

import (
	"github.com/google/uuid"
)

func GenerateJobId() string {
	uuid := uuid.New()

	return uuid.String()
}

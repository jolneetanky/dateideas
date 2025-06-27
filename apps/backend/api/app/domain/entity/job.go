package entity

import "github.com/google/uuid"

type Job struct {
	ID     uuid.UUID `gorm:"type:uuid;primaryKey"`
	Status string
}

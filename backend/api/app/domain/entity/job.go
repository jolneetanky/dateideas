package entity

import "github.com/google/uuid"

type JobStatus string

const (
	JobStatusPending   JobStatus = "pending"
	JobStatusSucceeded JobStatus = "succeeded"
	JobStatusFailed    JobStatus = "failed"
)

type Job struct {
	ID     uuid.UUID `gorm:"type:uuid;primaryKey"`
	Status JobStatus
}

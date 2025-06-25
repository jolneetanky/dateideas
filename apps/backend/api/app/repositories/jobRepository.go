package repositories

import "github.com/google/uuid"

type JobRepository interface {
	GetStatus(jobId uuid.UUID) (status string, err error)
}

type JobRepositoryImpl struct {
}

// implement methods
func (jr JobRepositoryImpl) GetStatus(jobId uuid.UUID) (status string, err error) {
	// TODO: integrate with actual DB via gorm
	return "success", nil
}

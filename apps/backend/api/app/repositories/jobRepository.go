package repositories

import (
	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/db"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"gorm.io/gorm"
)

type JobRepository interface {
	GetStatus(jobId uuid.UUID) (status string, err error)
}

type JobRepositoryImpl struct {
	db *gorm.DB
}

func InitJobRepoImpl(db *gorm.DB) JobRepositoryImpl {
	return JobRepositoryImpl{db}
}

// implement methods
func (jr JobRepositoryImpl) GetStatus(jobId uuid.UUID) (status string, err error) {
	// TODO: integrate with actual DB via gorm
	logger.Info("Getting status...")

	// job := &db.Job
	var job db.Job
	err = jr.db.Where(&db.Job{ID: jobId}, "id").First(&job).Error

	if err != nil {
		return "", err
	}

	return job.Status, nil
}

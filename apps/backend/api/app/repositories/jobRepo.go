package repositories

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/entity"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"gorm.io/gorm"
)

type JobRepository interface {
	GetStatus(jobId uuid.UUID) (status entity.JobStatus, err error)
	PostJob(jobId uuid.UUID, status entity.JobStatus) (err error)
}

type JobRepositoryImpl struct {
	db *gorm.DB
}

func InitJobRepoImpl(db *gorm.DB) JobRepositoryImpl {
	return JobRepositoryImpl{db}
}

// implement methods
func (jr JobRepositoryImpl) GetStatus(jobId uuid.UUID) (status entity.JobStatus, err error) {
	// TODO: integrate with actual DB via gorm
	logger.Info("Getting status...")

	// job := &db.Job
	var job entity.Job
	// err = jr.db.Error
	err = jr.db.Where(&entity.Job{ID: jobId}, "id").First(&job).Error

	if err != nil {
		logger.Error(fmt.Sprintf("Failed to get status for jobID %s", jobId))
		return "", err
	}

	return job.Status, nil
}

func (jr JobRepositoryImpl) PostJob(jobId uuid.UUID, status entity.JobStatus) (err error) {
	logger.Info(fmt.Sprintf("Inserting jobID %s with status %s", jobId, status))
	job := entity.Job{ID: jobId, Status: status}
	err = jr.db.Create(&job).Error

	if err != nil {
		logger.Error(fmt.Sprintf("Failed to insert job: %s", err.Error()))
		return err
	}

	logger.Info("Successfully inserted job")

	return nil
}

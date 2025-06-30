package repositories

import (
	"errors"

	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/entity"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"gorm.io/gorm"
)

type ResultRepository interface {
	GetResultsByJobId(jobId uuid.UUID) (results []entity.Result, err error)
}

type ResultRepositoryImpl struct {
	db *gorm.DB
}

func InitResultRepoImpl(db *gorm.DB) ResultRepositoryImpl {
	return ResultRepositoryImpl{db}
}

// implement methods
func (rr ResultRepositoryImpl) GetResultsByJobId(jobId uuid.UUID) (results []entity.Result, err error) {
	// TODO: integrate with actual DB via gorm
	logger.Info("Getting results by job ID...")

	// job := &db.Job
	err = rr.db.Where("job_id = ?", jobId).Find(&results).Error
	// err = jr.db.Error
	// err = rr.db.Find(&entity.Result{JobID: jobId}, "job_id").First(&job).Error

	if err != nil {
		return nil, err
	}

	if len(results) == 0 {
		return nil, errors.New("not found")
	}

	return results, nil
}

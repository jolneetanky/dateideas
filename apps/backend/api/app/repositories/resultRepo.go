package repositories

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/entity"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"gorm.io/gorm"
)

type ResultRepository interface {
	GetResultsByJobId(jobId uuid.UUID, after uint, limit int) (results []entity.Result, err error)
}

type ResultRepositoryImpl struct {
	db *gorm.DB
}

func InitResultRepoImpl(db *gorm.DB) ResultRepositoryImpl {
	return ResultRepositoryImpl{db}
}

// implement methods
func (rr ResultRepositoryImpl) GetResultsByJobId(jobId uuid.UUID, after uint, limit int) (results []entity.Result, err error) {
	// TODO: paginate
	logger.Info(fmt.Sprintf("Getting results by job ID %s. Page: %d, Limit: %d", jobId, after, limit))

	// err = rr.db.Where("job_id = ?", jobId).Find(&results).Error

	err = rr.db.
		Where("job_id = ? AND id > ?", jobId, after).
		Order("id").
		Limit(limit).
		Find(&results).Error

	if err != nil {
		logger.Error(fmt.Sprintf("Failed to get results by jobID. Error: %s", err.Error()))
		return nil, err
	}

	if len(results) == 0 {
		return nil, errors.New("result not found")
	}

	return results, nil
}

package repositories

import (
	"errors"
	"fmt"
	"slices"

	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/backend/api/app/domain/entity"
	"github.com/jolneetanky/dateideas/backend/api/app/lib/logger"
	"gorm.io/gorm"
)

type ResultRepository interface {
	GetResultsByJobId(jobId uuid.UUID, after uint, limit int) (results []entity.Result, err error)
	GetResultsMoreThan(jobId uuid.UUID, cursor uint, limit int) (results []entity.Result, err error)
	GetResultsLessThan(jobId uuid.UUID, cursor uint, limit int) (results []entity.Result, err error)
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

func (rr ResultRepositoryImpl) GetResultsMoreThan(jobId uuid.UUID, cursor uint, limit int) (results []entity.Result, err error) {
	logger.Info(fmt.Sprintf("Getting results greater than result ID %d. jobID: %d, Limit: %d", cursor, jobId, limit))

	err = rr.db.Where("job_id = ? AND id > ?", jobId, cursor).Order("id").Limit(limit).Find(&results).Error

	if err != nil {
		logger.Error(fmt.Sprintf("Failed to get results. Error: %s", err.Error()))
		return nil, err
	}

	if len(results) == 0 {
		return nil, errors.New("result not found")
	}

	return results, nil
}

// returns the top `limit` results withid < `cursor`.
func (rr ResultRepositoryImpl) GetResultsLessThan(jobId uuid.UUID, cursor uint, limit int) (results []entity.Result, err error) {
	logger.Info(fmt.Sprintf("Getting results greater than result ID %d. jobID: %d, Limit: %d", cursor, jobId, limit))

	err = rr.db.Where("job_id = ? AND id < ?", jobId, cursor).Order("id DESC").Limit(limit).Find(&results).Error

	if err != nil {
		logger.Error(fmt.Sprintf("Failed to get results. Error: %s", err.Error()))
		return nil, err
	}

	if len(results) == 0 {
		return nil, errors.New("result not found")
	}

	slices.Reverse(results) // Reverse elements of slice in place, so it's now in asc order

	return results, nil
}

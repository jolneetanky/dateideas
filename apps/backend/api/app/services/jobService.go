package services

import (
	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/repositories"
)

// Define interface
type JobService interface {
	GetStatus(jobId string) (status string, err error)
}

// Define implementation struct
type JobServiceImpl struct {
	repo repositories.JobRepositoryImpl
}

// Constructor to initialize GeneratorServiceImpl
func InitJobServiceImpl() JobServiceImpl {
	return JobServiceImpl{}
}

func (js JobServiceImpl) GetStatus(jobId string) (status string, err error) {
	logger.Info("Getting status...")
	// format to uuid
	id, parseErr := uuid.Parse(jobId)

	if parseErr != nil {
		return "", parseErr
	}

	// pass uuid to repo layer
	status, repoErr := js.repo.GetStatus(id)

	if repoErr != nil {
		return "", repoErr
	} else {
		return status, nil
	}
}

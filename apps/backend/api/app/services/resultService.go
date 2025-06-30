package services

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/repositories"
)

// Define interface
type ResultService interface {
	// TODO: return a list of dateideaids for now
	// then from those dateideaids, fetch the dateideas
	// FINAL: return a paginated list of DateIdeas.
	GetResultsByJobId(jobId uuid.UUID) (dateIdeaIds []string, err error)
}

// Define implementation struct
type ResultServiceImpl struct {
	resultRepo repositories.ResultRepositoryImpl
	// dateideasrepo
}

// Constructor to initialize GeneratorServiceImpl
func InitResultServiceImpl(resultRepo repositories.ResultRepositoryImpl) ResultServiceImpl {
	return ResultServiceImpl{resultRepo: resultRepo}
}

func (rs ResultServiceImpl) GetResultsByJobId(jobId uuid.UUID) (nodeIds []string, err error) {
	logger.Info(fmt.Sprintf("Getting results for job ID: %s", jobId))

	results, err := rs.resultRepo.GetResultsByJobId(jobId)

	if err != nil {
		logger.Error(fmt.Sprintf("Error getting results for job ID %s: %s", jobId, err.Error()))
		return nil, err
	}

	// Extract nodeIDs
	nodeIds = make([]string, len(results))
	for i, res := range results {
		nodeIds[i] = res.NodeID
	}

	return nodeIds, nil

}

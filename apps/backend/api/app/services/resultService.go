package services

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/resource"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/overpassclient"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/repositories"
)

// Define interface
type ResultService interface {
	GetResultsByJobId(jobId uuid.UUID, after uint, limit int) (result resource.DateIdea, nextCursor uint, err error)
}

// Define implementation struct
type ResultServiceImpl struct {
	resultRepo repositories.ResultRepositoryImpl
}

// Constructor to initialize GeneratorServiceImpl
func InitResultServiceImpl(resultRepo repositories.ResultRepositoryImpl) ResultServiceImpl {
	return ResultServiceImpl{resultRepo: resultRepo}
}

// WITHOUT BATCHING
func (rs ResultServiceImpl) GetResultsByJobIdPrev(jobId uuid.UUID, page int, limit int) (result resource.DateIdea, err error) {
	logger.Info(fmt.Sprintf("Getting results for job ID: %s", jobId))

	if err != nil {
		logger.Error(fmt.Sprintf("Error getting results for job ID %s: %s", jobId, err.Error()))
		return resource.DateIdea{}, err
	}

	mockRepo := repositories.InitMockResultRepoImpl()
	results, err := mockRepo.GetResultsByJobId(jobId, page, limit)

	// Extract nodeIDs
	nodeIds := make([]string, len(results))
	locations := make([]resource.DateLocation, len(results))

	// Fetch nodes from overpass, using the result nodeIDs
	// TODO: batch requests (eg. request 10)
	overpassClient := overpassclient.InitOverpassClient()

	for i, res := range results {
		nodeIds[i] = res.NodeID
		// Fetch from overpass
		node, err := overpassClient.GetNodeById(res.NodeID)

		if err != nil {
			return resource.DateIdea{}, err
		}

		formattedNode := overpassClient.FormatNode(node)
		logger.Info(fmt.Sprintf("FORMATTED NODE: %+v", formattedNode))
		locations[i] = formattedNode
	}

	result = resource.DateIdea{
		Description:   results[0].Description,
		DateLocations: locations,
	}

	return result, nil

}

// WITH BATCHING
func (rs ResultServiceImpl) GetResultsByJobId(jobId uuid.UUID, after uint, limit int) (result resource.DateIdea, nextCursor uint, err error) {
	logger.Info(fmt.Sprintf("Getting results for job ID: %s", jobId))

	// replace with mock repo if for some reason workers are not working properly
	// mockRepo := repositories.InitMockResultRepoImpl()
	// results, err := mockRepo.GetResultsByJobId(jobId, page, limit)

	// Get results from repo
	results, err := rs.resultRepo.GetResultsByJobId(jobId, after, limit)

	if err != nil {
		logger.Error(fmt.Sprintf("Error getting results for job ID %s: %s", jobId, err.Error()))
		return resource.DateIdea{}, 0, err
	}

	// Extract nodeIDs
	nodeIds := make([]string, len(results))

	for i, res := range results {
		nodeIds[i] = res.NodeID
	}

	// Batch request to Overpass
	logger.Info("Fetching nodes by ID from Overpass...")
	overpassClient := overpassclient.InitOverpassClient()
	nodes, err := overpassClient.GetNodesByIds(nodeIds)

	if err != nil {
		return resource.DateIdea{}, 0, err
	}

	// format nodes
	logger.Info("Formatting Overpass nodes into DateLocation...")
	dateLocations := make([]resource.DateLocation, len(nodes))
	for i, node := range nodes {
		dateLocations[i] = overpassClient.FormatNode(node)
	}

	result = resource.DateIdea{
		Description:   results[0].Description,
		DateLocations: dateLocations,
	}

	if len(dateLocations) > 0 {
		nextCursor = results[len(results)-1].ID
	}

	logger.Info("Done fetching and formatting Overpass nodes")

	return result, nextCursor, nil

}

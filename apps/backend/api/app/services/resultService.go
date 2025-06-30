package services

import (
	"fmt"
	"strconv"

	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/repositories"

	"github.com/serjvanilla/go-overpass"
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

func GetNodesById(id string) {
	logger.Info(fmt.Sprintf("Getting nodes by ID %s", id))
	// Create a new Overpass client
	client := overpass.New() // Or your self-hosted Overpass instance

	// Define your Overpass QL query
	query := fmt.Sprintf(`
    	[out:json];
    	node(%s);
    	out body;
		`, id,
	)

	// Execute the query
	result, err := client.Query(query)
	logger.Info(fmt.Sprintf("RESULT: %+v", result))
	if err != nil {
		logger.Error(fmt.Sprintf("Error executing Overpass query: %v", err))
	}

	// Process the results
	idInt, err := strconv.ParseInt(id, 10, 64)

	if err != nil {
		logger.Error(fmt.Sprintf("Invalid ID: %v", err))
	}

	node, ok := result.Nodes[idInt]
	if !ok {
		logger.Error("Node not found in result")
	} else {
		logger.Info(fmt.Sprintf("Node found: %+v", node))
	}
	logger.Info(fmt.Sprintf("%v", node))
	// fmt.Printf("Tags: %v", node.Tags)
	// fmt.Printf("Found %d elements:\n", len(result.Nodes))
	// for _, el := range result.Elements {
	// 	fmt.Printf("  Type: %s, ID: %d, Tags: %v\n", el.Type, el.ID, el.Tags)
	// }
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
	// nodes := make([]string, len(results))
	for i, res := range results {
		nodeIds[i] = res.NodeID
		GetNodesById(res.NodeID)
	}

	// TODO: fetch from overpass API

	return nodeIds, nil

}

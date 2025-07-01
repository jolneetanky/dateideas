package services

import (
	"errors"
	"fmt"
	"net/url"
	"strconv"

	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/resource"
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

func FormatNode(node *overpass.Node) resource.DateLocation {

	id := strconv.FormatInt(node.ID, 10)
	lat := node.Lat
	lon := node.Lon
	name := node.Tags["name"]
	amenity := node.Tags["amenity"]
	street := node.Tags["addr:street"]
	city := node.Tags["addr:city"]
	houseNumber := node.Tags["addr:housenumber"]
	floor := node.Tags["addr:floor"]
	unit := node.Tags["addr:unit"]

	// Some nodes use "website", others might use "contact:website" or "url"
	// link := node.Tags["website"]
	// if link == "" {
	// 	link = node.Tags["contact:website"]
	// }
	// if link == "" {
	// 	link = node.Tags["url"]
	// }
	query := ""
	if name != "" && street != "" {
		query += name + ", " + street
	}

	var formattedQuery string
	if query != "" {
		formattedQuery = url.QueryEscape(query)
	} else {
		lat := fmt.Sprintf("%v", lat)
		lon := fmt.Sprintf("%v", lon)
		formattedQuery = url.QueryEscape(lat + "," + lon)
	}

	gmapsLink := fmt.Sprintf("https://google.com/maps/search/?api=1&query=%s", formattedQuery)

	address := fmt.Sprintf("%s, %s, %s, %s, %s", street, city, houseNumber, floor, unit)

	return resource.DateLocation{
		Id:      id,
		Name:    name,
		Amenity: amenity,
		Link:    gmapsLink,
		Address: address,
	}
}

func GetNodeById(id string) (node *overpass.Node, err error) {
	logger.Info(fmt.Sprintf("Getting node by ID %s", id))
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
		return nil, err
	}

	// Process the results
	idInt, err := strconv.ParseInt(id, 10, 64)

	if err != nil {
		logger.Error(fmt.Sprintf("Invalid ID: %v", err))
	}

	node, ok := result.Nodes[idInt]
	if !ok {
		logger.Error("Node not found in overpass")
		return nil, errors.New("node not found in overpass")
	} else {
		logger.Info(fmt.Sprintf("Node found: %+v", node))
		return node, nil
	}
}

func (rs ResultServiceImpl) GetResultsByJobId(jobId uuid.UUID) (result resource.DateIdea, err error) {
	logger.Info(fmt.Sprintf("Getting results for job ID: %s", jobId))

	results, err := rs.resultRepo.GetResultsByJobId(jobId)

	if err != nil {
		logger.Error(fmt.Sprintf("Error getting results for job ID %s: %s", jobId, err.Error()))
		return resource.DateIdea{}, err
	}

	// Extract nodeIDs
	nodeIds := make([]string, len(results))
	locations := make([]resource.DateLocation, len(results))
	for i, res := range results {
		nodeIds[i] = res.NodeID
		node, err := GetNodeById(res.NodeID)

		if err != nil {
			return resource.DateIdea{}, err
		}

		formattedNode := FormatNode(node)
		logger.Info(fmt.Sprintf("FORMATTED NODE: %+v", formattedNode))
		locations[i] = formattedNode
	}

	result = resource.DateIdea{
		Description:   results[0].Description,
		DateLocations: locations,
	}

	// TODO: fetch from overpass API

	return result, nil

}

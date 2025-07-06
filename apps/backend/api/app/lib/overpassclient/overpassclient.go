package overpassclient

import (
	"errors"
	"fmt"
	"net/url"
	"strconv"
	"strings"

	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/resource"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"github.com/serjvanilla/go-overpass"
)

// Define overpass client
type OverpassClient struct {
	client     overpass.Client
	QUERYLIMIT int
}

func InitOverpassClient() OverpassClient {
	client := overpass.New()
	return OverpassClient{client, 500}
}

func (oc OverpassClient) GetNodesByIds(ids []string) (nodes []*overpass.Node, err error) {
	logger.Info(fmt.Sprintf("Getting node by ids"))

	// 1. Check limit
	if len(ids) >= oc.QUERYLIMIT {
		return nil, errors.New("cannot query >= 500 nodes from overpass at a time")
	}

	// 2. Format IDs into Overpass  QL syntax: node(id1, id2, ...);
	idClause := strings.Join(ids, ",")

	// 3. Define your Overpass QL query
	query := fmt.Sprintf(`
    	[out:json];
    	node(id:%s);
    	out body;
		`, idClause,
	)

	logger.Info(fmt.Sprintf("Querying overpass to get nodes by IDs. Query: %s"), idClause)

	// 4. Execute the query
	result, err := oc.client.Query(query)
	logger.Info(fmt.Sprintf("RESULT: %+v", result))
	if err != nil {
		logger.Error(fmt.Sprintf("Error executing Overpass query: %v", err))
		return nil, err
	}

	// 5. Collect found nodes
	var foundNodes []*overpass.Node
	for _, idStr := range ids {
		// convert to int so we can take from result
		idInt, _ := strconv.ParseInt(idStr, 10, 64)

		node, ok := result.Nodes[idInt]
		if !ok {
			logger.Error(fmt.Sprintf("Node ID %d not found in Overpass response", idInt))
			continue
		}
		foundNodes = append(foundNodes, node)
	}
	return foundNodes, nil
}

func (oc OverpassClient) GetNodeById(id string) (node *overpass.Node, err error) {
	logger.Info(fmt.Sprintf("Getting node by ID %s", id))

	// Define your Overpass QL query
	query := fmt.Sprintf(`
    	[out:json];
    	node(%s);
    	out body;
		`, id,
	)

	// Execute the query
	result, err := oc.client.Query(query)
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

func (oc OverpassClient) FormatNode(node *overpass.Node) resource.DateLocation {

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

package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jolneetanky/dateideas/backend/api/app/domain/resource"
	"github.com/jolneetanky/dateideas/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/backend/api/app/services"
)

// Define interface
type GeneratorController interface {
	Generate(c *gin.Context)
}

// Define implementation struct; this `struct` implements the interface.
type GeneratorControllerImpl struct {
	service services.GeneratorService
}

// Constructor to create instance of GeneratorControllerImpl
func InitGeneratorControllerImpl(service services.GeneratorService) GeneratorControllerImpl {
	return GeneratorControllerImpl{service: service}
}

// Implement methods
func (gc GeneratorControllerImpl) Generate(c *gin.Context) {
	logger.Info("Formatting request...")
	// start with default "nil" value for the request
	generateIdeasRequest := resource.GenerateIdeasRequest{
		Prompt:   "",
		Location: resource.Location{Lat: 1.3773129, Lon: 103.9284515, RadiusKm: 5.0},
		Budget:   -1,
	}

	bindErr := c.ShouldBindJSON(&generateIdeasRequest) // See if we can bind the request to `generateIdeasRequest`

	if bindErr != nil {
		logger.Info(fmt.Sprintf("Error binding request: %s", bindErr.Error()))
		c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
			Status:  resource.Error,
			Message: "Failed to generate ideas",
			Error:   "Bad request format. Check your request params and make sure it aligns with the API specifications.",
			Data:    nil,
		})
		return
	}

	jobId, err := gc.service.Generate(generateIdeasRequest.Prompt, generateIdeasRequest.Location, generateIdeasRequest.Budget)

	if err != nil {
		logger.Error(fmt.Sprintf("Failed to generate ideas. Error: %s", err))
		c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
			Status:  resource.Error,
			Message: "Failed to generate ideas",
			Error:   err.Error(),
			Data:    nil,
		})
	} else {
		logger.Info("Successfully enqueued job")
		c.JSON(http.StatusOK, resource.ApiResponse[string]{
			Status:  resource.Success,
			Message: "Successfully enqueued job",
			Error:   "",
			Data:    jobId,
		})
	}
}

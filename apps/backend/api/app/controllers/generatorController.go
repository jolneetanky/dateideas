package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/resource"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/services"
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

var defaultFilterOptions resource.FilterOptions = resource.FilterOptions{
	Location: "",
	Budget:   -1,
}

// Implement methods
func (gc GeneratorControllerImpl) Generate(c *gin.Context) {
	logger.Info("Formatting request...")
	// start with default "nil" value for the request
	// so if eg. request passes in `{"filters": {}}`, we will use `defaultFilterOptions` for the filter.
	generateIdeasRequest := resource.GenerateIdeasRequest{
		Prompt:  "",
		Filters: &defaultFilterOptions,
	}

	bindErr := c.ShouldBindJSON(&generateIdeasRequest) // See if we can bind the request to `generateIdeasRequest`

	if bindErr != nil {
		logger.Info(fmt.Sprintf("Error binding request: %s", bindErr.Error()))
		c.JSON(http.StatusBadRequest, gin.H{"error": bindErr.Error()})
		c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
			Status:  resource.Error,
			Message: "Failed to generate ideas",
			Error:   "Bad request format. Check your request params and make sure it aligns with the API specifications.",
			Data:    nil,
		})
		return
	}

	// Fill up with default values
	// Check if pointer to `FilterOptions` is nil
	if generateIdeasRequest.Filters == nil {
		// Btw this is wrong because you're dereferencing `generateIdeasRequest.Filters` which is nil...
		// *(generateIdeasRequest.Filters) = defaultFilterOptions // In Go, the shortcut would be to exclude the parentheses `*generateIdeasRequest.Filters = defaultFilterOptions`.
		// NOTE: in Go, `*generateIdeasRequest.Filters` == `*(generateIdeasRequest.Filters)`, because the `.` operator > `*` operator.
		generateIdeasRequest.Filters = &defaultFilterOptions // `(generateIdeasRequest.Filters) is a POINTER to an object of type `FilterOptions`. So what we're doing here, is make that pointer point to `defaultFilterOptions`.`
		logger.Info(fmt.Sprintf("location: %s, budget: %d", (*(generateIdeasRequest.Filters)).Location, (*generateIdeasRequest.Filters).Budget))
	}

	jobId, err := gc.service.Generate(generateIdeasRequest.Prompt)

	if err != nil {
		logger.Error(fmt.Sprintf("Failed to generate ideas. Error: %s", err))
		c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
			Status:  resource.Error,
			Message: "Failed to generate ideas",
			Error:   err.Error(),
			Data:    nil,
		})
	} else {
		c.JSON(http.StatusOK, resource.ApiResponse[string]{
			Status:  resource.Success,
			Message: "Successfully generated ideas",
			Error:   "",
			Data:    jobId,
		})
	}
}

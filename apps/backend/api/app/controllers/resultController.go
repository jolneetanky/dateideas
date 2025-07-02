package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/resource"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/services"
)

type ResultController interface {
	GetResultsByJobId(c *gin.Context)
}

type ResultControllerImpl struct {
	service services.ResultServiceImpl
}

func InitResultControllerImpl(service services.ResultServiceImpl) ResultControllerImpl {
	return ResultControllerImpl{service: service}
}

// implement methods
func (rc ResultControllerImpl) GetResultsByJobId(c *gin.Context) {
	logger.Info("Getting results for jobId")
	jobId := c.Param("jobId")

	// Parse query params with default values
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")

	page, err := strconv.Atoi(pageStr)

	if err != nil || page < 1 {
		logger.Info(fmt.Sprintf("Invalid page: %s", err.Error()))
		c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
			Status:  resource.Error,
			Message: fmt.Sprintf("Invalid page number"),
			Error:   err.Error(),
			Data:    nil,
		})
		return
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		logger.Info(fmt.Sprintf("Invalid limit: %s", err.Error()))
		c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
			Status:  resource.Error,
			Message: fmt.Sprintf("Invalid limit"),
			Error:   err.Error(),
			Data:    nil,
		})
		return
	}

	logger.Info(fmt.Sprintf("PAGE: %d, LIMIT: %d", page, limit))

	// format to uuid
	formattedJobId, parseErr := uuid.Parse(jobId)

	if parseErr != nil {
		logger.Info(fmt.Sprintf("Error parsing jobId: %s", parseErr.Error()))
		c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
			Status:  resource.Error,
			Message: fmt.Sprintf("Failed to get status for jobId %s", jobId),
			Error:   parseErr.Error(),
			Data:    nil,
		})
		return
	}

	dateIdea, serviceErr := rc.service.GetResultsByJobId(formattedJobId)

	if serviceErr != nil {
		logger.Info(fmt.Sprintf("Error getting results by jobID: %s", serviceErr.Error()))
		c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
			Status:  resource.Error,
			Message: fmt.Sprintf("Failed to get results for jobId %s", jobId),
			Error:   serviceErr.Error(),
			Data:    nil,
		})
		return
	}

	logger.Info(fmt.Sprintf("Successfully get results for jobId %s", jobId))
	c.JSON(http.StatusOK, resource.ApiResponse[resource.DateIdea]{
		Status:  resource.Success,
		Message: "Successfully fetch results",
		Error:   "",
		Data:    dateIdea,
	})

	// pass to result DB, get paginated
	// TODO: populate resultDB with mock results for some `jobId`
	// logger.Info("Getting job status")
	// jobId := c.Param("jobId") // check if is UUID

	// // pass to service
	// status, err := jc.service.GetStatus(jobId)

	// if err != nil {
	// 	logger.Info(fmt.Sprintf("Error binding request: %s", err.Error()))
	// 	c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
	// 		Status:  resource.Error,
	// 		Message: "Failed to fetch status",
	// 		Error:   err.Error(),
	// 		Data:    nil,
	// 	})
	// 	return
	// }

	// logger.Info(fmt.Sprintf("Successfully get status for jobId %s", jobId))
	// c.JSON(http.StatusBadRequest, resource.ApiResponse[string]{
	// 	Status:  resource.Success,
	// 	Message: "Successfully fetch status",
	// 	Error:   "",
	// 	Data:    status,
	// })
}

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
	jobId := c.Param("jobId")
	// Parse query params with default values
	// pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")
	afterStr := c.DefaultQuery("after", "0")

	logger.Info(fmt.Sprintf("[GET /api/generator/results/:jobId] Fetching results for jobID %s. AFTER: %s, LIMIT: %s", jobId, afterStr, limitStr))

	// page, err := strconv.Atoi(pageStr)

	// if err != nil || page < 1 {
	// 	logger.Info(fmt.Sprintf("Invalid page: %s", err.Error()))
	// 	c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
	// 		Status:  resource.Error,
	// 		Message: fmt.Sprintf("Invalid page number: %s", pageStr),
	// 		Error:   err.Error(),
	// 		Data:    nil,
	// 	})
	// 	return
	// }

	afterUint64, err := strconv.ParseUint(afterStr, 10, 64)
	after := uint(afterUint64)

	if err != nil || after < 0 {
		logger.Info(fmt.Sprintf("Invalid page: %s", err.Error()))
		c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
			Status:  resource.Error,
			Message: fmt.Sprintf("Invalid page number: %s", afterStr),
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
			Message: fmt.Sprintf("Invalid limit: %s", limitStr),
			Error:   err.Error(),
			Data:    nil,
		})
		return
	}

	// format to jobId to uuid
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

	// get results from resultservice

	// VERSION #1: Uncomment to see performance without batching requests
	// dateIdea, serviceErr := rc.service.GetResultsByJobIdPrev(formattedJobId)

	// VERSION #2: Uncomment to see performance with batching requests
	dateIdea, nextCursor, serviceErr := rc.service.GetResultsByJobId(formattedJobId, after, limit)

	data := resource.CursorResponse[resource.DateIdea]{
		Data:       dateIdea,
		NextCursor: fmt.Sprintf("%d", nextCursor),
	}

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
	c.JSON(http.StatusOK, resource.ApiResponse[resource.CursorResponse[resource.DateIdea]]{
		Status:  resource.Success,
		Message: "Successfully fetch results",
		Error:   "",
		Data:    data,
	})

}

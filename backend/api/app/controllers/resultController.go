package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/backend/api/app/domain/resource"
	"github.com/jolneetanky/dateideas/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/backend/api/app/services"
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
	limitStr := c.DefaultQuery("limit", "10")
	cursorStr := c.DefaultQuery("cursor", "0")
	direction := c.DefaultQuery("direction", "next")

	logger.Info(fmt.Sprintf("[GET /api/generator/results/:jobId] Fetching results for jobID %s. AFTER: %s, LIMIT: %s, DIRECTION: %s", jobId, cursorStr, limitStr, direction))

	cursorUint64, err := strconv.ParseUint(cursorStr, 10, 64)
	cursor := uint(cursorUint64)

	if err != nil {
		logger.Info(fmt.Sprintf("Invalid page: %s", err.Error()))
		c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
			Status:  resource.Error,
			Message: fmt.Sprintf("Invalid cursor: %s", cursor),
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
	dateIdea, prevCursor, nextCursor, serviceErr := rc.service.GetResultsByJobId(formattedJobId, cursor, limit, direction)
	logger.Info(fmt.Sprintf("Successfully fetched results. PREV_CURSOR: %d, NEXT_CURSOR: %d", prevCursor, nextCursor))

	data := resource.CursorResponse[resource.DateIdea]{
		Data:       dateIdea,
		PrevCursor: fmt.Sprintf("%d", prevCursor),
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

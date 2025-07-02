package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/entity"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/resource"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/services"
)

type JobController interface {
	GetStatus(c *gin.Context)
}

type JobControllerImpl struct {
	service services.JobServiceImpl
}

// implement methods
func (jc JobControllerImpl) GetStatus(c *gin.Context) {
	logger.Info("Getting job status")
	jobId := c.Param("jobId")

	// format to uuid
	id, parseErr := uuid.Parse(jobId)

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
	// pass to service
	status, err := jc.service.GetStatus(id)

	if err != nil {
		logger.Info(fmt.Sprintf("Error binding request: %s", err.Error()))
		c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
			Status:  resource.Error,
			Message: fmt.Sprintf("Failed to fetch status for jobID %s", id),
			Error:   err.Error(),
			Data:    nil,
		})
		return
	}

	logger.Info(fmt.Sprintf("Successfully get status for jobId %s: %s", jobId, status))
	c.JSON(http.StatusOK, resource.ApiResponse[entity.JobStatus]{
		Status:  resource.Success,
		Message: "Successfully fetch status",
		Error:   "",
		Data:    status,
	})

}

func InitJobControllerImpl(service services.JobServiceImpl) JobControllerImpl {
	return JobControllerImpl{service}
}

package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
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

	// pass to service
	status, err := jc.service.GetStatus(jobId)

	if err != nil {
		logger.Info(fmt.Sprintf("Error binding request: %s", err.Error()))
		c.JSON(http.StatusBadRequest, resource.ApiResponse[error]{
			Status:  resource.Error,
			Message: "Failed to fetch status",
			Error:   err.Error(),
			Data:    nil,
		})
		return
	}

	logger.Info(fmt.Sprintf("Successfully get status for jobId %s", jobId))
	c.JSON(http.StatusBadRequest, resource.ApiResponse[string]{
		Status:  resource.Success,
		Message: "Successfully fetch status",
		Error:   "",
		Data:    status,
	})

}

func InitJobControllerImpl() JobControllerImpl {
	return JobControllerImpl{}
}

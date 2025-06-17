package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
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

// Implement methods
func (gc GeneratorControllerImpl) Generate(c *gin.Context) {
	logger.Info("Formatting request...")

	c.JSON(http.StatusOK, "hi")
	// TODO: format and send to generator service

}

package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Define interface
type GeneratorController interface {
	Generate(c *gin.Context)
}

// Define implementation struct; this `struct` implements the interface.
type GeneratorControllerImpl struct {
	//
}

// Constructor to create instance of GeneratorControllerImpl
func InitGeneratorControllerImpl() GeneratorControllerImpl {
	return GeneratorControllerImpl{}
}

// Implement methods
func (gc GeneratorControllerImpl) Generate(c *gin.Context) {
	c.JSON(http.StatusOK, "hi")
	// TODO: send to queue? for generaotr service to pick up?
}

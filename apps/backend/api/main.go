package main

import (
	"fmt"

	"github.com/gin-gonic/gin"

	"github.com/jolneetanky/dateideas/apps/backend/api/app/factory"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/utils"
)

func main() {
	logger.InitLogger()

	generatorController := factory.BuildGeneratorController()
	jobController := factory.BuildJobController()

	// Create new rabbitMQ connection
	err := utils.NewRabbitMQConnection()

	if err != nil {
		logger.Error(fmt.Printf("Failed to create new RabbitMQ connection: %s", err.Error()))
		// os.Exit(1) // Uncomment to exit on error
		return
	}

	router := gin.Default()

	router.POST("/generator/generate", generatorController.Generate)

	router.GET("/jobs/status/:jobId", jobController.GetStatus)

	router.Run("localhost:8000") // NOTE: `gin.Run()` is BLOCKING!
}

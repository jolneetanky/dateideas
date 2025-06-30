package main

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/jolneetanky/dateideas/apps/backend/api/app/factory"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/utils"
)

func main() {
	var err error
	// Load env variables
	err = godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	// Initialize logger
	logger.InitLogger()
	logger.Info(fmt.Sprintf("TEST:: %s", os.Getenv("GENERATOR_DB_HOST")))

	factory.Init()

	generatorController := factory.GeneratorController
	jobController := factory.JobController
	resultController := factory.ResultController

	// Create new rabbitMQ connection
	err = utils.NewRabbitMQConnection()

	if err != nil {
		logger.Error(fmt.Printf("Failed to create new RabbitMQ connection: %s", err.Error()))
		// os.Exit(1) // Uncomment to exit on error
		return
	}

	router := gin.Default()

	router.POST("/generator/generate", generatorController.Generate)

	router.GET("/jobs/status/:jobId", jobController.GetStatus)

	router.GET("/results/:jobId", resultController.GetResultsByJobId)

	// get results
	// where do we store these results?
	// OPTION #1:
	// Yea I think this makes the most sense.
	// store in a result table, with { jobId: dateIdeaId }
	// then to get all dateIdeas for a jobId,
	// we can have an aggregator to fetch all these dateIdeaIds from a separate DB
	// and piece it tgt

	// we can index by `jobId`, then paginate from there.
	// I think it's best to have a separate Paginator to paginate our results.

	router.Run("localhost:8000") // NOTE: `gin.Run()` is BLOCKING!
}

package main

import (
	"fmt"
	"os"
	"time"

	"github.com/gin-contrib/cors"
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

	// Enable CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.POST("/generator/generate", generatorController.Generate)

	router.GET("/generator/status/:jobId", jobController.GetStatus)

	router.GET("/generator/results/:jobId", resultController.GetResultsByJobId)

	router.Run("localhost:8000") // NOTE: `gin.Run()` is BLOCKING!
}

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

	// Initialize services, controllers, DB
	factory.Init()

	generatorController := factory.GeneratorController
	jobController := factory.JobController
	resultController := factory.ResultController

	// Create new rabbitMQ connection
	err = utils.NewRabbitMQConnection()
	// Graceful shutdown
	defer utils.RabbitMQClient.Conn.Close()
	defer utils.RabbitMQClient.Channel.Close()

	if err != nil {
		logger.Error(fmt.Printf("Failed to create new RabbitMQ connection: %s", err.Error()))
		// os.Exit(1) // Uncomment to exit on error
		return
	}

	router := gin.Default()

	// Enable CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://frontend:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})
	router.POST("/generator/generate", generatorController.Generate)

	router.GET("/generator/status/:jobId", jobController.GetStatus)

	router.GET("/generator/results/:jobId", resultController.GetResultsByJobId)

	// Get port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // default fallback
	}

	logger.Info(fmt.Sprintf("Server up and running on port %s", port))
	router.Run(":" + port) // NOTE: `gin.Run()` is BLOCKING!
}

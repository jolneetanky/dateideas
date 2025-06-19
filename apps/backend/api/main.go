package main

import (
	"github.com/gin-gonic/gin"

	"github.com/jolneetanky/dateideas/apps/backend/api/app/factory"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
)

func main() {
	logger.InitLogger()

	generatorController := factory.BuildGeneratorController()
	router := gin.Default()

	router.POST("/generator/generate", generatorController.Generate)
	router.GET("/generator/status/:jobId")

	router.Run("localhost:8000") // NOTE: `gin.Run()` is BLOCKING!
}

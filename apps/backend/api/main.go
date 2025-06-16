package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// generate responds with the jobID.
func generateIdeas(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, "hi")
}

func main() {
	router := gin.Default()
	router.POST("/dateideas/generate", generateIdeas)

	router.Run("localhost:8000")
}

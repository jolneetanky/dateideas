package main

import (
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/factory"
)

var counter = 0 // Shared variable
var mu sync.Mutex

func handler(c *gin.Context) {
	// Comment this out to see race condition
	mu.Lock()
	defer mu.Unlock()

	counter++
	fmt.Println("Counter:", counter)
	c.Status(http.StatusOK)
}

func sendRequest(wg *sync.WaitGroup) {
	defer wg.Done()
	resp, err := http.Get("http://localhost:8000/racetest")
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()
	fmt.Println("Status:", resp.StatusCode)
}

func main() {
	// Start server in a goroutine
	go func() {
		// Initialize controllers
		generatorController := factory.BuildGeneratorController()
		router := gin.Default()

		router.GET("/racetest", handler)
		router.POST("/dateideagenerator/generate", generatorController.Generate)

		router.Run("localhost:8000") // NOTE: `gin.Run()` is BLOCKING!
	}()

	// Give the server time to start
	time.Sleep(500 * time.Millisecond)

	// Fire concurrent requests

	var wg sync.WaitGroup
	numRequests := 10
	for i := 0; i < numRequests; i++ {

		wg.Add(1)
		go sendRequest(&wg)
	}

	wg.Wait()

}

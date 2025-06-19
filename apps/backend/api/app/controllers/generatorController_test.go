package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	// Adjust this import path as needed
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"

	"github.com/jolneetanky/dateideas/apps/backend/api/app/mocks"
)

// Setup a test router with your controller
func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()

	// controller := factory.BuildTestGeneratorController()
	controller := InitGeneratorControllerImpl(mocks.MockGeneratorService)
	r.POST("/generate", controller.Generate)

	return r
}

func TestGenerate_EmptyFiltersReturnSuccess(t *testing.T) {
	router := setupTestRouter()

	body := `{"prompt": "romantic ideas", "filter": {}}`

	// A Buffer can turn a string or a []byte into an io.Reader.
	req, _ := http.NewRequest("POST", "/generate", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]any
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)

	// data := response["data"].(map[string]any)
	// status := response["status"].(map[string]any)

	assert.Equal(t, "success", response["status"])
	assert.NotEmpty(t, response["data"])
}

func TestGenerate_InvalidBudgetReturnsError(t *testing.T) {
	router := setupTestRouter()

	body := `{
	"prompt": "romantic ideas",
	"filters": {
	"budget": "stringBudget",
	}
	}`

	// A Buffer can turn a string or a []byte into an io.Reader.
	req, _ := http.NewRequest("POST", "/generate", bytes.NewBuffer([]byte(body)))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)

	var response map[string]any
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)

	assert.Equal(t, "error", response["status"])
	assert.Empty(t, response["data"])
}

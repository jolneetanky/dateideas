package services

import (
	"encoding/json"
	"fmt"

	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/utils"
)

// Define interface
type GeneratorService interface {
	Generate(prompt string, location string, budget int) (string, error)
}

// Define implementation struct
type GeneratorServiceImpl struct {
}

// Constructor to initialize GeneratorServiceImpl
func InitGeneratorServiceImpl() GeneratorServiceImpl {
	return GeneratorServiceImpl{}
}

type Message struct {
	JobId    string `json:"job_id"`
	Prompt   string `json:"prompt"`
	Location string `json:"location"`
	Budget   int    `json:"budget"`
}

// Implement methods
func (gs GeneratorServiceImpl) Generate(prompt string, location string, budget int) (string, error) {
	// what if we talk to jobDB to give us a new jobID of this guy
	// at the same time, store column `prompt_hash_` in the row. this will help us later when we impl caching.

	// time = O(logn) with indexing
	// purge old jobs? Implies we should use a cache or something
	// then enqueue the prompt and jobID which helps us generate results + mark as done in jobDB
	// we should hash the prompt

	// in our DB, hash the prompt and use that as primary key? (ok maybe later on)

	jobId := utils.GenerateJobId()

	// format message
	message := Message{
		JobId:    jobId,
		Prompt:   prompt,
		Location: location,
		Budget:   budget,
	}

	// Marshal Go struct into JSON bytes
	body, err := json.Marshal(message)

	if err != nil {
		logger.Error(fmt.Sprintf("Failed to marshall message to JSON. Error: %s", err.Error()))
		return "", err
	}

	// Send job ID
	// First check if connection is open. If not open, create new connection
	if utils.RabbitMQClient.Conn.IsClosed() {
		utils.NewRabbitMQConnection()
	}

	err = utils.RabbitMQClient.SendMessage(body)

	if err != nil {
		logger.Error(fmt.Sprintf("Failed to send message to RabbitMQ. Error: %s", err.Error()))
		return "", err
	}

	logger.Info("Successfully published message")

	return jobId, nil
}

package services

import (
	"encoding/json"
	"fmt"

	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/entity"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/resource"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/repositories"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/utils"
)

// Define interface
type GeneratorService interface {
	Generate(prompt string, location resource.Location, budget int) (string, error)
}

// Define implementation struct
type GeneratorServiceImpl struct {
	jobRepo repositories.JobRepositoryImpl
}

// Constructor to initialize GeneratorServiceImpl
func InitGeneratorServiceImpl(jobRepo repositories.JobRepositoryImpl) GeneratorServiceImpl {
	return GeneratorServiceImpl{jobRepo: jobRepo}
}

// Implement methods
func (gs GeneratorServiceImpl) Generate(prompt string, location resource.Location, budget int) (string, error) {

	jobId := utils.GenerateJobId()

	// format message
	message := resource.Message{
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

	// parse into UUID
	id, _ := utils.ParseUUID(jobId)
	// Insert into job repo
	logger.Info(fmt.Sprintf("Inserting jobID %s into JobDB...", id))
	postErr := gs.jobRepo.PostJob(id, entity.JobStatusPending)

	if postErr != nil {
		return "", postErr
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

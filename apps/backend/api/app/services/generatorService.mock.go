package services

import "github.com/jolneetanky/dateideas/apps/backend/api/app/utils"

// Define implementation struct
type MockGeneratorServiceImpl struct {
}

// Constructor to initialize GeneratorServiceImpl
func InitMockGeneratorServiceImpl() MockGeneratorServiceImpl {
	return MockGeneratorServiceImpl{}
}

// Implement methods

func (gs MockGeneratorServiceImpl) Generate(prompt string, location string, budget int) (string, error) {
	jobId := utils.GenerateJobId()

	// // format message
	// message := Message{
	// 	JobId:    jobId,
	// 	Prompt:   prompt,
	// 	Location: location,
	// 	Budget:   budget,
	// }

	// // Marshal Go struct into JSON bytes
	// body, err := json.Marshal(message)

	// if err != nil {
	// 	logger.Error(fmt.Sprintf("Failed to marshall message to JSON. Error: %s", err.Error()))
	// 	return "", err
	// }

	// // Send job ID
	// err = utils.RabbitMQClient.SendMessage(body)

	// if err != nil {
	// 	logger.Error(fmt.Sprintf("Failed to send message to RabbitMQ. Error: %s", err.Error()))
	// 	return "", err
	// }

	// logger.Info("Successfully published message")

	return jobId, nil
}

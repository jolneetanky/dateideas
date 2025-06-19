package services

// Define implementation struct
type MockGeneratorServiceImpl struct {
}

// Constructor to initialize GeneratorServiceImpl
func InitMockGeneratorServiceImpl() MockGeneratorServiceImpl {
	return MockGeneratorServiceImpl{}
}

// Implement methods
func (gs MockGeneratorServiceImpl) Generate(prompt string) (string, error) {
	// TODO: enqueue into job queue
	// enqueue, and send jobId
	mockJobId := "1"
	return mockJobId, nil
}

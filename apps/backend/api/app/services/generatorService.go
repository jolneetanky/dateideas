package services

// Define interface
type GeneratorService interface {
	Generate(prompt string) (string, error)
}

// Define implementation struct
type GeneratorServiceImpl struct {
}

// Constructor to initialize GeneratorServiceImpl
func InitGeneratorServiceImpl() GeneratorServiceImpl {
	return GeneratorServiceImpl{}
}

// Implement methods
func (gs GeneratorServiceImpl) Generate(prompt string) (string, error) {
	// TODO: enqueue into job queue
	// enqueue, and send jobId
	mockJobId := "1"
	return mockJobId, nil
}

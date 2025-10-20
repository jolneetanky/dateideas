package mocks

import (
	"github.com/jolneetanky/dateideas/backend/api/app/services"
)

var MockGeneratorService = services.InitMockGeneratorServiceImpl() // only one instance lol

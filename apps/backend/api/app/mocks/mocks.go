package mocks

import (
	"github.com/jolneetanky/dateideas/apps/backend/api/app/services"
)

var MockGeneratorService = services.InitMockGeneratorServiceImpl() // only one instance lol

package factory

import (
	"github.com/jolneetanky/dateideas/apps/backend/api/app/controllers"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/services"
)

func BuildGeneratorController() controllers.GeneratorControllerImpl {
	generatorService := services.InitGeneratorServiceImpl()
	return controllers.InitGeneratorControllerImpl(generatorService)
}

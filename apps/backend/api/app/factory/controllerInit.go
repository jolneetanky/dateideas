package factory

import (
	"github.com/jolneetanky/dateideas/apps/backend/api/app/controllers"
)

func BuildGeneratorController() controllers.GeneratorControllerImpl {
	return controllers.InitGeneratorControllerImpl()
}

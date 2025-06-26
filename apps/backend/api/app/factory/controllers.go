package factory

import (
	"github.com/jolneetanky/dateideas/apps/backend/api/app/controllers"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/repositories"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/services"
	"gorm.io/gorm"
)

func BuildGeneratorController() controllers.GeneratorControllerImpl {
	generatorService := services.InitGeneratorServiceImpl()
	return controllers.InitGeneratorControllerImpl(generatorService)
}

func BuildJobController(db *gorm.DB) controllers.JobControllerImpl {
	jobRepo := repositories.InitJobRepoImpl(db)
	jobService := services.InitJobServiceImpl(jobRepo)
	return controllers.InitJobControllerImpl(jobService)
}

func BuildResultController() controllers.ResultControllerImpl {
	return controllers.InitResultControllerImpl()
}

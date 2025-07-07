package factory

import (
	"github.com/jolneetanky/dateideas/apps/backend/api/app/controllers"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/db"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/repositories"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/services"
)

// controllers
var GeneratorController controllers.GeneratorControllerImpl
var JobController controllers.JobControllerImpl
var ResultController controllers.ResultControllerImpl

// services
var GeneratorService services.GeneratorServiceImpl
var JobService services.JobServiceImpl
var ResultService services.ResultServiceImpl

// repositories
var JobRepo repositories.JobRepositoryImpl
var ResultRepo repositories.ResultRepositoryImpl

// db
var GeneratorDb db.GeneratorDB

func Init() {
	// Build db and connect
	GeneratorDb = db.InitGeneratorDB()
	GeneratorDb.ConnectDB()
	GeneratorDb.ResetAllTables()

	// build repos
	JobRepo = repositories.InitJobRepoImpl(GeneratorDb.GormDB)
	ResultRepo = repositories.InitResultRepoImpl(GeneratorDb.GormDB)

	// build services
	GeneratorService = services.InitGeneratorServiceImpl(JobRepo)
	JobService = services.InitJobServiceImpl(JobRepo)
	ResultService = services.InitResultServiceImpl(ResultRepo)

	// build controllers
	GeneratorController = controllers.InitGeneratorControllerImpl(GeneratorService)
	JobController = controllers.InitJobControllerImpl(JobService)
	ResultController = controllers.InitResultControllerImpl(ResultService)
}

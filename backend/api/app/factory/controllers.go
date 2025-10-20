package factory

import (
	"github.com/jolneetanky/dateideas/backend/api/app/controllers"
	"github.com/jolneetanky/dateideas/backend/api/app/lib/db"
	"github.com/jolneetanky/dateideas/backend/api/app/repositories"
	"github.com/jolneetanky/dateideas/backend/api/app/services"
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

// Initializes everything and those guys are global
func Init() {
	// Build db
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

// func BuildGeneratorController(db *gorm.DB) controllers.GeneratorControllerImpl {
// 	jobRepo := repositories.InitJobRepoImpl(db)
// 	generatorService := services.InitGeneratorServiceImpl()
// 	return controllers.InitGeneratorControllerImpl(generatorService)
// }

// func BuildJobController(db *gorm.DB) controllers.JobControllerImpl {
// 	jobRepo := repositories.InitJobRepoImpl(db)
// 	jobService := services.InitJobServiceImpl(jobRepo)
// 	return controllers.InitJobControllerImpl(jobService)
// }

// func BuildResultController(db *gorm.DB) controllers.ResultControllerImpl {
// 	resultRepo := repositories.InitResultRepoImpl(db)
// 	resultService := services.InitResultServiceImpl(resultRepo)
// 	return controllers.InitResultControllerImpl(resultService)
// }

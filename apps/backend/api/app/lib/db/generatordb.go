package db

import (
	"fmt"
	"os"

	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/entity"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type GeneratorDB struct {
	GormDB *gorm.DB
}

func InitGeneratorDB() GeneratorDB {
	return GeneratorDB{}
}

// Implement methods
// Receiver needs to be a pointer so we can modify `pg.DB`.
func (pg *GeneratorDB) ConnectDB() error {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		os.Getenv("GENERATOR_DB_HOST"),
		os.Getenv("GENERATOR_DB_USER"),
		os.Getenv("GENERATOR_DB_PASSWORD"),
		os.Getenv("GENERATOR_DB_NAME"),
		os.Getenv("GENERATOR_DB_PORT"),
	)

	// Open DB connection
	logger.Info("Connecting to DB...")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		logger.Error(fmt.Sprintf(
			"Failed to connect to DB. Error: %s",
			err.Error(),
		))
		return err
	}

	(*pg).GormDB = db

	logger.Info("Successfully connected to DB")

	return nil
}

func (pg GeneratorDB) ResetAllTables() error {
	logger.Info("Resetting all tables...")

	// Drop the tables if they exist
	err := pg.GormDB.Migrator().DropTable(&entity.Result{}, &entity.Job{})
	if err != nil {
		logger.Error(fmt.Errorf("failed to drop tables: %w", err))
		return err
	}

	// Recreate the tables
	err = pg.GormDB.AutoMigrate(&entity.Job{}, &entity.Result{})
	if err != nil {
		logger.Error(fmt.Errorf("failed to migrate tables: %w", err))
		return err
	}

	logger.Info("All tables reset successfully.")
	return nil
}

package db

import (
	"fmt"
	"os"

	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type JobDBPostgres struct {
	GormDB *gorm.DB
}

func InitJobDBPostgres() *JobDBPostgres {
	return &JobDBPostgres{}
}

// Implement methods
// Receiver needs to be a pointer so we can modify `pg.DB`.
func (pg *JobDBPostgres) InitDB() error {
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

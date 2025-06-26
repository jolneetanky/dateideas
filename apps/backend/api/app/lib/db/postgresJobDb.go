package db

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// table struct
type Job struct {
	ID     uuid.UUID `gorm:"type:uuid;primaryKey"`
	Status string
}

type JobDBPostgres struct {
	GormDB *gorm.DB
}

func InitJobDBPostgres() *JobDBPostgres {
	return &JobDBPostgres{}
}

// Implement methods
// Receiver needs to be a pointer so we can modify `pg.DB`.
func (pg *JobDBPostgres) InitDB() error {
	dsn := "host=localhost user=jolene password=secret dbname=jobdb port=5432 sslmode=disable TimeZone=Asia/Shanghai"
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

func (pg JobDBPostgres) ResetTable(tableName string) error {
	if tableName == "jobs" {
		return errors.New("this service can't reset jobs table")
	}
	return nil
}

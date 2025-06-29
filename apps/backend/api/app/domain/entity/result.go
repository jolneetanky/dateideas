package entity

import "github.com/google/uuid"

type Result struct {
	ID         uint      `gorm:"primaryKey;autoIncrement`
	DateIdeaID int       `gorm:"column:dateidea_id"` // soft pointer to DateIdea
	JobID      uuid.UUID `gorm:"column:job_id"`      // FK to jobs table
}

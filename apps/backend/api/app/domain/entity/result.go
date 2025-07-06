package entity

import "github.com/google/uuid"

type Result struct {
	ID          uint      `gorm:"primaryKey;autoIncrement"`
	JobID       uuid.UUID `gorm:"column:job_id"` // FK to jobs table
	Description string    `gorm:"column:description"`
	NodeID      string    `gorm:"column:node_id"`
}

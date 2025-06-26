package db

type DB interface {
	InitDB() error
	ResetTable(tableName string) error
}

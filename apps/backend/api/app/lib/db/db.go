package db

type DB interface {
	ConnectDB() error
	ResetAllTables() error
}

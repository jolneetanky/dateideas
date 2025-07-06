package resource

type Message struct {
	JobId    string   `json:"job_id"`
	Prompt   string   `json:"prompt"`
	Location Location `json:"location"`
	Budget   int      `json:"budget"`
}

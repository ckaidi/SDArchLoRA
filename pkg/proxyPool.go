package pkg

type Proxy struct {
	Anonymous  string `json:"anonymous"`
	CheckCount string `json:"check_count"`
	FailCount  string `json:"fail_count"`
	Https      string `json:"https"`
	LastStatus string `json:"last_status"`
	LastTime   string `json:"last_time"`
	Addr       string `json:"proxy"`
	Region     string `json:"region"`
	Source     string `json:"source"`
}

func GetProxy() {

}

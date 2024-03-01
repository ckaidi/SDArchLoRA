package pkg

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

var ProxyServer = "http://dsm.chenkaidi.top:5010"

type Proxy struct {
	Anonymous  string `json:"anonymous"`
	CheckCount int    `json:"check_count"`
	FailCount  int    `json:"fail_count"`
	Https      bool   `json:"https"`
	LastStatus bool   `json:"last_status"`
	LastTime   string `json:"last_time"`
	Addr       string `json:"proxy"`
	Region     string `json:"region"`
	Source     string `json:"source"`
}

type ProxyCount struct {
	Count    int            `json:"count"`
	HttpType HttpType       `json:"http_type"`
	Source   map[string]int `json:"source"`
}

type HttpType struct {
	Http  int `json:"http"`
	Https int `json:"https"`
}

func GetProxy() Proxy {
	response, err := http.Get(ProxyServer + "/get")
	handle(err)
	defer func(Body io.ReadCloser) {
		err = Body.Close()
		handle(err)
	}(response.Body)

	textBody, err := io.ReadAll(response.Body)
	text := string(textBody)
	handle(err)
	fmt.Println(text)
	var proxy Proxy
	err = json.Unmarshal([]byte(text), &proxy)
	handle(err)
	proxy.Https = false
	proxy.Addr = "117.160.250.134:8899"
	return proxy
}

func GetProxyCount() ProxyCount {
	response, err := http.Get(ProxyServer + "/count")
	handle(err)
	defer func(Body io.ReadCloser) {
		err = Body.Close()
		handle(err)
	}(response.Body)

	textBody, err := io.ReadAll(response.Body)
	text := string(textBody)
	handle(err)
	fmt.Println(text)
	var proxyCount ProxyCount
	err = json.Unmarshal([]byte(text), &proxyCount)
	handle(err)
	return proxyCount
}

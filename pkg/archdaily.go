package pkg

import (
	"crypto/tls"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"time"
)

var URL = "https://www.archdaily.cn/"

// 获取搜索代码
func getSearchUrl(key string, page int) string {
	key = url.QueryEscape(key)
	return URL + "search/api/v1/cn/all?q=" + key + "&page=" + url.QueryEscape(strconv.Itoa(page))
}

func A(key string, page int) {
	proxy := GetProxy()
	var parse *url.URL
	var err error
	if proxy.Https {
		parse, err = url.Parse("https://" + proxy.Addr)
	} else {
		parse, err = url.Parse("http://" + proxy.Addr)
	}
	handle(err)
	client := &http.Client{
		Transport: &http.Transport{
			Proxy: http.ProxyURL(parse),
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
		Timeout: 10 * time.Second,
	}
	webUrl := getSearchUrl(key, page)
	request, err := http.NewRequest("GET", webUrl, nil)
	request.Header.Set("Connection", "keep-alive")
	request.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36")
	handle(err)
	response, err := client.Do(request)
	handle(err)
	defer func(Body io.ReadCloser) {
		handle(err)
	}(response.Body)
	data, err := io.ReadAll(response.Body)
	handle(err)
	text := string(data)
	fmt.Println(text)
}

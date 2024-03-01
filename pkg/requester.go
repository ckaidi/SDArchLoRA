package pkg

import (
	"crypto/tls"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"time"
)

var useProxy = false

func Get(webUrl string, callback func(*http.Response)) {
	fetch(webUrl, "GET", callback)
}

func fetch(webUrl string, method string, callback func(*http.Response)) {
	for {
		var client *http.Client
		if useProxy {
			proxy := GetProxy()
			var parse *url.URL
			var err error
			if proxy.Https {
				parse, err = url.Parse("https://" + proxy.Addr)
			} else {
				parse, err = url.Parse("http://" + proxy.Addr)
			}
			if err != nil {
				fmt.Print(err.Error())
				a := time.Second
				time.Sleep(a)
				continue
			}
			client = &http.Client{
				Transport: &http.Transport{
					Proxy: http.ProxyURL(parse),
					TLSClientConfig: &tls.Config{
						InsecureSkipVerify: true,
					},
				},
				Timeout: 10 * time.Second,
			}
		} else {
			client = &http.Client{}
		}
		request, err := http.NewRequest(method, webUrl, nil)
		request.Header.Set("Connection", "keep-alive")
		request.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36")
		if err != nil {
			fmt.Print(err.Error())
			a := 5 * time.Second
			time.Sleep(a)
			continue
		}
		response, err := client.Do(request)
		if err != nil {
			fmt.Print(err.Error())
			a := 5 * time.Second
			time.Sleep(a)
			continue
		}
		callback(response)
		return
	}
}

func DownloadImage(url string, path string) {
	Get(url, func(response *http.Response) {
		defer func(Body io.ReadCloser) {
			err := Body.Close()
			handle(err)
		}(response.Body)
		// 创建本地文件，用于保存图片
		file, err := os.Create(path)
		if err != nil {
			fmt.Println("创建文件失败:", err)
			return
		}
		// 延迟关闭文件
		defer func(file *os.File) {
			err := file.Close()
			handle(err)
		}(file)
		// 将图片的响应 Body 复制到文件中
		_, err = io.Copy(file, response.Body)
		handle(err)
	})
}

//func Header

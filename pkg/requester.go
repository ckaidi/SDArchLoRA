package pkg

import (
	"bytes"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"fmt"
	_ "golang.org/x/image/bmp" // Import BMP format
	"image"
	_ "image/jpeg" // Import JPEG format
	_ "image/png"  // Import PNG format
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type ImgConfig struct {
	Base64 string
	Width  int
	Height int
}

type TrainStruct struct {
	Base64 string `json:"base64"`
}

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

func Img2Base64(w http.ResponseWriter, r *http.Request) {
	// 检查请求方法是否为 POST
	if r.Method != "POST" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	dataByte, err := io.ReadAll(r.Body)
	handle(err)
	imgConfig := img2Base64Internal(string(dataByte))
	dataByte, err = json.Marshal(imgConfig)
	handle(err)
	_, err = w.Write(dataByte)
	handle(err)
}

// Img2Base64Internal 下载图片
func img2Base64Internal(imgUrl string) ImgConfig {
	response, err := http.Get(imgUrl)
	handle(err)
	defer func(Body io.ReadCloser) {
		err = Body.Close()
		handle(err)
	}(response.Body)
	imageData, err := io.ReadAll(response.Body)
	handle(err)
	// 读取图片数据
	reader := bytes.NewReader(imageData)
	config, _, err := image.DecodeConfig(reader)
	handle(err)

	// 将图片数据转换为base64字符串
	base64Image := base64.StdEncoding.EncodeToString(imageData)
	return ImgConfig{
		Base64: "data:image/png;base64," + base64Image,
		Width:  config.Width,
		Height: config.Height,
	}
}

func TransmitGet(url string, w http.ResponseWriter) {
	response, err := http.Get(url)
	handle(err)
	dataByte, err := io.ReadAll(response.Body)
	handle(err)
	_, err = w.Write(dataByte)
	handle(err)
}

func TransmitPost(url string, w http.ResponseWriter, r *http.Request) {
	// 检查请求方法是否为 POST
	if r.Method != "POST" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	dataByte, err := io.ReadAll(r.Body)
	handle(err)
	reader := strings.NewReader(string(dataByte))
	response, err := http.Post(url, "application/json", reader)
	handle(err)
	dataByte, err = io.ReadAll(response.Body)
	handle(err)
	_, err = w.Write(dataByte)
	handle(err)
}

// TrainData 上传训练数据
func TrainData(w http.ResponseWriter, r *http.Request) {
	// 检查请求方法是否为 POST
	if r.Method == "POST" {
		body, err := io.ReadAll(r.Body)
		handle(err)
		var trainData TrainStruct
		err = json.Unmarshal(body, &trainData)
		handle(err)
	} else if r.Method == "GET" {

	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
}

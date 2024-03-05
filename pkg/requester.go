package pkg

import (
	"bytes"
	"crypto/tls"
	"encoding/base64"
	"fmt"
	_ "golang.org/x/image/bmp" // Import BMP format
	"image"
	_ "image/jpeg" // Import JPEG format
	_ "image/png"  // Import PNG format
	"io"
	"net/http"
	"net/url"
	"time"
)

type ImgConfig struct {
	Base64 string
	Width  int
	Height int
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

// Img2Base64 下载图片
func Img2Base64(imgUrl string) ImgConfig {
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
	w, h := CalculateImgWidthHeight(config.Width, config.Height)
	return ImgConfig{
		Base64: base64Image,
		Width:  w,
		Height: h,
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

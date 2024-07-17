package main

import (
	"SpiderGo/pkg"
	"embed"
	"fmt"
	"github.com/inconshreveable/go-update"
	"io"
	"io/fs"
	"net/http"
	"os/exec"
	"runtime"
)

//go:embed web/dist
var staticFiles embed.FS

func openURL(url string) error {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start", url}
	case "darwin":
		cmd = "open"
		args = []string{url}
	case "linux":
		cmd = "xdg-open"
		args = []string{url}
	default:
		return fmt.Errorf("unsupported platform")
	}

	return exec.Command(cmd, args...).Start()
}

func doUpdate(url string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(resp.Body)
	err = update.Apply(resp.Body, update.Options{})
	if err != nil {
		// error handling
	}
	return err
}

func main() {
	// 使用 embed 包提供的文件系统
	subFS, err := fs.Sub(staticFiles, "web/dist")
	if err != nil {
		fmt.Printf("Failed to create sub filesystem: %s\n", err)
		return
	}

	// 检查更新
	// 设置静态文件服务
	fileServer := http.FileServer(http.FS(subFS))
	http.Handle("/", fileServer)
	http.HandleFunc("/archdaily", pkg.Cors(pkg.GetArchdailyImagesRoute))
	http.HandleFunc("/img2base64", pkg.Cors(pkg.Img2Base64))
	http.HandleFunc("/traindata", pkg.Cors(pkg.TrainData))
	//不要加cors，不然再服务器部署之后会出现样式丢失的清空

	// 使用 Goroutine 异步启动服务器
	go func() {
		err = http.ListenAndServe(":8081", nil)
		if err != nil {
			fmt.Printf("HTTP server failed: %s\n", err)
			return
		}
	}()

	// 给服务器一点时间来启动
	// 可以通过更复杂的逻辑（如尝试连接服务器）来更准确地处理
	fmt.Println("Server started at http://127.0.0.1:8081")
	err = openURL("http://127.0.0.1:8081")
	if err != nil {
		//fmt.Printf("HTTP server failed: %s\n", err)
		fmt.Printf("访问 http://127.0.0.1:8081")
	}

	// 防止 main 函数退出
	select {}
}

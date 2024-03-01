package main

import (
	"SpiderGo/pkg"
	"net/http"
)

func main() {
	pkg.A("扎哈", 1)
	//http.HandleFunc("/archdaily", pkg.Cors(pkg.UploadImageRoute))
	//不要加cors，不然再服务器部署之后会出现样式丢失的清空

	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		return
	}
}

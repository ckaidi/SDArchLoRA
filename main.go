package main

import (
	"SpiderGo/pkg"
	"net/http"
)

func main() {
	http.HandleFunc("/archdaily", pkg.Cors(pkg.GetArchdailyImagesRoute))
	http.HandleFunc("/img2base64", pkg.Cors(pkg.Img2Base64))
	//不要加cors，不然再服务器部署之后会出现样式丢失的清空

	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		return
	}
}

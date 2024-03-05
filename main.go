package main

import (
	"SpiderGo/pkg"
	"net/http"
)

func main() {
	http.HandleFunc("/archdaily", pkg.Cors(pkg.GetArchdailyImagesRoute))
	http.HandleFunc("/txt2img", pkg.Cors(pkg.Txt2img))
	http.HandleFunc("/img2img", pkg.Cors(pkg.Img2img))
	http.HandleFunc("/extra", pkg.Cors(pkg.ExtraSingleImage))
	//不要加cors，不然再服务器部署之后会出现样式丢失的清空

	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		return
	}
}

package pkg

import (
	"math"
	"net/http"
)

const sdServer = "http://10.0.0.246:7860"

func Txt2img(w http.ResponseWriter, r *http.Request) {
	TransmitPost(sdServer+"/sdapi/v1/txt2img", w, r)
}

func Img2img(w http.ResponseWriter, r *http.Request) {
	TransmitPost(sdServer+"/sdapi/v1/img2img", w, r)
}

// ExtraSingleImage 放大单一图片
func ExtraSingleImage(w http.ResponseWriter, r *http.Request) {
	TransmitPost(sdServer+"/sdapi/v1/extra-single-image", w, r)
}

func ControlNetModels(w http.ResponseWriter, r *http.Request) {
	TransmitGet(sdServer+"/controlnet/model_list", w)
}

func ControlNetTypes(w http.ResponseWriter, r *http.Request) {
	TransmitGet(sdServer+"/controlnet/control_types", w)
}

func CalculateImgWidthHeight(originW int, originH int) (w int, h int) {
	scale2 := float64(originW*originH) / float64(512*512)
	scale := math.Pow(scale2, 0.5)
	return int(float64(originW) / scale), int(float64(originH) / scale)
}

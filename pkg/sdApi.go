package pkg

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

type Txt2imgRequestJson struct {
	Prompt         string `json:"prompt"`
	NegativePrompt string `json:"negative_prompt"`
}

type Img2imgRequestJson struct {
	ImgUrl         string `json:"img_url"`
	Prompt         string `json:"prompt"`
	NegativePrompt string `json:"negative_prompt"`
}

type Txt2imgJson struct {
	Prompt         string `json:"prompt"`
	NegativePrompt string `json:"negative_prompt"`
	//Styles          []string `json:"styles"`
	//Seed            int      `json:"seed"`
	//Subseed         int      `json:"subseed"`
	//SubseedStrength int      `json:"subseed_strength"`
	//SeedResizeFromH int      `json:"seed_resize_from_h"`
	//SeedResizeFromW int      `json:"seed_resize_from_w"`
	//SamplerName     string   `json:"sampler_name"`
	//BatchSize       int      `json:"batch_size"`
	//NIter           int      `json:"n_iter"`
	//Steps           int      `json:"steps"`
	//CfgScale        int      `json:"cfg_scale"`
	Width  int `json:"width"`
	Height int `json:"height"`
	//RestoreFaces      bool     `json:"restore_faces"`
	//Tiling            bool     `json:"tiling"`
	//DoNotSaveSamples  bool     `json:"do_not_save_samples"`
	//DoNotSaveGrid     bool     `json:"do_not_save_grid"`
	//Eta               int      `json:"eta"`
	//DenoisingStrength int      `json:"denoising_strength"`
	//SMinUncond        int      `json:"s_min_uncond"`
	//SChurn            int      `json:"s_churn"`
	//STmax             int      `json:"s_tmax"`
	//STmin             int      `json:"s_tmin"`
	//SNoise            int      `json:"s_noise"`
	//OverrideSettings  struct {
	//} `json:"override_settings"`
	//OverrideSettingsRestoreAfterwards bool   `json:"override_settings_restore_afterwards"`
	//RefinerCheckpoint                 string `json:"refiner_checkpoint"`
	//RefinerSwitchAt                   int    `json:"refiner_switch_at"`
	//DisableExtraNetworks              bool   `json:"disable_extra_networks"`
	//FirstpassImage                    string `json:"firstpass_image"`
	//Comments                          struct {
	//} `json:"comments"`
	//EnableHr          bool          `json:"enable_hr"`
	//FirstphaseWidth   int           `json:"firstphase_width"`
	//FirstphaseHeight  int           `json:"firstphase_height"`
	//HrScale           int           `json:"hr_scale"`
	//HrUpscaler        string        `json:"hr_upscaler"`
	//HrSecondPassSteps int           `json:"hr_second_pass_steps"`
	//HrResizeX         int           `json:"hr_resize_x"`
	//HrResizeY         int           `json:"hr_resize_y"`
	//HrCheckpointName  string        `json:"hr_checkpoint_name"`
	//HrSamplerName     string        `json:"hr_sampler_name"`
	//HrPrompt          string        `json:"hr_prompt"`
	//HrNegativePrompt  string        `json:"hr_negative_prompt"`
	//ForceTaskId       string        `json:"force_task_id"`
	//SamplerIndex      string        `json:"sampler_index"`
	//ScriptName        string        `json:"script_name"`
	//ScriptArgs        []interface{} `json:"script_args"`
	//SendImages        bool          `json:"send_images"`
	//SaveImages        bool          `json:"save_images"`
	//AlwaysonScripts   struct {
	//} `json:"alwayson_scripts"`
	//Infotext string `json:"infotext"`
}

type Img2imgJson struct {
	Prompt         string `json:"prompt"`
	NegativePrompt string `json:"negative_prompt"`
	//Styles          []string `json:"styles"`
	//Seed            int      `json:"seed"`
	//Subseed         int      `json:"subseed"`
	//SubseedStrength int      `json:"subseed_strength"`
	//SeedResizeFromH int      `json:"seed_resize_from_h"`
	//SeedResizeFromW int      `json:"seed_resize_from_w"`
	//SamplerName     string   `json:"sampler_name"`
	//BatchSize       int      `json:"batch_size"`
	//NIter           int      `json:"n_iter"`
	//Steps           int      `json:"steps"`
	//CfgScale        int      `json:"cfg_scale"`
	Width  int `json:"width"`
	Height int `json:"height"`
	//RestoreFaces      bool     `json:"restore_faces"`
	//Tiling            bool     `json:"tiling"`
	//DoNotSaveSamples  bool     `json:"do_not_save_samples"`
	//DoNotSaveGrid     bool     `json:"do_not_save_grid"`
	//Eta               int      `json:"eta"`
	//DenoisingStrength float64  `json:"denoising_strength"`
	//SMinUncond        int      `json:"s_min_uncond"`
	//SChurn            int      `json:"s_churn"`
	//STmax             int      `json:"s_tmax"`
	//STmin             int      `json:"s_tmin"`
	//SNoise            int      `json:"s_noise"`
	//OverrideSettings  struct {
	//} `json:"override_settings"`
	//OverrideSettingsRestoreAfterwards bool   `json:"override_settings_restore_afterwards"`
	//RefinerCheckpoint                 string `json:"refiner_checkpoint"`
	//RefinerSwitchAt                   int    `json:"refiner_switch_at"`
	//DisableExtraNetworks              bool   `json:"disable_extra_networks"`
	//FirstpassImage                    string `json:"firstpass_image"`
	//Comments                          struct {
	//} `json:"comments"`
	InitImages []string `json:"init_images"`
	//ResizeMode             int           `json:"resize_mode"`
	//ImageCfgScale          int           `json:"image_cfg_scale"`
	//Mask                   string        `json:"mask"`
	//MaskBlurX              int           `json:"mask_blur_x"`
	//MaskBlurY              int           `json:"mask_blur_y"`
	//MaskBlur               int           `json:"mask_blur"`
	//MaskRound              bool          `json:"mask_round"`
	//InpaintingFill         int           `json:"inpainting_fill"`
	//InpaintFullRes         bool          `json:"inpaint_full_res"`
	//InpaintFullResPadding  int           `json:"inpaint_full_res_padding"`
	//InpaintingMaskInvert   int           `json:"inpainting_mask_invert"`
	//InitialNoiseMultiplier int           `json:"initial_noise_multiplier"`
	//LatentMask             string        `json:"latent_mask"`
	//ForceTaskId            string        `json:"force_task_id"`
	//SamplerIndex           string        `json:"sampler_index"`
	//IncludeInitImages      bool          `json:"include_init_images"`
	//ScriptName             string        `json:"script_name"`
	//ScriptArgs             []interface{} `json:"script_args"`
	//SendImages             bool          `json:"send_images"`
	//SaveImages             bool          `json:"save_images"`
	//AlwaysonScripts        struct {
	//} `json:"alwayson_scripts"`
	//Infotext string `json:"infotext"`
}

type SDResult struct {
	Images []string `json:"images"`
	Info   string   `json:"info"`
}

const sdServer = "http://192.168.1.5:7860"

func defaultTxt2imgJson() Txt2imgJson {
	return Txt2imgJson{
		Prompt:         "",
		NegativePrompt: "",
		//Styles:                            nil,
		//Seed:                              0,
		//Subseed:                           0,
		//SubseedStrength:                   0,
		//SeedResizeFromH:                   0,
		//SeedResizeFromW:                   0,
		//SamplerName:                       "",
		//BatchSize:                         0,
		//NIter:                             0,
		//Steps:                             0,
		//CfgScale:                          0,
		Width:  512,
		Height: 512,
		//RestoreFaces:                      false,
		//Tiling:                            false,
		//DoNotSaveSamples:                  false,
		//DoNotSaveGrid:                     false,
		//Eta:                               0,
		//DenoisingStrength:                 0,
		//SMinUncond:                        0,
		//SChurn:                            0,
		//STmax:                             0,
		//STmin:                             0,
		//SNoise:                            0,
		//OverrideSettings:                  struct{}{},
		//OverrideSettingsRestoreAfterwards: false,
		//RefinerCheckpoint:                 "",
		//RefinerSwitchAt:                   0,
		//DisableExtraNetworks:              false,
		//FirstpassImage:                    "",
		//Comments:                          struct{}{},
		//EnableHr:                          false,
		//FirstphaseWidth:                   0,
		//FirstphaseHeight:                  0,
		//HrScale:                           0,
		//HrUpscaler:                        "",
		//HrSecondPassSteps:                 0,
		//HrResizeX:                         0,
		//HrResizeY:                         0,
		//HrCheckpointName:                  "",
		//HrSamplerName:                     "",
		//HrPrompt:                          "",
		//HrNegativePrompt:                  "",
		//ForceTaskId:                       "",
		//SamplerIndex:                      "",
		//ScriptName:                        "",
		//ScriptArgs:                        nil,
		//SendImages:                        false,
		//SaveImages:                        false,
		//AlwaysonScripts:                   struct{}{},
		//Infotext:                          "",
	}
}

func defaultImg2imgJson() Img2imgJson {
	return Img2imgJson{
		Prompt:         "",
		NegativePrompt: "",
		//Styles:          nil,
		//Seed:            -1,
		//Subseed:         -1,
		//SubseedStrength: 0,
		//SeedResizeFromH: -1,
		//SeedResizeFromW: -1,
		//SamplerName:     "",
		//BatchSize:       1,
		//NIter:           1,
		//Steps:           50,
		//CfgScale:        7.0,
		Width:  512,
		Height: 512,
		//RestoreFaces:                      false,
		//Tiling:                            false,
		//DoNotSaveSamples:                  false,
		//DoNotSaveGrid:                     false,
		//Eta:                               0,
		//DenoisingStrength:                 0,
		//SMinUncond:                        0,
		//SChurn:                            0,
		//STmax:                             0,
		//STmin:                             0,
		//SNoise:                            0,
		//OverrideSettings:                  struct{}{},
		//OverrideSettingsRestoreAfterwards: false,
		//RefinerCheckpoint:                 "",
		//RefinerSwitchAt:                   0,
		//DisableExtraNetworks:              false,
		//FirstpassImage:                    "",
		//Comments:                          struct{}{},
		//InitImages:                        nil,
		//ResizeMode:                        0,
		//ImageCfgScale:                     0,
		//Mask:                              "",
		//MaskBlurX:                         0,
		//MaskBlurY:                         0,
		//MaskBlur:                          0,
		//MaskRound:                         false,
		//InpaintingFill:                    0,
		//InpaintFullRes:                    false,
		//InpaintFullResPadding:             0,
		//InpaintingMaskInvert:              0,
		//InitialNoiseMultiplier:            0,
		//LatentMask:                        "",
		//ForceTaskId:                       "",
		//SamplerIndex:                      "",
		//IncludeInitImages:                 false,
		//ScriptName:                        "",
		//ScriptArgs:                        nil,
		//SendImages:                        false,
		//SaveImages:                        false,
		//AlwaysonScripts:                   struct{}{},
		//Infotext:                          "",
	}
}

func Txt2img(w http.ResponseWriter, r *http.Request) {
	// 检查请求方法是否为 POST
	if r.Method != "POST" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	dataByte, err := io.ReadAll(r.Body)
	handle(err)
	txt2ImgJson := new(Txt2imgRequestJson)
	err = json.Unmarshal(dataByte, txt2ImgJson)
	handle(err)
	txt2img := defaultTxt2imgJson()
	txt2img.Prompt = txt2ImgJson.Prompt
	txt2img.NegativePrompt = txt2ImgJson.NegativePrompt
	jsonData, err := json.Marshal(txt2img)
	handle(err)
	reader := strings.NewReader(string(jsonData))
	response, err := http.Post(sdServer+"/sdapi/v1/txt2img", "application/json", reader)
	handle(err)
	dataByte, err = io.ReadAll(response.Body)
	handle(err)
	_, err = w.Write(dataByte)
	handle(err)
}

func Img2img(w http.ResponseWriter, r *http.Request) {
	// 检查请求方法是否为 POST
	if r.Method != "POST" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	dataByte, err := io.ReadAll(r.Body)
	handle(err)
	img2ImgJson := new(Img2imgRequestJson)
	err = json.Unmarshal(dataByte, img2ImgJson)
	handle(err)
	imgConfig := Img2Base64(img2ImgJson.ImgUrl)
	initImg := make([]string, 0)
	initImg = append(initImg, imgConfig.Base64)
	img2img := defaultImg2imgJson()
	img2img.Height = imgConfig.Height
	img2img.Width = imgConfig.Width
	img2img.InitImages = initImg
	img2img.Prompt = img2ImgJson.Prompt
	img2img.NegativePrompt = img2ImgJson.NegativePrompt
	jsonData, err := json.Marshal(img2img)
	handle(err)
	reader := strings.NewReader(string(jsonData))
	response, err := http.Post(sdServer+"/sdapi/v1/img2img", "application/json", reader)
	handle(err)
	dataByte, err = io.ReadAll(response.Body)
	handle(err)
	_, err = w.Write(dataByte)
	handle(err)
}

<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="col-12" style="height: 10px"/>
  <Txt2ImgComponent :generate-base64-image="generateBase64Image" ref="txt2imgComponent"/>
  <!--  <button class="btn btn-primary">下载图片</button>-->
  <div style="height: 72px"/>
  <FooterButtonComponent :generate-img="generateBase64Image" :generate-func="sdGenerate"
                         :regenerate-func="sdRegenerate" :is-enable="true"
                         :generate-img-height="generateImgHeight" :generate-img-width="generateImgWidth"/>
</template>
<script>

import {defineComponent} from "vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import Txt2ImgComponent from "@/components/Txt2ImgComponent.vue";
import FooterButtonComponent from "@/components/FooterButtonComponent.vue"
import Img2ImgComponent from "@/components/Img2ImgComponent.vue";
import {txt2img, txt2imgRedraw} from "@/sdApi.js";
import {hideGeneratingModal} from "@/main.js";

export default defineComponent({
  components: {Img2ImgComponent, FooterButtonComponent, Txt2ImgComponent, NavigationComponent},
  data() {
    return {
      generateBase64Image: "",
      generateImgWidth: 0,
      generateImgHeight: 0,
      currentTab: "文生图"
    }
  },
  methods: {
    sdGenerate() {
      this.generateCore(this.$refs.txt2imgComponent.$refs.sdSettingComponent.controlNetImg, {}, txt2img)
    },
    sdRegenerate(mask) {
      const data = {
        init_images: [this.generateBase64Image],
        mask: mask,
        width: this.generateImgWidth,
        height: this.generateImgHeight
      }
      this.generateCore(null, data, txt2imgRedraw)
    },
    generateCore(controlImg, data, func) {
      const negativePrompt = this.$refs.txt2imgComponent.$refs.sdSettingComponent.negativePrompt
      const prompt = this.$refs.txt2imgComponent.$refs.sdSettingComponent.prompt
      const isControlNetEnable = this.$refs.txt2imgComponent.$refs.sdSettingComponent.isControlNetEnable
      const that = this
      data.prompt = prompt
      data.negative_prompt = negativePrompt
      if (isControlNetEnable) {
        const selectControlType = this.$refs.txt2imgComponent.$refs.sdSettingComponent.selectControlType
        const weight = this.$refs.txt2imgComponent.$refs.sdSettingComponent.weight
        const selectControlModel = this.$refs.txt2imgComponent.$refs.sdSettingComponent.getSelectControlModel()
        const controlnet = {
          args: [
            {
              enable: this.$refs.txt2imgComponent.$refs.sdSettingComponent.isControlNetEnable,
              weight: weight,
              module: selectControlType,
              model: selectControlModel.path,
              resize_mode: 0,
              processor_res: 512,
              threshold_a: 100,
              threshold_b: 200,
              guidance_start: 0,
              guidance_end: 1,
              control_mode: 0,
            }
          ]
        }
        if (controlImg != null) {
          controlnet.args[0].input_image = controlImg
        }
        data.alwayson_scripts = {
          controlnet: controlnet
        }
      } else {
        data.alwayson_scripts = {
          controlnet: {
            args: []
          }
        }
      }
      func(data, function (data) {
        const images = data['images']
        if (images !== null && images !== undefined) {
          if (images.length > 0) {
            that.generateBase64Image = "data:image/png;base64," + images[0]
            const image = new Image()
            image.onload = function () {
              that.generateImgWidth = image.width
              that.generateImgHeight = image.height
            }
            image.src = that.generateBase64Image
            hideGeneratingModal()
          }
        }
      })
    },
  }
})
</script>

<style>

</style>

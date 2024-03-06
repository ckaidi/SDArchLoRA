<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="col-12" style="height: 10px"/>
  <Img2ImgComponent :select-img="selectImg" :generate-base64-image="generateBase64Image"
                    :upload-call-back="uploadCallback" ref="img2imgComponent"/>
  <div style="height: 72px"/>
  <FooterButtonComponent :generate-img="generateBase64Image" :generate-func="sdGenerate"
                         :regenerate-func="sdRegenerate"
                         :generate-img-height="generateImgHeight" :generate-img-width="generateImgWidth"/>
</template>
<script>
import {defineComponent} from "vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import Img2ImgComponent from "@/components/Img2ImgComponent.vue";
import FooterButtonComponent from "@/components/FooterButtonComponent.vue"
import {img2img, img2imgWithMask} from "@/sdApi.js";

export default defineComponent({
  components: {FooterButtonComponent, NavigationComponent, Img2ImgComponent},
  data() {
    return {
      currentTab: "图生图",
      selectImg: "",
      generateBase64Image: "",
      generateImgWidth: 0,
      generateImgHeight: 0,
    }
  },
  created() {
    const temp = this.$route.query.imgUrl
    if (temp !== undefined)
      this.selectImg = temp
  },
  methods: {
    uploadCallback(img) {
      this.selectImg = img
    },
    sdGenerate() {
      const prompt = this.$refs.img2imgComponent.$refs.sdSettingComponent.prompt
      const negativePrompt = this.$refs.img2imgComponent.$refs.sdSettingComponent.negativePrompt
      const that = this
      const data = {
        prompt: prompt,
        negative_prompt: negativePrompt,
      }
      const isControlNetEnable = this.$refs.img2imgComponent.$refs.sdSettingComponent.isControlNetEnable
      if (isControlNetEnable) {
        const selectControlType = this.$refs.img2imgComponent.$refs.sdSettingComponent.selectControlType
        const weight = this.$refs.img2imgComponent.$refs.sdSettingComponent.weight
        const selectControlModel = this.$refs.img2imgComponent.$refs.sdSettingComponent.getSelectControlModel()
        const controlnet = {
          args: [
            {
              enable: this.$refs.img2imgComponent.$refs.sdSettingComponent.isControlNetEnable,
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
        data.alwayson_scripts = {
          controlnet: controlnet
        }
      }
      img2img(this.selectImg, data, function (data) {
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
          }
        }
      })
    },
    sdGenerateOrigin() {

    },
    sdRegenerate(mask) {
      const negativePrompt = this.$refs.img2imgComponent.$refs.sdSettingComponent.negativePrompt
      const prompt = this.$refs.img2imgComponent.$refs.sdSettingComponent.prompt
      const that = this
      img2imgWithMask(this.generateBase64Image, mask, this.generateImgWidth, this.generateImgHeight, prompt, negativePrompt, function (data) {
        const images = data['images']
        if (images !== null && images !== undefined) {
          if (images.length > 0)
            that.generateBase64Image = "data:image/png;base64," + images[0]
        }
        const parameters = data['parameters']
        if (parameters !== null && parameters !== undefined) {
          that.generateImgWidth = parameters['width']
          that.generateImgHeight = parameters['height']
        }
      }, mask)
    }
  }
})
</script>

<style scoped>

</style>

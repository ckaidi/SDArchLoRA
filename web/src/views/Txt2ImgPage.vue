<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="col-12" style="height: 10px"/>
  <Txt2ImgComponent :generate-base64-image="generateBase64Image" ref="txt2imgComponent"/>
  <!--  <button class="btn btn-primary">下载图片</button>-->
  <div style="height: 72px"/>
  <FooterButtonComponent :generate-img="generateBase64Image" :generate-func="sdGenerate" :regenerate-func="sdRegenerate"
                         :generate-img-height="generateImgHeight" :generate-img-width="generateImgWidth"/>
</template>
<script>

import {defineComponent} from "vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import Txt2ImgComponent from "@/components/Txt2ImgComponent.vue";
import FooterButtonComponent from "@/components/FooterButtonComponent.vue"
import {img2imgWithMask, txt2img} from "@/sdApi.js";
import Img2ImgComponent from "@/components/Img2ImgComponent.vue";

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
      const negativePrompt = this.$refs.txt2imgComponent.$refs.sdSettingComponent.negativePrompt
      const prompt = this.$refs.txt2imgComponent.$refs.sdSettingComponent.prompt
      const that = this
      txt2img(prompt, negativePrompt, function (data) {
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
      })
    },
    sdRegenerate(mask) {
      const negativePrompt = this.$refs.txt2imgComponent.$refs.sdSettingComponent.negativePrompt
      const prompt = this.$refs.txt2imgComponent.$refs.sdSettingComponent.prompt
      const that = this
      img2imgWithMask(this.generateBase64Image, mask, this.generateImgWidth, this.generateImgHeight, prompt, negativePrompt, function (data) {
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
      }, mask)
    }
  }
})
</script>

<style>

</style>

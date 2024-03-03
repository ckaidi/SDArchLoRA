<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="col-12" style="height: 10px"/>
  <Txt2ImgComponent :generate-base64-image="generateBase64Image" ref="txt2imgComponent"/>
  <button class="btn btn-primary col-3 mt-4 mb-4" @click="sdGenerate">生成</button>
  <!--  <button class="btn btn-primary">下载图片</button>-->
  <div style="height: 72px"/>
  <FooterButtonComponent/>
</template>
<script>

import {defineComponent} from "vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import Txt2ImgComponent from "@/components/Txt2ImgComponent.vue";
import FooterButtonComponent from "@/components/FooterButtonComponent.vue"
import {txt2img} from "@/sdApi.js";
import Img2ImgComponent from "@/components/Img2ImgComponent.vue";

export default defineComponent({
  components: {Img2ImgComponent, FooterButtonComponent, Txt2ImgComponent, NavigationComponent},
  data() {
    return {
      generateBase64Image: "",
      currentTab: "文生图"
    }
  },
  methods: {
    sdGenerate() {
      const negativePrompt = this.$refs.txt2imgComponent.$refs.sdSettingComponent.negativePrompt
      const prompt = this.$refs.txt2imgComponent.$refs.sdSettingComponent.prompt
      const that = this
      txt2img(prompt, negativePrompt, function (imageBaseString) {
        that.generateBase64Image = "data:image/png;base64," + imageBaseString
      })
    }
  }
})
</script>

<style>

</style>

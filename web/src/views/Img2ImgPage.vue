<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="col-12" style="height: 10px"/>
  <Img2ImgComponent :select-img="selectImg" :generate-base64-image="generateBase64Img" :is-upload="true"/>
  <div style="height: 72px"/>
  <FooterButtonComponent/>
</template>
<script>

import {defineComponent} from "vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import Img2ImgComponent from "@/components/Img2ImgComponent.vue";
import FooterButtonComponent from "@/components/FooterButtonComponent.vue"

export default defineComponent({
  components: {FooterButtonComponent, NavigationComponent, Img2ImgComponent},
  data() {
    return {
      currentTab: "图生图",
      selectImg: "",
      generateBase64Img: "",
    }
  }
})
</script>

<style scoped>

</style>

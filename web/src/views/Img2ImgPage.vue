<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="col-12" style="height: 10px"/>
  <Img2ImgComponent :select-img="selectImg" :generate-base64-image="generateBase64Img" :is-upload="true"/>
</template>
<script>

import {defineComponent} from "vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import Img2ImgComponent from "@/components/Img2ImgComponent.vue";

export default defineComponent({
  components: {NavigationComponent, Img2ImgComponent},
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

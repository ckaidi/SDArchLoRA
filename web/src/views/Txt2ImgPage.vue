<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="col-12" style="height: 10px"/>
  <Txt2ImgComponent :generate-base64-image="generateBase64Image"/>
</template>
<script>

import {defineComponent} from "vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import Txt2ImgComponent from "@/components/Txt2ImgComponent.vue";

export default defineComponent({
  components: {Txt2ImgComponent, NavigationComponent},
  data() {
    return {
      generateBase64Image: "",
      currentTab: "文生图"
    }
  }
})
</script>

<style>

</style>

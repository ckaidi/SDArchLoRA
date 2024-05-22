<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="row-cols-12" style="height: 100%;position: fixed;width: 100%">
    <div class="h-100 btn col-2" style="height: 100%;overflow-y:auto">
      <div v-for="(image, index) in allImages"
           class="m-1">
        <img :src="image" alt="" style="width: 100%; height: auto;">
        <div v-show="index === allImages.length - 1" style="height: 80px"/>
      </div>
    </div>
    <div class="h-100 btn btn-secondary col-5" style="height: 100%"></div>
    <div class="h-100 btn btn-secondary col-5" style="height: 100%"></div>
  </div>
</template>
<script>
import {defineComponent} from "vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import Img2ImgComponent from "@/components/Img2ImgComponent.vue";
import FooterButtonComponent from "@/components/FooterButtonComponent.vue"
import {sdServer} from "@/sdApi.js";
import {loadImageFromDB} from "@/main.js";

export default defineComponent({
  components: {FooterButtonComponent, NavigationComponent, Img2ImgComponent},
  data() {
    return {
      allImages: [],
      currentTab: "打标签",
    }
  },
  created() {
    const temp = this.$route.query.imgUrl
    if (temp !== undefined) {
      const xhr = new XMLHttpRequest();
      const that = this
      xhr.open('POST', sdServer + '/img2base64', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText)
          loadImageFromDB(result, that.allImages)
        } else {
          alert('网络错误，请重试')
        }
      };
      xhr.send(temp);
    }
  },
})
</script>

<style scoped>
.m-1:last-child {
  margin-bottom: 20px;
}
</style>

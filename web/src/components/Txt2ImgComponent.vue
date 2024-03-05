<template>
  <div class="container-fluid row" style="min-height: 200px">
    <div class="col-6 offset-3">
      <div v-show="generateBase64Image===''" class="p-1 container img-thumbnail text-secondary">
        图片生成区
      </div>
      <!--v.img是指base64格式的图片数据流-->
      <img class="img-thumbnail p-1" v-show="generateBase64Image!==''" :src=generateBase64Image alt="生成图片">
    </div>
  </div>
  <SDSettingComponent ref="sdSettingComponent" :control-net-img="controlNetImg"/>
</template>
<script>
import SDSettingComponent from "@/components/SDSettingComponent.vue";

export default {
  components: {SDSettingComponent},
  props: {
    selectImg: "",
    generateBase64Image: "",
    controlNetImg: "",
  },
}
</script>
<style>
.container {
  display: flex;
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  height: 100%; /* 设置高度为视口高度，使内容垂直居中 */
}
</style>

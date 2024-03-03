<template>
  <div class="row">
    <div class="col-6">
      <img
          :src=selectImg
          class="img-thumbnail p-1" alt="原始图像">
    </div>
    <div class="col-6">
      <div v-show="generateBase64Image===''" class="p-1 container img-thumbnail text-secondary">
        图片生成区
      </div>
      <!--v.img是指base64格式的图片数据流-->
      <img class="img-thumbnail p-1" v-show="generateBase64Image!==''" :src=generateBase64Image alt="生成图片">
    </div>
  </div>
  <div class="m-2 row">
    <label for="exampleFormControlTextarea1" class="text-start start-0 form-label fw-bold">正向提示词</label>
    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="prompt"></textarea>
  </div>
  <div class="m-2 row">
    <label for="exampleFormControlTextarea1" class="text-start start-0 form-label fw-bold">反向提示词</label>
    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="negativePrompt"></textarea>
  </div>
  <div class="m-2 row">
    <label for="exampleFormControlTextarea1" class="text-start start-0 form-label fw-bold">ControlNet</label>
    <div class="row">
      <img
          :src=selectImg
          class="img-thumbnail col-6 p-1" alt="...">
      <div class="container-fluid col-6 row">
        <div class="input-group">
          <div class="col-2 m-1">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
              <label class="form-check-label" for="flexCheckDefault">
                启用
              </label>
            </div>
          </div>
          <div class="col-4 m-1">
            <select class="form-select">
              <option selected>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
          <div class="col-4 m-1">
            <select class="form-select">
              <option selected>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <label for="customRange2" class="form-label">权重</label>
          <input type="range" class="form-range" min="0" max="100" id="customRange2">
        </div>
        <div v-for="index of 300" :key="index" class="col-12"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      prompt: "building,Best quality,Architectural photography,photo realistic, hyperrealistic, super detailed,8k," +
          "street, cinematic photography, ultra detailed, highly detailed, hyper detail, hyper realistic, " +
          "photorealistic, cinematic, rendering, archdaily, 500px,40mm",
      negativePrompt: "signature, soft, blurry, drawing, sketch, poor quality, ugly, text, type, word, logo, " +
          "pixelated, low resolution, saturated, high contrast, oversharpened,(cloud),dirt"
    }
  },
  methods: {},
  props: {
    selectImg: "",
    generateBase64Image: "",
  }
}
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  height: 100%; /* 设置高度为视口高度，使内容垂直居中 */
}
</style>

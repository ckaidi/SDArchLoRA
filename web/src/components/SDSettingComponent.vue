<template>
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
      <div v-show="controlNetImg!==''&&controlNetImg!==undefined" class="col-6 p-1">
        <img :src="controlNetImg" class="img-thumbnail" alt="...">
      </div>
      <div v-show="controlNetImg===''||controlNetImg===undefined"
           class="col-6 p-1 img-thumbnail text-secondary"
           @click="openFileUpload" style="cursor: pointer;min-height: 200px">
        <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
        <div>
          点击上传图片
        </div>
      </div>
      <div class="col-6 row">
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
  props: {
    controlNetImg: "",
  },
  methods: {
    openFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.$refs.image.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
</script>
<style>

</style>

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
      <div v-show="isControlNetImgUse&&controlNetImg!==''&&controlNetImg!==undefined" class="col-6 p-1">
        <img :src="controlNetImg" class="img-thumbnail" alt="...">
      </div>
      <div v-show="isControlNetImgUse&&(controlNetImg===''||controlNetImg===undefined)"
           class="col-6 p-1 img-thumbnail text-secondary"
           @click="openFileUpload" style="cursor: pointer;min-height: 200px">
        <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
        <div class="p-1 container">
          点击上传图片
        </div>
      </div>
      <div :class="{'col-6':isControlNetImgUse}">
        <div class="row m-1">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" v-model="isControlNetEnable">
            <p class="text-start">启用</p>
          </div>
        </div>
        <div class="input-group row">
          <div class="col-6">
            <p class="text-start">Preprocessor</p>
            <select class="form-select" v-model="selectControlType">
              <option v-for="(item,_) in this.controlNetTypes" :key="item">{{ item }}</option>
            </select>
          </div>
          <div class="col-6">
            <p class="text-start">Model</p>
            <select class="form-select" v-model="selectControlModelName">
              <option v-for="(item,_) in this.controlNetModels" :key="item.name">{{ item.name }}</option>
            </select>
          </div>
        </div>
        <div class="col-12 mt-2">
          <label for="customRange2" class="form-label">权重 {{ weight}}</label>
          <input type="range" class="form-range" min="0" max="2" step="0.01" id="customRange2" v-model="weight">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {sdServer} from "@/sdApi.js";

export default {
  created() {
    this.getControlNetModel()
    this.getControlTypes()
  },
  data() {
    return {
      weight: 1,
      prompt: "building,Best quality,Architectural photography,photo realistic, hyperrealistic, super detailed,8k," +
          "street, cinematic photography, ultra detailed, highly detailed, hyper detail, hyper realistic, " +
          "photorealistic, cinematic, rendering, archdaily, 500px,40mm",
      negativePrompt: "signature, soft, blurry, drawing, sketch, poor quality, ugly, text, type, word, logo, " +
          "pixelated, low resolution, saturated, high contrast, oversharpened,(cloud),dirt",
      isControlNetEnable: false,
      controlNetImg: "",
      controlNetModels: [],
      selectControlModelName: null,
      controlNetTypes: [],
      selectControlType: 'none',
    }
  },
  props: {
    isControlNetImgUse: true
  },
  methods: {
    getControlTypes() {
      const that = this
      const xhr = new XMLHttpRequest()
      xhr.open('GET', sdServer + '/controlnet/types', true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText)
          const modeList = result['control_types']['All']['module_list']
          for (const model of modeList) {
            that.controlNetTypes.push(model.toString())
          }
        } else {
          console.log('error')
        }
      }
      xhr.send()
    },
    getControlNetModel() {
      const that = this
      const xhr = new XMLHttpRequest()
      xhr.open('GET', sdServer + '/controlnet/models', true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText)
          const modeList = result['model_list']
          that.controlNetModels.push({
            name: 'none',
            path: ''
          })
          for (const model of modeList) {
            const temp = model.toString()
            that.controlNetModels.push({
              name: temp.split('[')[0].trim(),
              path: temp
            })
          }
          that.selectControlModelName = that.controlNetModels[0].name
        } else {
          console.log('error')
        }
      }
      xhr.send()
    },
    getSelectControlModel() {
      for (const model of this.controlNetModels) {
        if (model.name === this.selectControlModelName) {
          return model
        }
      }
      return null
    },
    openFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        const that = this
        reader.onload = (e) => {
          that.controlNetImg = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
</script>
<style>

</style>

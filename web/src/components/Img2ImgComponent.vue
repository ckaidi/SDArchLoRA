<template>
  <div class="row" style="min-height: 200px">
    <div class="col-6">
      <img v-show="!isUpload" :src=selectImg
           class="img-thumbnail p-1" alt="原始图像">
      <div v-show="selectImg===''" class="p-1 container img-thumbnail text-secondary"
           @click="openFileUpload" style="cursor: pointer">
        <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload">
        <div>
          点击上传原始图像
        </div>
      </div>
    </div>
    <div class="col-6">
      <div v-show="generateBase64Image===''" class="p-1 container img-thumbnail text-secondary">
        图片生成区
      </div>
      <img class="img-thumbnail p-1" v-show="generateBase64Image!==''" :src=generateBase64Image alt="生成图片">
      <button v-show="generateBase64Image!==''">局部重绘</button>
    </div>
  </div>
  <SDSettingComponent ref="sdSettingComponent" :control-net-img="controlNetImg"/>
</template>
<script>
import ScrawlComponent from "@/components/ScrawlComponent.vue";
import SDSettingComponent from "@/components/SDSettingComponent.vue";
import NavigationComponent from "@/components/NavigationComponent.vue";

export default {
  components: {ScrawlComponent, NavigationComponent, SDSettingComponent},
  data() {
    return {
      dw: 300,
      controlNetImg: "https://image-static.segmentfault.com/403/138/4031383455-530adf1833207707",
      selectImg: "",
    }
  },
  props: {
    isUpload: false,
    selectImg: "",
    generateBase64Image: "",
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
<style scoped>
.container {
  display: flex;
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  height: 100%; /* 设置高度为视口高度，使内容垂直居中 */
}
</style>

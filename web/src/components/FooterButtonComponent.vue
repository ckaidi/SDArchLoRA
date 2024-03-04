<template>
  <div class="modal modal-xl fade" id="scrawlModal" tabindex="-1"
       aria-labelledby="exampleModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-dialog modal-dialog-centered modal-dialog-scrollable" id="scrawlModalDialog">
      <div class="modal-content" id="scrawlModalContent">
        <div class="modal-header" id="scrawlHeader">
          <h1 class="modal-title fs-5" id="exampleModalLabel">局部重绘</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="scrawlModalBody">
          <ScrawlComponent ref="scrawlComponent" :generate-base64-image="generateImg" :width="generateImgWidth"
                           :height="generateImgHeight"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary" @click="clearCanvas">清空画布</button>
          <button type="button" class="btn btn-primary">重新生成</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-footer fixed-bottom bg-light border-top border-1 secondary-subtle align-content-end">
    <button :disabled="generateImg===''" class="btn btn-primary m-2" data-bs-toggle="modal"
            data-bs-target="#scrawlModal">局部重绘
    </button>
    <button class="btn btn-primary m-2" @click="generateFunc">生成</button>
  </div>
</template>
<script>

import {defineComponent} from "vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import Img2ImgComponent from "@/components/Img2ImgComponent.vue";
import ScrawlComponent from "@/components/ScrawlComponent.vue";

export default defineComponent({
  components: {ScrawlComponent, Img2ImgComponent, NavigationComponent},
  props: {
    // base64Img
    generateImg: {
      type: String,
      default: '',
    },
    generateImgWidth: {
      type: Number,
      default: 0,
    },
    generateImgHeight: {
      type: Number,
      default: 0,
    },
    generateFunc: null
  },
  methods: {
    clearCanvas() {
      this.$refs.scrawlComponent.clearCanvas()
    }
  }
})
</script>

<style>

</style>

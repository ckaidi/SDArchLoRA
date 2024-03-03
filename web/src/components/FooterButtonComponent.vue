<template>
  <div class="modal modal-xl fade" id="scrawlModal" tabindex="-1"
       aria-labelledby="exampleModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">AI生成</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ScrawlComponent :width="dw" :height="dw"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary" @click="sdGenerate">生成</button>
          <button type="button" class="btn btn-primary">下载图片</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-footer fixed-bottom bg-light border-top border-1 secondary-subtle align-content-end">
    <button class="btn btn-primary m-2" data-bs-toggle="modal" data-bs-target="#scrawlModal">局部重绘</button>
    <button class="btn btn-primary m-2">生成</button>
  </div>
</template>
<script>

import {defineComponent} from "vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import Img2ImgComponent from "@/components/Img2ImgComponent.vue";
import ScrawlComponent from "@/components/ScrawlComponent.vue";

export default defineComponent({
  components: {ScrawlComponent, Img2ImgComponent, NavigationComponent},
  data() {
    return {
      "dw": 300
    }
  }
})
</script>

<style>

</style>

<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="modal modal-xl fade" id="exampleModal" tabindex="-1"
       aria-labelledby="exampleModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">AI生成</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <Img2ImgComponent :is-upload="false" :select-img="currentSelectUrl"
                            :generate-base64-image="generateBase64Image"
                            ref="img2imgComponent"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary" @click="sdGenerate">局部重绘</button>
          <button type="button" class="btn btn-primary" @click="sdGenerate">生成</button>
          <button type="button" class="btn btn-primary">下载图片</button>
        </div>
      </div>
    </div>
  </div>
  <SearchComponent @transfer="addImages"/>
  <div style="min-height: 100%; width:100%">
    <Waterfall
        :list="list"
        :row-key="options.rowKey"
        :gutter="options.gutter"
        :has-around-gutter="options.hasAroundGutter"
        :width="options.width"
        :breakpoints="options.breakpoints"
        :img-selector="options.imgSelector"
        :animation-effect="options.animationEffect"
        :animation-duration="options.animationDuration"
        :animation-delay="options.animationDelay"
        :lazyload=false
        :cross-origin=true
        :align="options.align"
    >
      <template #item="{ item, url, index }">
        <div @mouseover="mouseover(item)" @mouseleave="mouseleave(item)"
             class="bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all
            duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group">
          <div class="card">
            <div class="position-absolute top-0 left-0 d-flex justify-content-center align-items-center
                 w-100 h-100 text-white fs-5 bg-body-secondary opacity-75"
                 :class="{'cardButtonShow':item.show,'cardButtonHide':!item.show}">
              <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                AI生图
              </button>
            </div>
            <img :src=url :alt="item.name" class="card-img-top">
          </div>
        </div>
      </template>
    </Waterfall>
    <button class="btn btn-primary mb-4">
      加载更多
    </button>
  </div>
</template>
<script>
import 'vue-waterfall-plugin-next/dist/style.css'
import SearchComponent from "@/components/SearchComponent.vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import Img2ImgComponent from "@/components/Img2ImgComponent.vue";
import {LazyImg, Waterfall} from "vue-waterfall-plugin-next";
import {img2img} from "@/sdApi.js";

export default {
  components: {NavigationComponent, SearchComponent, LazyImg, Waterfall, Img2ImgComponent},
  data() {
    return {
      currentTab: "搜图",
      generateBase64Image: "",
      currentSelectUrl: "",
      tabName: "SDRS",
      list: [],
      columnHeights: [0, 0, 0],
      options: {
        // 唯一key值
        rowKey: 'id',
        // 卡片之间的间隙
        gutter: 10,
        // 是否有周围的gutter
        hasAroundGutter: false,
        // 卡片在PC上的宽度
        width: 320,
        // 自定义行显示个数，主要用于对移动端的适配
        breakpoints: {
          1200: {
            // 当屏幕宽度小于等于1200
            rowPerView: 4,
          },
          800: {
            // 当屏幕宽度小于等于800
            rowPerView: 3,
          },
          500: {
            // 当屏幕宽度小于等于500
            rowPerView: 2,
          },
        },
        // 动画效果
        animationEffect: 'animate__fadeInUp',
        // 动画时间
        animationDuration: 1000,
        // 动画延迟
        animationDelay: 300,
        // imgSelector
        imgSelector: 'src.original',
        // 加载配置
        // 是否懒加载
        lazyload: true,
        align: 'center',
        crossOrigin: true,
      }
    }
  },
  methods: {
    sdGenerate() {
      const negativePrompt = this.$refs.img2imgComponent.$refs.sdSettingComponent.negativePrompt
      const prompt = this.$refs.img2imgComponent.$refs.sdSettingComponent.prompt
      const that = this
      img2img(this.currentSelectUrl, prompt, negativePrompt, function (data) {
        const images = data['images']
        if (images !== null && images !== undefined) {
          if (images.length > 0)
            that.generateBase64Image = "data:image/png;base64," + images[0]
        }
        const parameters = data['parameters']
        if (parameters !== null && parameters !== undefined) {
          that.generateImgWidth = parameters['width']
          that.generateImgHeight = parameters['height']
        }
      })
    },
    mouseover(item) {
      item.show = true
      this.currentSelectUrl = item.src.original.replace("medium_jpg", "large_jpg");
    },
    mouseleave(item) {
      item.show = false
    },
    addImages(imageText) {
      const image = JSON.parse(imageText)
      this.list.push({
        src: {
          original: image.url
        },
        show: false
      })
    }
  }
}
</script>
<style scoped>
.cardButtonShow {
  visibility: visible;
}

.cardButtonHide {
  visibility: hidden;
}

.item img {
  width: 100%;
  height: 100%;
}
</style>

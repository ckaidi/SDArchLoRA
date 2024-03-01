<template>
  <SettingComponent @transfer="addImages"/>
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
        :lazyload="options.lazyload"
        :cross-origin=true
        :align="options.align"
    >
      <template #item="{ item, url, index }">
        <div
            class="bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all
            duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group">
          <div class="card">
            <img :src=url :alt="item.name" class="card-img-top">
            <div class="card-body">
              <!--              <h5 class="card-title">Card title</h5>-->
              <!--              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's-->
              <!--                content.</p>-->
              <a href="#" class="btn btn-secondary">AI生图</a>
            </div>
          </div>
        </div>
      </template>
    </Waterfall>

    <!--    <div class="flex justify-center py-10 bg-gray-900">-->
    <!--      <button-->
    <!--          class="px-5 py-2 rounded-full bg-gray-700 text-md text-white cursor-pointer hover:bg-gray-800 transition-all duration-300">-->
    <!--        加载更多-->
    <!--      </button>-->
    <!--    </div>-->
  </div>
</template>
<script>
import 'vue-waterfall-plugin-next/dist/style.css'
import SettingComponent from "@/components/SettingComponent.vue";
import {LazyImg, Waterfall} from "vue-waterfall-plugin-next";

export default {
  components: {LazyImg, Waterfall, SettingComponent},
  created() {
  },
  data() {
    return {
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
    addImages(imageText) {
      const image = JSON.parse(imageText)
      this.list.push({
        src: {
          original: image.url
        }
      })
    }
  }
}
</script>
<style scoped>

.item img {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <ScrawlComponent :url="drawUrl" :width="dw" :height="dw"/>
</template>
<script>
import 'vue-waterfall-plugin-next/dist/style.css'
import SearchComponent from "@/components/SearchComponent.vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import Img2ImgComponent from "@/components/Img2ImgComponent.vue";
import {LazyImg, Waterfall} from "vue-waterfall-plugin-next";
import ScrawlComponent from "@/components/ScrawlComponent.vue";

export default {
  components: {ScrawlComponent, NavigationComponent, SearchComponent, LazyImg, Waterfall, Img2ImgComponent},
  data() {
    return {
      dw: 300,
      drawUrl: "rhino-logo.png",
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
}
</script>
<style>

.item img {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <SearchComponent ref="searchComponent" :on-receive-img="addImages"/>
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
        :lazyload=true
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
              <button type="button" class="btn btn-secondary" @click="tagImg(item)">
                放入训练
              </button>
            </div>
            <img :src=url :alt="item.name" class="card-img-top">
          </div>
        </div>
      </template>
    </Waterfall>
    <button v-show="list.length>0" class="btn btn-primary mb-4" @click="showMore">
      加载更多
    </button>
  </div>
</template>
<script>
import 'vue-waterfall-plugin-next/dist/style.css'
import SearchComponent from "@/components/SearchComponent.vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import {LazyImg, Waterfall} from "vue-waterfall-plugin-next";
import {
  OneDay,
  getConcept,
  createClientId,
  saveProjectInfoToDB,
  updateConceptItem, saveDataToConceptToDB, loadConceptDataFromDB, getKeyword,
} from "@/main.js";


export default {
  components: {NavigationComponent, SearchComponent, LazyImg, Waterfall},
  methods: {
    async tagImg(item) {
      const concept = await getConcept();
      window.location = "/#/cropper?" + "imgUrl=" + item.src.original + "&imgName=" + item.name + "&document_id=" + item.document_id
    },
    showMore() {
      this.$refs.searchComponent.showMore()
    },
    mouseover(item) {
      item.show = true
      this.currentSelectUrl = item.src.original
    },
    mouseleave(item) {
      item.show = false
    },
    // 接收到新图片到处理函数
    addImages(imageText) {
      if (imageText === 'end')
        return
      if (imageText.startsWith('chenkaidiConfig')) {
        const texts = imageText.split('/')
        updateConceptItem('searches', sessionStorage.getItem('keyword'), 'page_count', Number(texts[1]))
        updateConceptItem('searches', sessionStorage.getItem('keyword'), 'project_count', Number(texts[2]))
        return
      }
      const jsonData = JSON.parse(imageText)
      if ("document_type" in jsonData) {
        // 保存项目信息
        saveProjectInfoToDB(jsonData.document_id, jsonData)
      } else {
        // 保存图片信息
        saveDataToConceptToDB('images', jsonData.name, {
          name: jsonData.name,
          keyword: [sessionStorage.getItem('keyword')],
          url: jsonData.url,
          document_id: jsonData.document_id,
          date: Date.now()
        });
        this.list.push({
          keyword: [sessionStorage.getItem('keyword')],
          src: {
            original: jsonData.url
          },
          document_id: jsonData.document_id,
          name: jsonData.name,
          show: false
        })
      }
    }
  },
  async beforeCreate() {
    createClientId();
    const concept = await getConcept();
    let keyword = await getKeyword();
    if (keyword !== null && keyword !== undefined) {
      const arrays = await loadConceptDataFromDB('images');
      arrays.sort((item1, item2) => {
        return item1.date - item2.date;  // 升序排序
      });
      for (const image of arrays) {
        if (image.url === undefined) continue;
        if (!image.keyword.includes(keyword)) continue;
        this.list.push({
          src: {
            original: image.url
          },
          document_id: image.document_id,
          name: image.name,
          show: false
        })
      }
    }
  },
  data() {
    return {
      currentTab: "搜图",
      generateBase64Image: "",
      currentSelectUrl: "",
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

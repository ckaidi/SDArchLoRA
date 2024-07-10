<script setup lang="ts">

import SearchTextBoxComponent from "./SearchTextBoxComponent.vue";
import {ImageItem} from "../types/ImageItem.ts"
import {saveDataToConceptToDB, saveImageToDB, saveProjectInfoToDB, updateConceptItem} from "../main.ts";
import {ref} from "vue";
import SearchComponent from "./SearchComponent.vue";
import {Waterfall} from "vue-waterfall-plugin-next";
import {WaterOptions} from "../types/WaterOptions.ts";
import {ImageDB} from "../types/ImageDB.ts";
import {ProjectDB} from "../types/ProjectDB.ts";

const searchComponent = ref<typeof SearchComponent | null>(null);
const currentSelectUrl = ref("");
const list = ref<ImageItem[]>([]);
const options = ref<WaterOptions>(new WaterOptions());

async function tagImg(item: ImageItem) {
  window.location.href = "/#/cropper?" + "imgUrl=" + item.src.original + "&imgName=" + item.name + "&document_id=" + item.document_id
}

function seeBig(item: ImageItem) {
  return item.src.original.replace('medium_jpg', 'large_jpg');
}

function showMore() {
  if (searchComponent.value)
    searchComponent.value.showMore()
}

function mouseover(item: ImageItem) {
  item.show = true
  currentSelectUrl.value = item.src.original
}

function mouseleave(item: ImageItem) {
  item.show = false
}

// 接收到新图片到处理函数
function addImages(imageText: string) {
  if (imageText === 'end')
    return
  if (imageText.startsWith('chenkaidiConfig')) {
    const texts = imageText.split('/')
    const key = sessionStorage.getItem('keyword') as IDBValidKey | IDBKeyRange
    updateConceptItem('searches', key, 'page_count', Number(texts[1]))
    updateConceptItem('searches', key, 'project_count', Number(texts[2]))
    return
  }
  const jsonData = JSON.parse(imageText)
  if ("document_type" in jsonData) {
    // 保存项目信息
    saveProjectInfoToDB(new ProjectDB(jsonData.url, jsonData.CreateAt, jsonData.UpdateAt, jsonData.author, jsonData.bim,
        jsonData.categories, jsonData.document_type, jsonData.location, jsonData.meta_description, jsonData.offices,
        jsonData.photographers, jsonData.tags, jsonData.title, jsonData.url, jsonData.year));
  } else {
    // 保存图片信息
    saveImageToDB(new ImageDB(jsonData.url, jsonData.name, jsonData.document_id));
    saveDataToConceptToDB('images', {
      name: jsonData.name,
      keyword: [sessionStorage.getItem('keyword')],
      url: jsonData.url,
      document_id: jsonData.document_id,
      date: Date.now()
    });
    list.value.push({
      keyword: [sessionStorage.getItem('keyword') as string],
      src: {
        original: jsonData.url
      },
      document_id: jsonData.document_id,
      name: jsonData.name,
      show: false
    })
  }
}
</script>

<template>
  <SearchTextBoxComponent ref="searchComponent" :on-receive-img="addImages"/>
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
      <template #item="{ item, url }">
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
              <a type="button" class="btn btn-secondary" :href="seeBig(item)" target="_blank">
                查看大图
              </a>
            </div>
            <img :src=url :alt="item.name" class="card-img-top">
          </div>
        </div>
      </template>
    </Waterfall>
    <nav v-show="list.length>0" aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#">Previous</a></li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">Next</a></li>
      </ul>
    </nav>
    <button v-show="list.length>0" class="btn btn-primary mb-4" @click="showMore">
      加载更多
    </button>
  </div>
</template>

<style scoped>

</style>
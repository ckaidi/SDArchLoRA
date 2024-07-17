<script setup lang="ts">

import SearchTextBoxComponent from "./SearchTextBoxComponent.vue";
import {ImageItem} from "../types/ImageItem.ts"
import {
  emitter,
  keyword,
  trainHash,
  initFinish,
  showSearchImages,
  saveNewPage,
  saveImageToDB,
  readSearchesDB,
  getDataInDBByKey,
  saveProjectInfoToDB,
  saveDataToConceptToDB,
  loadFirstDataOrNullFromDB,
} from "../main.ts";
import {onMounted, reactive, ref} from "vue";
import {Waterfall} from "vue-waterfall-plugin-next";
import {WaterOptions} from "../types/WaterOptions.ts";
import {ImageDB} from "../types/ImageDB.ts";
import {ProjectDB} from "../types/ProjectDB.ts";
import {PageImageDB} from "../types/PageImageDB.ts";
import {PageDataDB} from "../types/PageDataDB.ts";
import {SearchDB} from "../types/SearchDB.ts";
import {useRoute} from "vue-router";
import {TrainImage} from "../types/TrainImage.ts";
import {sleep} from "../utils.ts";

const searchComponent = ref<typeof SearchTextBoxComponent | null>(null);
const waterfall = ref<typeof Waterfall | null>(null);
const currentSelectUrl = ref("");
const options = ref<WaterOptions>(new WaterOptions());
const currentPage = ref<number>(1);
const pages = ref<number[]>([1, 2, 3]);
const route = useRoute();

onMounted(async () => {
  const pageParam = route.query.page;
  currentPage.value = pageParam ? parseInt(pageParam as string) : 1;
  await readPage(currentPage.value);
});

// 放到左侧的训练栏里
async function putInTrain(item: ImageItem) {
  if (Reflect.has(showSearchImages.value, item.src)) {
    Reflect.deleteProperty(showSearchImages.value, item.src);
    const trainImg = new TrainImage(item.name, item.src, currentPage.value, item.index, keyword.value);
    trainHash[trainImg.url] = trainImg;
    await saveDataToConceptToDB('train_images', trainImg);
  }
  if (waterfall.value) {
    waterfall.value.renderer();
  }
}

// 接收到新图片到处理函数
async function addImages(imageText: string) {
  const jsonData = JSON.parse(imageText);
  if ("document_type" in jsonData) {
    // 保存项目信息
    await saveProjectInfoToDB(new ProjectDB(jsonData.document_id, jsonData.CreateAt, jsonData.UpdateAt, jsonData.author, jsonData.bim,
        jsonData.categories, jsonData.document_type, jsonData.location, jsonData.meta_description, jsonData.offices,
        jsonData.photographers, jsonData.tags, jsonData.title, jsonData.url, jsonData.year));
  } else {
    // 保存图片信息
    await saveImageToDB(new ImageDB(jsonData.url, jsonData.name, jsonData.document_id));
    showSearchImages.value[jsonData.url] = new ImageItem(
        [sessionStorage.getItem('keyword') as string],
        jsonData.name,
        jsonData.document_id,
        jsonData.url,
        Object.keys(showSearchImages.value).length);
    if (jsonData['is_last']) {
      const pageData: PageDataDB[] = [];
      const lastPageData = new PageDataDB(1);
      for (const key in showSearchImages.value) {
        const imageItem = showSearchImages.value[key];
        lastPageData.images.push(new PageImageDB(imageItem.src));
      }
      pageData.push(lastPageData);
      await saveNewPage(pageData, jsonData['page'], jsonData['project']);
    }
  }
}

async function readPage(pageNumber: number) {
  while (!initFinish.value) {
    await sleep(100);
  }
  if (pageNumber != 1 && pages.value.length >= 3) {
    if (pageNumber == pages.value[0] || pageNumber == pages.value[pages.value.length - 1]) {
      pages.value = [pageNumber - 1, pageNumber, pageNumber + 1];
    }
  }
  showSearchImages.value = reactive({});
  const temp = sessionStorage.getItem("keyword");
  let data: PageImageDB[] = [];
  let keyword = '';
  currentPage.value = pageNumber;
  if (temp) {
    keyword = temp;
    data = await readSearchesDB(temp, pageNumber, addImages);
  } else {
    const searchDB = await loadFirstDataOrNullFromDB<SearchDB>('spiders', 'searches');
    if (searchDB) {
      keyword = searchDB.keyword;
      sessionStorage.setItem('keyword', keyword);
      emitter.emit('keywordChangedEvent', keyword);
      data = await readSearchesDB(keyword, pageNumber, addImages);
    }
  }
  for (const item of data) {
    const imageData = await getDataInDBByKey<ImageDB>('spiders', 'images', 'urlIndex', item.url_hash);
    if (imageData) {
      if (!trainHash[imageData.url])
        showSearchImages.value[imageData.url] = new ImageItem([keyword], imageData.title,
            imageData.document_id, imageData.url, Object.keys(showSearchImages.value).length);
    } else {
      console.error(item + "图片不存在");
    }
  }
  window.scrollTo(0, 0);
}

function seeBig(item: ImageItem, index: number) {
  sessionStorage.setItem('useless', index.toString());
  return item.src.replace('medium_jpg', 'large_jpg');
}

function mouseover(item: ImageItem) {
  item.show = true
  currentSelectUrl.value = item.src
}

function mouseleave(item: ImageItem) {
  item.show = false
}
</script>

<template>
  <SearchTextBoxComponent ref="searchComponent" :on-receive-img="addImages"/>
  <div style="min-height: 100%; width:100%">
    <Waterfall
        ref="waterfall"
        :list="Object.values(showSearchImages)"
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
      <template #item="{ item, url,index }">
        <div v-show="!item.isInTrain" @mouseover="mouseover(item)" @mouseleave="mouseleave(item)"
             class="bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all
            duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group">
          <div class="card">
            <div class="position-absolute top-0 left-0 d-flex justify-content-center align-items-center
                 w-100 h-100 text-white fs-5 bg-body-secondary opacity-75"
                 :class="{'cardButtonShow':item.show,'cardButtonHide':!item.show}">
              <button type="button" class="btn btn-secondary m-1" @click="putInTrain(item)">
                放入训练
              </button>
              <a type="button" v-show="false" class="btn btn-secondary m-1" :href="seeBig(item,index)" target="_blank">
                查看大图
              </a>
            </div>
            <img :src=url :alt="item.name" class="card-img-top">
          </div>
        </div>
      </template>
    </Waterfall>
    <nav v-show="Object.keys(showSearchImages).length>0" aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <button class="page-link" @click="readPage(1)">首页</button>
        </li>
        <li class="page-item" v-for="page in pages">
          <button class="page-link" :class="{active:currentPage==page}" @click="readPage(page)">{{ page }}</button>
        </li>
        <li class="page-item">
          <button class="page-link" @click="readPage(currentPage+1)">下一页</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
</style>
<script setup lang="ts">

import {ref} from "vue";
import {
  addOrUpdateSearchToDB,
  continueSearchArchDaily, emitter,
  getDataInDBByKey,
  loadSingleDataFromDB,
  searchArchDaily
} from "../main.ts";
import {SearchDB} from "../types/SearchDB.ts";
import {ImageDetailJson} from "../types/ImageDetailJson.ts";
import {ImageDB} from "../types/ImageDB.ts";

// 定义一个接口用于 props
interface Props {
  onReceiveImg: (arg: string) => void;  // 假设参数类型是 any，根据实际情况修改
}

const props = defineProps<Props>();
const keyword = ref("")

emitter.on('keywordChangedEvent', (key: string): void => {
  keyword.value = key;
});

async function search() {
  sessionStorage.setItem('keyword', keyword.value);
  const searchDB = await loadSingleDataFromDB<SearchDB>('spiders', 'searches', 'keyword', keyword.value);
  if (searchDB) {
    const imageData = searchDB.pages_data[0].images;
    for (let i = 0; i < imageData.length; i++) {
      const image = imageData[i];
      const imageDB = await getDataInDBByKey<ImageDB>('spiders', 'images', 'urlIndex', image.url_hash);
      if (imageDB) {
        const imageJson = new ImageDetailJson(imageDB.title, imageDB.url, imageDB.document_id, searchDB.page_count, searchDB.project_count, i == imageData.length - 1);
        props.onReceiveImg(JSON.stringify(imageJson));
      }
    }
  } else {
    await addOrUpdateSearchToDB(keyword.value);
    searchArchDaily(keyword.value, props.onReceiveImg);
  }
}

function showMore() {
  if (keyword.value === '') {
    keyword.value = sessionStorage.getItem('keyword') as string;
  }
  continueSearchArchDaily(keyword.value, props.onReceiveImg)
}
</script>

<template>
  <div class="container-fluid mt-2 mb-2 row p-0 m-0">
    <div class="col-10 p-0">
      <input type="text" class="form-control" placeholder="关键字" v-model="keyword" @keydown.enter="search">
    </div>
    <div class="col-2 p-0">
      <button type="button" class="btn btn-primary w-100" @click="search">搜索</button>
    </div>
  </div>
</template>

<style scoped>

</style>
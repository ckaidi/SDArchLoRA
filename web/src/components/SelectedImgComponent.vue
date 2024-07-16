<script setup lang="ts">
import {
  deleteDBItemByKey, emitter, getConcept,
  getDataInDBByKey,
  keyword,
  saveDataToConceptToDB,
  searchArchDaily, selectTrainImg,
  showSearchImages,
  trainHash
} from "../main.ts";
import {TrainImage} from "../types/TrainImage.ts";
import {ImageItem} from "../types/ImageItem.ts";
import {ImageDB} from "../types/ImageDB.ts";

const props = defineProps({
  deleteAble: {
    type: Boolean,
    default: true,
  }
});

function search() {
  sessionStorage.setItem('keyword', keyword.value)
  saveDataToConceptToDB('searches', {
    name: keyword.value,
    page_count: 1,
    project_count: 0,
    date: Date.now()
  })
  searchArchDaily(keyword.value, (arg: any) => {
    if (arg) {
      console.log(arg);
    }
  });
}

function mouseover(item: TrainImage) {
  if (props.deleteAble)
    item.show = true
}

function mouseleave(item: TrainImage) {
  if (props.deleteAble)
    item.show = false
}

/**
 * 随机生成字符串
 * @param item 需要删除的训练图片
 */
async function deleteTrainImg(item: TrainImage) {
  if (item.url in trainHash) {
    delete trainHash[item.url];
    const imageDB = await getDataInDBByKey<ImageDB>('spiders', 'images', 'urlIndex', item.url);
    if (imageDB) {
      const concept = await getConcept();
      await deleteDBItemByKey(concept, 'train_images', item.name);
      showSearchImages.value[item.url] = new ImageItem([item.keyword],
          item.name, imageDB.document_id, item.url, item.indexInSearch);
    }
  }
}

/**
 * 选中训练图片
 * @param item 训练图片
 */
function imgClick(item: TrainImage) {
  if (!props.deleteAble) {
    if (selectTrainImg.value) {
      selectTrainImg.value.isSelected = false
    }
    item.isSelected = true;
    selectTrainImg.value = item;
    emitter.emit("selectTrainImgChange", item);
  }
}
</script>

<template>
  <div class="container-fluid mt-2 mb-2 row p-0 m-0">
    <div class="p-0">
      <button :disabled="true" type="button" class="btn btn-primary w-100" @click="search">训练图片</button>
      <div v-for="item in trainHash" class="card mt-1 mb-1" @mouseover="mouseover(item)" @mouseleave="mouseleave(item)"
           @click="imgClick(item)"
           :class="{'border-primary':item.isSelected,'border-3':item.isSelected}">
        <div class="position-absolute top-0 left-0 d-flex justify-content-center align-items-center
                 w-100 h-100 text-white fs-5 bg-body-secondary opacity-75"
             :class="{'cardButtonShow':item.show,'cardButtonHide':!item.show}">
          <button type="button" class="btn btn-danger" @click="deleteTrainImg(item)">
            删除
          </button>
        </div>
        <img class="rounded-1" :src=item.url :alt="item.name" style="cursor: pointer">
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
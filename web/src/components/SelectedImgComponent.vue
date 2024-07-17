<script setup lang="ts">
import {
  concept,
  deleteDBItemByKey, emitter,
  getDataInDBByKey, initFinish,
  keyword, resizeTrainImgSpace,
  saveDataToConceptToDB,
  searchArchDaily, selectTrainImg,
  showSearchImages,
  trainHash
} from "../main.ts";
import {TrainImage} from "../types/TrainImage.ts";
import {ImageItem} from "../types/ImageItem.ts";
import {ImageDB} from "../types/ImageDB.ts";
import {onMounted} from "vue";

onMounted(async () => {
  resizeTrainImgSpace();
})

const props = defineProps({
  deleteAble: {
    type: Boolean,
    default: true,
  },
  isHeader: {
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
      await deleteDBItemByKey(concept.value, 'train_images', item.name);
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

function itemShow(item: TrainImage) {
  if (item.large_base64 && item.large_base64 != '') return item.large_base64;
  return item.url;
}
</script>

<template>
  <div class="container-fluid mt-2 mb-2 row p-0 m-0" id="trainImgContainer">
    <div class="p-0">
      <button v-show="isHeader" :disabled="true" type="button" class="btn btn-primary w-100" @click="search">
        训练图片{{ Object.values(trainHash).length }}张
      </button>
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
        <img class="rounded-1" :src=itemShow(item) :alt="item.name" style="cursor: pointer">
      </div>
    </div>
  </div>
</template>

<style scoped>
#trainImgContainer {
  overflow-y: auto; /* 启用垂直滚动 */
  overflow-x: hidden; /* 隐藏水平滚动 */
}
</style>
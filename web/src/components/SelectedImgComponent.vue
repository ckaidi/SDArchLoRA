<script setup lang="ts">
import {keyword, saveDataToConceptToDB, searchArchDaily, trainImages} from "../main.ts";
import {TrainImage} from "../types/TrainImage.ts";

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
  item.show = true
}

function mouseleave(item: TrainImage) {
  item.show = false
}

function deleteTrainImg(item: TrainImage) {
  console.log(item);
}
</script>

<template>
  <div class="container-fluid mt-2 mb-2 row p-0 m-0">
    <div class="p-0">
      <button :disabled="true" type="button" class="btn btn-primary w-100" @click="search">训练图片</button>
      <div v-for="item in trainImages" class="card" @mouseover="mouseover(item)" @mouseleave="mouseleave(item)">
        <div class="position-absolute top-0 left-0 d-flex justify-content-center align-items-center
                 w-100 h-100 text-white fs-5 bg-body-secondary opacity-75"
             :class="{'cardButtonShow':item.show,'cardButtonHide':!item.show}">
          <button type="button" class="btn btn-danger" @click="deleteTrainImg(item)">
            删除
          </button>
        </div>
        <img :src=item.url :alt="item.name" class="img-thumbnail mt-1 mb-1 card-img-top">
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
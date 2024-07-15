<script setup lang="ts">
import {keyword, saveDataToConceptToDB, searchArchDaily, trainImages} from "../main.ts";

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
</script>

<template>
  <div class="container-fluid mt-2 mb-2 row p-0 m-0">
    <div class="p-0">
      <button :disabled="true" type="button" class="btn btn-primary w-100" @click="search">训练图片</button>
      <img v-for="item in trainImages" class="img-thumbnail mt-1 mb-1" :src="item.url" :alt="item.name"/>
    </div>
  </div>
</template>

<style scoped>

</style>
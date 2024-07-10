<script setup lang="ts">

import {ref} from "vue";
import {saveDataToConceptToDB, searchArchDaily} from "../main.ts";

// 定义一个接口用于 props
interface Props {
  onReceiveImg: (arg: any) => void;  // 假设参数类型是 any，根据实际情况修改
}

const props = defineProps<Props>();
const keyword = ref("")

function search() {
  sessionStorage.setItem('keyword', keyword.value)
  saveDataToConceptToDB('searches', {
    name: keyword.value,
    page_count: 1,
    project_count: 0,
    date: Date.now()
  })
  searchArchDaily(keyword.value, props.onReceiveImg)
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
<script setup lang="ts">

import {saveDataToConceptToDB, searchArchDaily} from "../main.ts";
import {ref} from "vue";

const keyword = ref("");

// // 定义一个接口用于 props
// interface Props {
//   onReceiveImg: (arg: object) => void;  // 假设参数类型是 any，根据实际情况修改
// }

// const props = defineProps<Props>();

function search() {
  sessionStorage.setItem('keyword', keyword.value)
  saveDataToConceptToDB('searches', {
    name: keyword.value,
    page_count: 1,
    project_count: 0,
    date: Date.now()
  })
  // searchArchDaily(keyword.value, props.onReceiveImg)
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
      <button :disabled="true" type="button" class="btn btn-primary w-100" @click="search">搜索</button>
    </div>
  </div>
</template>

<style scoped>

</style>
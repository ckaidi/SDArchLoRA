<script setup lang="ts">
import {ref} from "vue";

// 定义接收的 props
defineProps({
  activateTab: String
});
let navigations = ref([
  {
    path: "#",
    name: "搜图"
  },
  {
    path: "#/img2img",
    name: "打标签"
  }
])
</script>

<template>
  <div class="container-fluid text-bg-dark">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li v-for="(item,index) in navigations" :key="index" class="nav-item">
          <a :href="item.path" :class="{'text-secondary':activateTab===item.name,'text-white':activateTab!==item.name}"
             class=" nav-link  fw-bold">{{ item.name }}</a>
        </li>
      </ul>
    </header>
  </div>
</template>

<style scoped>

</style>
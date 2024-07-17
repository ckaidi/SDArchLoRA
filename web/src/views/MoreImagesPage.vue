<script setup lang="ts">

import NavigationComponent from "../components/NavigationComponent.vue";
import SearchComponent from "../components/SearchComponent.vue";
import SelectedImgComponent from "../components/SelectedImgComponent.vue";
import 'vue-waterfall-plugin-next/dist/style.css';
import {ref} from "vue";

const currentTab = ref("搜图");
</script>

<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="container-fluid row p-0 m-0">
    <div class="col-1 m-0">
      <SelectedImgComponent/>
    </div>
    <div class="col-11 m-0">
      <SearchComponent/>
    </div>
  </div>
</template>

<style scoped>

</style>
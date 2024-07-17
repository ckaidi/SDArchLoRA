<script setup lang="ts">
import {ref} from "vue";
import {allConcepts, concept, conceptModalOpenEvent, emitter} from "../main.ts";

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
    path: "#/cropper",
    name: "裁剪"
  },
  {
    path: "#/img2img",
    name: "标签"
  }
])

function getIsSelected(item: string) {
  return concept.value == item;
}

function conceptChange(e: Event) {
  console.log(e);
}

function addConcept() {
  emitter.emit(conceptModalOpenEvent);
}
</script>

<template>
  <div class="container-fluid mt-2">
    <header class="d-flex justify-content-center">
      <!--    <div>-->
      <!--      <select class="bg-dark form-select me-2 text-bg-dark" aria-label="Default select example"-->
      <!--              @change="conceptChange">-->
      <!--        <option :selected="getIsSelected(item.name)" v-for="item in allConcepts" value="{{item.name}}">{{ item.name }}-->
      <!--        </option>-->
      <!--        <option>新增概念</option>-->
      <!--      </select>-->
      <!--    </div>-->
      <div class="d-flex align-items-center align-content-center">
        <ul class="nav nav-pills col-12 col-md-auto justify-content-center mb-md-0">
          <li class="nav-item align-content-center">
            <div class="dropdown">
              <a href="#"
                 class="d-flex align-items-center col-lg-4 mb-2 mb-lg-0 link-body-emphasis text-decoration-none dropdown-toggle"
                 data-bs-toggle="dropdown" aria-expanded="false">
                {{ concept }}
              </a>
              <ul class="dropdown-menu text-small shadow">
                <li v-for="item in allConcepts" class="dropdown-item"
                    @click="conceptChange"
                    :class="{'active':getIsSelected(item.name)}">{{ item.name }}
                </li>
                <li>
                  <hr class="dropdown-divider">
                </li>
                <li class="dropdown-item" @click="addConcept">新增概念</li>
              </ul>
            </div>
          </li>
          <li v-for="(item,index) in navigations" :key="index" class="nav-item">
            <a :href="item.path"
               :class="{'text-primary':activateTab===item.name,'text-secondary':activateTab!==item.name}"
               class=" nav-link  fw-bold">{{ item.name }}</a>
          </li>
          <li>
          </li>
        </ul>
      </div>
    </header>
  </div>
</template>

<style scoped>

</style>
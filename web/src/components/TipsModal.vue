<script setup lang="ts">

import {ref} from "vue";

const modelTitle = ref("提示");
const message = ref("请先上传图片!");
const cancelShow = ref(false);
const okShow = ref(true);

</script>

<template>
  <div class="modal fade" id="tipsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">{{ modelTitle }}</h1>
        </div>
        <div class="modal-body">
          {{ message }}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" v-show="cancelShow"
                  data-bs-dismiss="modal"
                  id="staticBackdropButton">
            取消
          </button>
          <button type="button" class="btn btn-primary" v-show="okShow"
                  data-bs-dismiss="modal"
                  id="staticBackdropButton">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
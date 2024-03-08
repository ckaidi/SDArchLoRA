<template>
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header" id="staticHeader">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">提示</h1>
        </div>
        <div class="modal-body">
          生成中....
        </div>
      </div>
    </div>
  </div>
  <router-view/>
</template>
<script>
import MoreImagesPage from "@/views/MoreImagesPage.vue";
import {OneDay} from "@/main.js";

export default {
  components: {MoreImagesPage},
  created() {
    this.$cookies.config(OneDay, '/')
    this.$cookies.set('page', 1, OneDay, '/')
    this.$cookies.set('projectCount', 0, OneDay, '/')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>

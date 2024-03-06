<template>
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

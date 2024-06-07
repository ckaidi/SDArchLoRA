<template>
  <div class="container-fluid mt-2 mb-2 row">
    <div class="col-10">
      <input type="text" class="form-control" placeholder="关键字" v-model="keyword" @keydown.enter="search">
    </div>
    <div class="col-2">
      <button type="button" class="btn btn-primary w-100" @click="search">搜索</button>
    </div>
  </div>
</template>
<script>
import {continueSearchArchDaily, searchArchDaily} from "@/main.js";

export default {
  methods: {
    search() {
      // clearObjectStore("spiderDB", "spiderData")
      sessionStorage.setItem('keyword', this.keyword)
      searchArchDaily(this.keyword, this.onReceiveImg)
    },
    showMore() {
      continueSearchArchDaily(this.keyword, this.onReceiveImg)
    },
  },
  props: {
    onReceiveImg: null
  },
  created() {
    const keyword = sessionStorage.getItem('keyword');
    if (keyword !== null) {
      this.keyword = keyword;
    }
  },
  data() {
    return {
      allOptions: [
        {
          key: "分类",
          value: ['a', 'b']
        }
      ],
      keyword: ""
    }
  }
}
</script>

<style scoped>

</style>

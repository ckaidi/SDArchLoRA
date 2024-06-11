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
import {continueSearchArchDaily, getConcept, getKeyword, saveDataToConceptToDB, searchArchDaily} from "@/main.js";

export default {
  methods: {
    search() {
      sessionStorage.setItem('keyword', this.keyword)
      saveDataToConceptToDB('searches', this.keyword, {
        name: this.keyword,
        page_count: 1,
        project_count: 0,
        date: Date.now()
      })
      searchArchDaily(this.keyword, this.onReceiveImg)
    },
    showMore() {
      if (this.keyword === '') {
        this.keyword = sessionStorage.getItem('keyword');
      }
      continueSearchArchDaily(this.keyword, this.onReceiveImg)
    },
  },
  props: {
    onReceiveImg: null
  },
  async beforeCreate() {
    // await getConcept();
    const keyword = await getKeyword();
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

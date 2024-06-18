<template>
  <div class="container-fluid mt-2 mb-2 row p-0 m-0">
    <div class="p-0">
      <button disabled="disabled" type="button" class="btn btn-primary w-100" @click="search">搜索</button>
    </div>
  </div>
</template>
<script>
import {continueSearchArchDaily, getKeyword, saveDataToConceptToDB, searchArchDaily} from "@/main.js";

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

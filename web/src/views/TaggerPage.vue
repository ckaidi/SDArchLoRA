<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="row" style="width: 100%">
    <div class="col-2" style="height: 100%;overflow-y:auto">
      <div v-for="(item, index) in allImages">
        <img :src="item.url" alt="" style="width: 100%; height: auto;cursor: pointer" class="m-1 rounded img-thumbnail"
             :class="{'border-3':isActive(index,item.url), 'border-primary-subtle':isActive(index,item.url),
              shadow:isActive(index,item.url),'bg-body-tertiary':isActive(index,item.url)}"
             @click="smallSelected(item)">
        <div v-show="index === allImages.length - 1" style="height: 80px"/>
      </div>
    </div>
    <div class="col-4">
      <div class="py-3">
        <label class="align-content-start fw-bolder row m-1 justify-content-start">当前Tag</label>
        <div class="gap-2"
             style="white-space: normal;display: inline-flex;overflow-wrap: break-word;word-break: break-word;flex-wrap: wrap">
          <span v-for="tag in selectImg.tag" :key="tag" class="badge d-flex p-2 align-items-center rounded-pill border "
                style="cursor: pointer"
                :class="tag.color">
            <span class="px-1">{{ calculateTag(tag.tag) }}</span>
            <span class="vr mx-2"></span>
            <a @click="deleteSelectTag(tag)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   class="bi bi-x-circle-fill" :class="tag.svgColor" viewBox="0 0 16 16">
                <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
              </svg>
            </a>
          </span>
        </div>
      </div>
    </div>
    <div class=" col-6">
      <div class="py-3">
        <label class="fw-bolder row m-1 justify-content-start">搜索关键字</label>
        <div class="gap-2"
             style="white-space: normal;display: inline-flex;overflow-wrap: break-word;word-break: break-word;flex-wrap: wrap">
          <span v-for="tag in selectImg.projectTag" :key="tag"
                class="badge d-flex p-2 align-items-center rounded-pill border "
                style="cursor: pointer" @click="selectTag(tag,true)"
                :class="tag.color">
            <span class="px-1">{{ calculateTag(tag.tag) }}</span>
          </span>
        </div>
      </div>
      <div class="py-3">
        <label class="fw-bolder row m-1 justify-content-start">Archidaily中的Tag</label>
        <div class="gap-2"
             style="white-space: normal;display: inline-flex;overflow-wrap: break-word;word-break: break-word;flex-wrap: wrap">
          <span v-for="tag in selectImg.projectTag" :key="tag"
                class="badge d-flex p-2 align-items-center rounded-pill border "
                style="cursor: pointer" @click="selectTag(tag,true)"
                :class="tag.color">
            <span class="px-1">{{ calculateTag(tag.tag) }}</span>
          </span>
        </div>
      </div>
      <div class="py-3">
        <label class="fw-bolder row m-1 justify-content-start">自定义Tag</label>
        <div class="gap-2"
             style="white-space: normal;display: inline-flex;overflow-wrap: break-word;word-break: break-word;flex-wrap: wrap">
          <span v-for="tag in allTaggers" :key="tag" class="badge d-flex p-2 align-items-center rounded-pill border "
                style="cursor: pointer" @click="selectTag(tag,true)"
                :class="tag.color">
            <span class="px-1">{{ calculateTag(tag.tag) }}</span>
            <span class="vr mx-2"></span>
            <a @click="selectTag(tag,false)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   class="bi bi-x-circle-fill" :class="tag.svgColor" viewBox="0 0 16 16">
                <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
              </svg>
            </a>
          </span>
        </div>
      </div>
      <div class="align-items-stretch mt-1 d-flex">
        <div class="py-3 col-5">
          <label class="fw-bolder row m-2 justify-content-start">新增Tag</label>
          <div class="d-flex gap-2 justify-content-start">
            <input class="badge d-flex p-2 align-items-center text-primary-emphasis bg-primary-subtle
              border border-primary-subtle rounded-pill" type="text" placeholder="+ NewTag(英文)" v-model="userInput"
                   @keyup.enter="userTagSubmit"/>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import {defineComponent} from "vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import {createClientId, emitter, loadDataFromDB, tipsModalEvent} from "@/main.js";

export default defineComponent({
  components: {NavigationComponent},
  methods: {
    badgeColor() {
      let rand = Math.floor(Math.random() * 7);
      switch (rand) {
        case 0:
          return ["bg-primary-subtle text-primary-emphasis border-primary-subtle", "text-primary"]
        case 1:
          return ["bg-secondary-subtle text-secondary-emphasis border-secondary-subtle", "text-secondary"]
        case 2:
          return ["bg-success-subtle text-success-emphasis border-success-subtle", "text-success"]
        case 3:
          return ["bg-danger-subtle text-danger-emphasis border-danger-subtle", "text-danger"]
        case 4:
          return ["bg-warning-subtle text-warning-emphasis border-warning-subtle", "text-warning"]
        case 5:
          return ["bg-info-subtle text-info-emphasis border-info-subtle", "text-info"]
        case 6:
          return ["bg-dark-subtle text-dark-emphasis border-dark-subtle", "text-dark"]
      }
    },
    isActive(index, path) {
      if (this.selectImg === "") {
        return index === 0
      }
      return path === this.selectImg.url
    },
    smallSelected(item) {
      this.selectImg = item;
    },
    selectTag(tag, flag) {
      if (flag) {
        if (this.selectImg !== '') {
          const foundElement = this.selectImg.tag.find(element => element === tag);
          const foundElement2 = this.allTaggers.find(element => element === tag);
          const foundElement3 = this.selectImg.projectTag.find(element => element === tag);
          if (foundElement === undefined && (foundElement2 !== undefined || foundElement3 !== undefined)) {
            this.selectImg.tag.push(tag)
          }
        }
      } else {
        this.deleteTag(tag);
      }
    },
    deleteSelectTag(tag) {
      if (this.selectImg !== '') {
        this.selectImg.tag = this.selectImg.tag.filter(element => element.tag !== tag.tag);
      }
    },
    deleteTag(tag) {
      if (this.allTaggers !== '') {
        this.allTaggers = this.allTaggers.filter(element => element.tag !== tag.tag);
      }
    },
    createTags(strArray) {
      let result = [];
      for (const strArrayElement of strArray) {
        let colors = this.badgeColor()
        result.push({
          key: "archdaily",
          tag: strArrayElement,
          color: colors[0],
          svgColor: colors[1],
          tagType: "archdaily"
        })
      }
      return result;
    },
    // 根据tag长度计算tag文字
    calculateTag(tag) {
      if (tag.length > 20) {
        return tag.substring(0, 20) + '......';
      }
      return tag;
    },
    userTagSubmit() {

    },
  },
  data() {
    return {
      userInput: '',
      selectImg: '',
      allImages: [],
      allTaggers: [],
      currentTab: "打标签",
    }
  },
  // 检查是否有图片
  beforeCreate() {
    const concept = sessionStorage.getItem('concept')
    if (concept === undefined) {
      emitter.emit(tipsModalEvent, {});
    }
  },
  created() {
    createClientId();
    let arrays = []
    let that = this
    loadDataFromDB('images', arrays, () => {
      let index = 0;
      for (const image of arrays) {
        that.allImages.push({
          index: index,
          url: image.content.base64,
          tag: [],
          searchTag: that.createTags(image.content.keyword),
          projectTag: that.createTags(image.content.tags),
        });
        index++;
      }
      if (that.allImages.length > 0) {
        that.selectImg = that.allImages[0];
      }
    });
  },
})
</script>

<style scoped>
.m-1:last-child {
  margin-bottom: 20px;
}
</style>

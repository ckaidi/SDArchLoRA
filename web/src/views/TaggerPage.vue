<script setup lang="ts">

import NavigationComponent from "../components/NavigationComponent.vue";
import {ref} from "vue";
import {
  appendAlert, createClientId,
  deleteConceptItem,
  downloadMultipleFilesAsZip, loadConceptDataFromDB,
  saveDataToConceptToDB,
  updateConceptItem
} from "../main.ts";
import {Tag} from "../types/Tag.ts";
import {Image} from "../types/Image.ts";

const userInput = ref<string>('');
const selectImg = ref<Image>(new Image());
const allImages = ref<Image[]>([]);
const allTaggers = ref<any[]>([]);
const currentTab = ref<string>("打标签");

beforeCreate();

// beforeCreate
function beforeCreate(): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    allTaggers.value = await loadConceptDataFromDB('user_tags');
    createClientId();
    const arrays = await loadConceptDataFromDB('train_images');
    let index = 0;
    for (const image of arrays) {
      // TODO 推测tags类型
      const tags = JSON.parse(image.tags)
      allImages.value.push(new Image(image.name, index, image.base64, tags, createTags([image.keyword]), createTags(image.projecttags)));
      index++;
    }
    if (allImages.value.length > 0) {
      selectImg.value = allImages.value[0];
      colorTag(selectImg.value);
    }
    resolve(true);
  });
}


function isActive(index: number, path: string) {
  if (selectImg.value.url === "") {
    return index === 0
  }
  return path === selectImg.value.url
}

function colorTag(item: Image) {
  for (const tag of item.tags) {
    for (let i = 0; i < allTaggers.value.length; i++) {
      if (allTaggers.value[i].tag === tag.tag) {
        allTaggers.value[i].color = 'text-bg-primary';
      }
    }
    for (let i = 0; i < selectImg.value.projectTag.length; i++) {
      if (selectImg.value.projectTag[i].tag === tag.tag) {
        selectImg.value.projectTag[i].color = 'text-bg-primary';
      }
    }
    for (let i = 0; i < selectImg.value.searchTag.length; i++) {
      if (selectImg.value.searchTag[i].tag === tag.tag) {
        selectImg.value.searchTag[i].color = 'text-bg-primary';
      }
    }
  }
}

async function smallSelected(item: Image) {
  selectImg.value = item;
  colorTag(item);
}

async function selectTag(tag: any, flag: boolean) {
  tag.color = 'text-bg-primary';
  if (flag) {
    if (selectImg.value.url !== '') {
      const foundElement = selectImg.value.tags.find(element => element === tag);
      const foundElement2 = allTaggers.value.find(element => element === tag);
      const foundElement3 = selectImg.value.projectTag.find(element => element === tag);
      const foundElement4 = selectImg.value.searchTag.find(element => element === tag);
      if (foundElement === undefined && (foundElement2 !== undefined || foundElement3 !== undefined || foundElement4 !== undefined)) {
        selectImg.value.tags.push(tag)
        await updateConceptItem('train_images', selectImg.value.name, 'tags', JSON.stringify(selectImg.value.tags));
        if (foundElement2 !== undefined) {
          foundElement2.used += 1;
          await updateConceptItem('user_tags', foundElement2.tag,
              'used', foundElement2.used);
        }
      }
    }
  } else {
    await deleteTag(tag);
  }
}

async function deleteSelectTag(tag: any) {
  if (selectImg.value.url !== '') {
    selectImg.value.tags = selectImg.value.tags.filter(element => element.tag !== tag.tag);
    await updateConceptItem('train_images', selectImg.value.name, 'tags', JSON.stringify(selectImg.value.tags));
    for (let i = 0; i < allTaggers.value.length; i++) {
      if (allTaggers.value[i].tag === tag.tag) {
        allTaggers.value[i].color = 'text-bg-secondary';
        allTaggers.value[i].used--;
        await updateConceptItem('user_tags', tag.tag, 'used', allTaggers.value[i].used);
        break;
      }
    }
    for (let i = 0; i < selectImg.value.projectTag.length; i++) {
      if (selectImg.value.projectTag[i].tag === tag.tag) {
        selectImg.value.projectTag[i].color = 'text-bg-secondary';
        break;
      }
    }
  }
}

async function deleteTag(tag: any) {
  // TODO推测类型
  for (const images of allImages.value) {
    images.tags = images.tags.filter(element => element.tag !== tag.tag);
  }
  if (allTaggers) {
    allTaggers.value = allTaggers.value.filter(element => element.tag !== tag.tag);
    await deleteConceptItem('user_tags', tag.name)
    await updateConceptItem('train_images', selectImg.value.name, 'tags', JSON.stringify(selectImg.value.tags));
  }
}

function createTags(strArray: Tag[]) {
  let result = [];
  for (const strArrayElement of strArray) {
    // TODO 推测strArrayElement类型
    result.push(new Tag("archdaily", strArrayElement, 'text-bg-secondary', "archdaily"))
  }
  return result;
}


// 根据tag长度计算tag文字
function calculateTag(tag: string) {
  if (tag.length > 20) {
    return tag.substring(0, 20) + '......';
  }
  return tag;
}


function userTagSubmit() {
  if (userInput.value) {
    const foundElement2 = allTaggers.value.find(element => element.tag === userInput.value);
    if (foundElement2 === undefined || foundElement2 === null) {
      let d = {
        name: userInput.value,
        key: "archdaily",
        tag: userInput.value,
        color: 'text-bg-secondary',
        tagType: "archdaily",
        used: 0,
      }
      allTaggers.value.push(d);
      saveDataToConceptToDB('user_tags', d);
      userInput.value = "";
    } else {
      appendAlert("tag已存在", "warning")
    }
  } else {
    appendAlert("tag不能为空", "danger")
  }
}


// 导出训练数据
function exportTrainData() {
  downloadMultipleFilesAsZip(allImages.value);
}
</script>

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
          <span v-for="tag in selectImg.tags" :key="tag"
                class="badge d-flex p-2 align-items-center rounded-pill border "
                style="cursor: pointer"
                :class="tag.color">
            <span class="px-1">{{ calculateTag(tag.tag) }}</span>
            <span class="vr mx-2"></span>
            <a @click="deleteSelectTag(tag)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   class="bi bi-x-circle-fill" :class="tag.tag" viewBox="0 0 16 16">
                <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
              </svg>
            </a>
          </span>
        </div>
      </div>
    </div>
    <div class=" col-6">
      <div class="py-3"
           v-show="selectImg.searchTag!==undefined && selectImg.searchTag.length>0">
        <label class="fw-bolder row m-1 justify-content-start">搜索关键字</label>
        <div class="gap-2"
             style="white-space: normal;display: inline-flex;overflow-wrap: break-word;word-break: break-word;flex-wrap: wrap">
          <span v-for="tag in selectImg.searchTag" :key="tag.key"
                class="badge d-flex p-2 align-items-center rounded-pill border "
                style="cursor: pointer" @click="selectTag(tag,true)"
                :class="tag.color">
            <span class="px-1">{{ calculateTag(tag.tag) }}</span>
          </span>
        </div>
      </div>
      <div class="py-3"
           v-show="selectImg.projectTag!==undefined && selectImg.projectTag.length>0">
        <label class="fw-bolder row m-1 justify-content-start">Archidaily中的Tag</label>
        <div class="gap-2"
             style="white-space: normal;display: inline-flex;overflow-wrap: break-word;word-break: break-word;flex-wrap: wrap">
          <span v-for="tag in selectImg.projectTag" :key="tag.key"
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
                   class="bi bi-x-circle-fill" :class="tag.tag" viewBox="0 0 16 16">
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
  <div class="btn btn-primary m-4" @click="exportTrainData">
    导出训练集
  </div>
</template>

<style scoped>
.m-1:last-child {
  margin-bottom: 20px;
}
</style>
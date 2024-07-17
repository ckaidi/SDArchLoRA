<script setup lang="ts">

import NavigationComponent from "../components/NavigationComponent.vue";
import {onMounted, ref} from "vue";
import {
  appendAlert,
  selectTrainImg,
  getDataInDBByKey,
  emitter,
  saveSelectTrainImgToDB,
  saveDataToConceptToDB,
  userTags,
  downloadMultipleFilesAsZip, trainHash, deleteDBItemByKey, saveTrainImgToDB, concept,
} from "../main.ts";
import SelectedImgComponent from "../components/SelectedImgComponent.vue";
import {ImageDB} from "../types/ImageDB.ts";
import {ProjectDB} from "../types/ProjectDB.ts";
import {TrainImage} from "../types/TrainImage.ts";
import {Tag} from "../types/Tag.ts";

const userInput = ref<string>('');
const currentTab = ref<string>("标签");
const tagRecommend = ref<string[]>([]);

onMounted(async () => {
  if (selectTrainImg.value) {
    await getRecommendTag(selectTrainImg.value);
  }
  emitter.on("selectTrainImgChange", async (trainImg: TrainImage) => {
    await getRecommendTag(trainImg);
  });
});

async function getRecommendTag(item: TrainImage) {
  const imageDB = await getDataInDBByKey<ImageDB>('spiders', 'images', 'urlIndex', item.url);
  if (imageDB) {
    const project = await getDataInDBByKey<ProjectDB>('spiders', 'projects', 'document_idIndex', imageDB.document_id);
    if (project) {
      tagRecommend.value = [];
      project.tags.split(',').forEach(t => {
        if (t && t != '')
          tagRecommend.value.push(t);
      });
      project.categories.split(',').forEach(t => {
        if (t && t != '')
          tagRecommend.value.push(t);
      });
      project.offices.split(',').forEach(t => {
        if (t && t != '')
          tagRecommend.value.push(t);
      });
      project.author.split(',').forEach(t => {
        if (t && t != '')
          tagRecommend.value.push(t);
      });
      project.photographers.split(',').forEach(t => {
        if (t && t != '')
          tagRecommend.value.push(t);
      });
      if (project.bim)
        tagRecommend.value.push('bim');
      if (project.location)
        tagRecommend.value.push(project.location);
      if (project.meta_description)
        tagRecommend.value.push(project.meta_description);
    }
  }
}

async function selectTag(tag: string, flag: boolean) {
  if (flag) {
    if (selectTrainImg.value) {
      if (selectTrainImg.value.url !== '') {
        const foundElement = selectTrainImg.value.tags.find(element => element === tag);
        const foundElement2 = tagRecommend.value.find(element => element === tag);
        const foundElement3 = userTags.value.find(element => element.name === tag);
        if (foundElement == undefined && (foundElement2 != undefined || foundElement3 != undefined)) {
          selectTrainImg.value.tags.push(tag)
          await saveSelectTrainImgToDB();
        } else if (foundElement) {
          selectTrainImg.value.tags = selectTrainImg.value.tags.filter(element => element !== tag);
          await saveSelectTrainImgToDB();
        }
      }
    }
  } else {
    await deleteTag(tag);
  }
}

async function deleteTag(tag: string) {
  for (const images of Object.values(trainHash.value)) {
    const lb = images.tags.length;
    images.tags = images.tags.filter(element => element !== tag);
    const la = images.tags.length;
    if (la != lb) {
      await saveTrainImgToDB(images);
    }
  }
  if (userTags) {
    userTags.value = userTags.value.filter(element => element.name !== tag);
    await deleteDBItemByKey(concept.value, 'train_images', tag);
  }
}

function isTagSelect(tag: string): boolean {
  if (selectTrainImg.value) {
    for (const img of selectTrainImg.value.tags) {
      if (img == tag) return true;
    }
  }
  return false;
}


// 根据tag长度计算tag文字
function calculateTag(tag: string) {
  if (tag.length > 20) {
    return tag.substring(0, 20) + '......';
  }
  return tag;
}


async function userTagSubmit() {
  if (userInput.value) {
    const foundElement2 = userTags.value.find(element => element.name === userInput.value);
    if (foundElement2 == undefined) {
      const ttt = new Tag(userInput.value);
      userTags.value.push(ttt);
      await saveDataToConceptToDB('user_tags', ttt);
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
  downloadMultipleFilesAsZip();
}

</script>

<template>
  <NavigationComponent id="navigationComponent" :activate-tab="currentTab"/>
  <div class="row" style="width: 100%">
    <div class="col-4" style="height: 100%;overflow-y:auto">
      <SelectedImgComponent :delete-able="false" :is-header="false"/>
    </div>
    <div class=" col-8">
      <div class="py-3">
        <label class="fw-bolder row m-1 justify-content-start">Tag推荐</label>
        <div class="gap-2"
             style="white-space: normal;display: inline-flex;overflow-wrap: break-word;word-break: break-word;flex-wrap: wrap">
          <span v-for="tag in tagRecommend" :key="tag"
                class="badge d-flex p-2 align-items-center rounded-pill border"
                :class="{'bg-secondary':!isTagSelect(tag),'bg-primary':isTagSelect(tag)}"
                style="cursor: pointer" @click="selectTag(tag,true)">
            <span class="px-1">{{ calculateTag(tag) }}</span>
          </span>
        </div>
      </div>
      <div class="py-3">
        <label class="fw-bolder row m-1 justify-content-start">自定义Tag</label>
        <div class="gap-2"
             style="white-space: normal;display: inline-flex;overflow-wrap: break-word;word-break: break-word;flex-wrap: wrap">
          <span v-for="tag in userTags" :key="tag.name"
                class="badge d-flex p-2 align-items-center rounded-pill border "
                :class="{'bg-secondary':!isTagSelect(tag.name),'bg-primary':isTagSelect(tag.name)}"
                style="cursor: pointer" @click="selectTag(tag.name,true)">
            <span class="px-1">{{ calculateTag(tag.name) }}</span>
            <span class="vr mx-2"></span>
            <a @click="selectTag(tag.name,false)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   class="bi bi-x-circle-fill" viewBox="0 0 16 16">
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
      <div class="btn btn-primary m-1" @click="exportTrainData">
        导出训练集
      </div>
    </div>
  </div>
</template>

<style scoped>
.m-1:last-child {
  margin-bottom: 20px;
}
</style>
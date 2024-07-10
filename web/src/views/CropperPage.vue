<script setup lang="ts">

import {CropperOptions} from "../types/CropperOptions.ts";
import {ref} from "vue";
import {loadSingleDataFromDB, saveTaggerImageToDB, spiderServer} from "../main.ts";
import {useRoute} from "vue-router";
import {ImgData} from "../types/ImgData.ts";
import {ProjectData} from "../types/ProjectData.ts";
import {Previews} from "../types/Previews.ts";
import VueCropper from "vue-cropper";
// import {VueCropper} from "vue-cropper/next";
// import VueCropper from "../types/vue-cropper"

const route = useRoute();
const option = ref<CropperOptions>(new CropperOptions());
const lists = ref<any[]>([]);
const cropper = ref<typeof VueCropper>(VueCropper);
const previews = ref<Previews>(new Previews());

// create方法
let temp = route.query.imgUrl;
if (temp) {
  temp = temp.toString().replace('medium_jpg', 'large_jpg');
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://' + spiderServer + '/img2base64', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    if (xhr.status === 200) {
      const result = JSON.parse(xhr.responseText)
      const cutElement = document.getElementById('cut');
      if (cutElement) {
        cutElement.style.width = result['Width'] + 'px';
        cutElement.style.height = result['Height'] + 'px';
      }
      option.value.img = result['Base64'];
      lists.value.push({
        img: result['Base64'],
      });
    } else {
      alert('网络错误，请重试')
    }
  };
  xhr.send(temp);
}

function nextStep() {
  document.createElement('a');
  // 输出
  cropper.value.getCropData(async (data: any) => {
    let document_id = route.query.document_id;
    const project = (await loadSingleDataFromDB('projects', 'name', document_id)) as ProjectData;
    const imgName = route.query.imgName?.toString()
    if (imgName) {
      let imgData = new ImgData(imgName, data);
      if (project) {
        if (project.content.author !== "") {
          imgData.projecttags.push(project.content.author);
        }
        if (project.content.categories !== "") {
          let tags = project.content.categories.split(',')
          for (const tagsKey of tags) {
            if (tagsKey !== "")
              imgData.projecttags.push(tagsKey);
          }
        }
        if (project.content.location !== "") {
          imgData.projecttags.push(project.content.location);
        }
        if (project.content.meta_description !== "") {
          imgData.projecttags.push(project.content.meta_description);
        }
        if (project.content.offices !== "") {
          let tags = project.content.offices.split(',')
          for (const tagsKey of tags) {
            if (tagsKey !== "")
              imgData.projecttags.push(tagsKey);
          }
        }
        if (project.content.tags !== "") {
          let tags = project.content.tags.split(',')
          for (const tagsKey of tags) {
            if (tagsKey !== "")
              imgData.projecttags.push(tagsKey);
          }
        }
      }
      const kw = sessionStorage.getItem('keyword');
      if (kw) {
        imgData.keyword = kw;
        await saveTaggerImageToDB(imgData)
        window.location.href = '#/img2img'
      }
    }
  })
}

async function skip() {
  document.createElement('a');
  // 输出
  let document_id = route.query.document_id;
  const project = await loadSingleDataFromDB('projects', 'name', document_id) as ProjectData;
  const imgName = route.query.imgName?.toString();
  if (imgName) {
    let imgData = new ImgData(imgName, option.value.img);
    imgData.projecttags = []
    imgData.tags = '[]'
    if (project.content.author !== "") {
      imgData.projecttags.push(project.content.author);
    }
    if (project.content.categories !== "") {
      let tags = project.content.categories.split(',')
      for (const tagsKey of tags) {
        if (tagsKey !== "")
          imgData.projecttags.push(tagsKey);
      }
    }
    if (project.content.location !== "") {
      imgData.projecttags.push(project.content.location);
    }
    if (project.content.meta_description !== "") {
      imgData.projecttags.push(project.content.meta_description);
    }
    if (project.content.offices !== "") {
      let tags = project.content.offices.split(',')
      for (const tagsKey of tags) {
        if (tagsKey !== "")
          imgData.projecttags.push(tagsKey);
      }
    }
    if (project.content.tags !== "") {
      let tags = project.content.tags.split(',')
      for (const tagsKey of tags) {
        if (tagsKey !== "")
          imgData.projecttags.push(tagsKey);
      }
    }
    const kw = sessionStorage.getItem('keyword');
    if (kw) {
      imgData.keyword = kw;
      await saveTaggerImageToDB(imgData)
      window.location.href = '#/img2img'
    }
  }
}
</script>

<template>
  <div class="cut" id="cut" style="width: 1600px;height: 1200px">
    <vue-cropper ref="cropper" v-bind="option"></vue-cropper>
  </div>
  <div class="test-button">
    <div style="display:block; width: 100%;">
      <label class="c-item">
        <span>固定长宽比</span>
        <input type="checkbox" v-model="option.fixed">
      </label>
      <div class="container input-group mb-3">
        <span class="input-group-text" id="basic-addon1">宽度:</span>
        <input type="number" class="form-control" placeholder="宽带" aria-label="Username"
               aria-describedby="basic-addon1" v-model="option.fixedNumber[0]">
        <span class="input-group-text" id="basic-addon1">高度:</span>
        <input type="number" class="form-control" placeholder="高度" aria-label="Username"
               aria-describedby="basic-addon1" v-model="option.fixedNumber[1]">
      </div>
      <button @click="nextStep" class="btn btn-primary m-2">下一步</button>
      <button @click="skip" class="btn btn-primary m-2">稍后自行裁剪</button>
    </div>
  </div>
  <div class="show-preview"
       :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
    <div :style="previews.div">
      <img :src="previews.url" :style="previews.img" alt="">
    </div>
  </div>
</template>
<style scoped>
* {
  margin: 0;
  padding: 0;
}

.cut {
  width: 500px;
  height: 500px;
  margin: 30px auto;
}

.c-item {
  max-width: 800px;
  margin: 20px auto 10px;
}

.test-button {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
}

.show-info h2 {
  line-height: 50px;
}

.c-item {
  display: block;
  user-select: none;
}

@keyframes slide {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -100% 0;
  }
}
</style>
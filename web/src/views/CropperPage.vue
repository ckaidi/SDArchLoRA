<script setup lang="ts">
import {CropperOptions} from "../types/CropperOptions.ts";
import {onMounted, ref} from "vue";
import {
  emitter, getDataInDBByKey,
  loadSingleDataFromDB, saveDataToConceptToDB,
  saveDataToGlobalDB,
  saveTaggerImageToDB,
  selectTrainImg,
  spiderServer
} from "../main.ts";
import {useRoute} from "vue-router";
import {ImgData} from "../types/ImgData.ts";
import {ProjectDB} from "../types/ProjectDB.ts";
import NavigationComponent from "../components/NavigationComponent.vue";
import SelectedImgComponent from "../components/SelectedImgComponent.vue";
import 'vue-cropper/dist/index.css'
import {VueCropper} from "vue-cropper";
import {TrainImage} from "../types/TrainImage.ts";
import {ImageDB} from "../types/ImageDB.ts";

const route = useRoute();
const currentTab = ref("裁剪");
const cropper = ref<typeof VueCropper>(VueCropper);
const option = ref<CropperOptions>(new CropperOptions());

onMounted(() => {
  emitter.on("selectTrainImgChange", (trainImg: TrainImage) => {
    if (trainImg.large_base64 != '') {
      option.value.img = trainImg.large_base64;
      const cutElement = document.getElementById('cut');
      const cropperSpace = document.getElementById('cropper-space');
      if (cutElement && cropperSpace) {
        // cutElement.style.width = result['Width'] + 'px';
        // cutElement.style.height = result['Height'] + 'px';
        cutElement.style.width = cropperSpace.clientWidth.toString() + 'px';
        cutElement.style.height = cropperSpace.clientHeight.toString() + 'px';

      }
    } else {
      setCropperImg(trainImg.url);
    }
  })
});

function setCropperImg(imgUrl: string) {
  const temp = imgUrl.replace('medium_jpg', 'large_jpg');
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://' + spiderServer + '/img2base64', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = async function () {
    if (xhr.status === 200) {
      const result = JSON.parse(xhr.responseText);
      const cutElement = document.getElementById('cut');
      const cropperSpace = document.getElementById('cropper-space');
      if (cutElement && cropperSpace) {
        // cutElement.style.width = result['Width'] + 'px';
        // cutElement.style.height = result['Height'] + 'px';
        cutElement.style.width = cropperSpace.style.width;
        cutElement.style.height = cropperSpace.style.height;
      }
      option.value.img = result['Base64'];
      if (selectTrainImg.value) {
        selectTrainImg.value.large_width = parseInt(result['Width']);
        selectTrainImg.value.large_height = parseInt(result['Height']);
        selectTrainImg.value.large_base64 = result['Base64'];
        const cl = new TrainImage(selectTrainImg.value.name, selectTrainImg.value.url,
            selectTrainImg.value.page, selectTrainImg.value.indexInSearch, selectTrainImg.value.keyword);
        cl.large_base64 = selectTrainImg.value.large_base64;
        cl.large_width = selectTrainImg.value.large_width;
        cl.large_height = selectTrainImg.value.large_height;
        await saveDataToConceptToDB('train_images', cl);
        const imgDB = await getDataInDBByKey<ImageDB>('spiders', 'images', 'urlIndex', selectTrainImg.value.url);
        if (imgDB) {
          imgDB.large_base64 = selectTrainImg.value.large_base64;
          imgDB.large_width = selectTrainImg.value.large_width;
          imgDB.large_height = selectTrainImg.value.large_height;
          await saveDataToGlobalDB('images', imgDB);
        }
      }
    } else {
      alert('网络错误，请重试')
    }
  };
  xhr.send(temp);
}

function nextStep() {
  document.createElement('a');
  // 输出
  cropper.value.VueCropper.getCropData(async (data: any) => {
    let document_id = route.query.document_id;
    const project = (await loadSingleDataFromDB<ProjectDB>('projects', 'name', 'document_id', document_id));
    if (!project) {
      window.location.href = '#/img2img'
      return;
    }
    const imgName = route.query.imgName?.toString()
    if (imgName) {
      let imgData = new ImgData(imgName, data);
      if (project) {
        if (project.author !== "") {
          imgData.projecttags.push(project.author);
        }
        if (project.categories !== "") {
          let tags = project.categories.split(',')
          for (const tagsKey of tags) {
            if (tagsKey !== "")
              imgData.projecttags.push(tagsKey);
          }
        }
        if (project.location !== "") {
          imgData.projecttags.push(project.location);
        }
        if (project.meta_description !== "") {
          imgData.projecttags.push(project.meta_description);
        }
        if (project.offices !== "") {
          let tags = project.offices.split(',')
          for (const tagsKey of tags) {
            if (tagsKey !== "")
              imgData.projecttags.push(tagsKey);
          }
        }
        if (project.tags !== "") {
          let tags = project.tags.split(',')
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
  const project = await loadSingleDataFromDB<ProjectDB>('projects', 'name', 'document_id', document_id);
  if (!project) {
    window.location.href = '#/img2img'
    return;
  }
  const imgName = route.query.imgName?.toString();
  if (imgName) {
    let imgData = new ImgData(imgName, option.value.img);
    imgData.projecttags = []
    imgData.tags = '[]'
    if (project.author !== "") {
      imgData.projecttags.push(project.author);
    }
    if (project.categories !== "") {
      let tags = project.categories.split(',')
      for (const tagsKey of tags) {
        if (tagsKey !== "")
          imgData.projecttags.push(tagsKey);
      }
    }
    if (project.location !== "") {
      imgData.projecttags.push(project.location);
    }
    if (project.meta_description !== "") {
      imgData.projecttags.push(project.meta_description);
    }
    if (project.offices !== "") {
      let tags = project.offices.split(',')
      for (const tagsKey of tags) {
        if (tagsKey !== "")
          imgData.projecttags.push(tagsKey);
      }
    }
    if (project.tags !== "") {
      let tags = project.tags.split(',')
      for (const tagsKey of tags) {
        if (tagsKey !== "")
          imgData.projecttags.push(tagsKey);
      }
    }
    const kw = sessionStorage.getItem('keyword');
    if (kw) {
      imgData.keyword = kw;
      await saveTaggerImageToDB(imgData)
    }
    window.location.href = '#/img2img'
  }
}
</script>

<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="container-fluid row p-0 m-0" style="height: 80%;position: fixed">
    <div class="col-1 p-1 m-0">
      <SelectedImgComponent :delete-able="false"/>
    </div>
    <div class="col-10 p-1 m-0 d-flex" id="cropper-space" v-show="selectTrainImg!=null">
      <div class="cut" id="cut">
        <VueCropper ref="cropper" v-bind="option"></VueCropper>
      </div>
    </div>
    <div class="col-1 p-1 m-0">
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
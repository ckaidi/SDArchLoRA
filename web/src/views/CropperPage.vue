<script setup lang="ts">
import {CropperOptions} from "../types/CropperOptions.ts";
import {onBeforeUnmount, onMounted, ref} from "vue";
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
const cropperSpace = ref<HTMLElement | null>(null);
const option = ref<CropperOptions>(new CropperOptions());
const rationHistory = [
  {w: 1, h: 1},
  {w: 3, h: 2},
  {w: 4, h: 3},
  {w: 16, h: 9},
  {w: 2, h: 3},
  {w: 5, h: 4},
  {w: 16, h: 10},
  {w: 21, h: 9},
  {w: 1, h: 2},
];

onMounted(() => {
  emitter.on("selectTrainImgChange", (trainImg: TrainImage) => {
    if (trainImg.large_base64 != '') {
      option.value.img = trainImg.large_base64;
    } else {
      setCropperImg(trainImg.url);
    }
  });
  if (cropperSpace.value) {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const {width, height} = entry.contentRect;
        console.log(`Element size changed to: ${width}px wide by ${height}px tall.`);
        resizeCropperSpace();
      }
    });

    observer.observe(cropperSpace.value);

    // 清理函数
    onBeforeUnmount(() => {
      if (cropperSpace.value) {
        observer.unobserve(cropperSpace.value);
      }
    });
  }
});

function resizeCropperSpace() {
  const cutElement = document.getElementById('cut');
  if (cutElement) {
    const navigation = document.getElementById('navigationComponent');
    if (navigation) {
      const nh = navigation.offsetHeight;
      cutElement.style.height = (window.innerHeight - nh - 20) + 'px';
    }
  }
}

function setCropperImg(imgUrl: string) {
  const temp = imgUrl.replace('medium_jpg', 'large_jpg');
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://' + spiderServer + '/img2base64', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = async function () {
    if (xhr.status === 200) {
      const result = JSON.parse(xhr.responseText);
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
  <NavigationComponent id="navigationComponent" :activate-tab="currentTab"/>
  <div class="container-fluid row p-0 m-0" style="height: 80%;position: fixed">
    <div class="col-1 p-1 m-0">
      <SelectedImgComponent :delete-able="false"/>
    </div>
    <div class="col-10 m-0 d-flex" id="cropper-space" ref="cropperSpace" v-show="selectTrainImg!=null">
      <div class="cut w-100" id="cut" style="margin: 10px">
        <VueCropper ref="cropper" v-bind="option"></VueCropper>
      </div>
      <div class="col-1">
        <div class="test-button">
          <div style="display:block; width: 100%;">
            <label class="c-item">
              <span>固定长宽比</span>
              <input type="checkbox" v-model="option.fixed">
            </label>
            <div class="container input-group mb-1">
              <span class="input-group-text" id="basic-addon1">w:</span>
              <input type="number" class="form-control" placeholder="宽带" aria-label="Username"
                     aria-describedby="basic-addon1" v-model="option.fixedNumber[0]">
            </div>
            <div class="container input-group mb-3">
              <span class="input-group-text" id="basic-addon1">h:</span>
              <input type="number" class="form-control" placeholder="高度" aria-label="Username"
                     aria-describedby="basic-addon1" v-model="option.fixedNumber[1]">
            </div>
            <div class="py-3">
              <label class="align-content-start fw-bolder row m-1 justify-content-start">高宽比：</label>
              <select class="form-select" aria-label="Default select example">
                <option v-for="tag in rationHistory" :value="tag">{{ tag.h }}:{{ tag.w }}</option>
              </select>
            </div>
            <button @click="nextStep" class="btn btn-primary m-2">下一步</button>
            <button v-show="false" @click="skip" class="btn btn-primary m-2">稍后自行裁剪</button>
          </div>
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
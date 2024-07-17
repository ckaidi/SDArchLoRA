<script setup lang="ts">
import {CropperOptions} from "../types/CropperOptions.ts";
import {onMounted, ref} from "vue";
import {
  emitter,
  getDataInDBByKey,
  resizeCutterSpace,
  saveDataToGlobalDB,
  saveSelectTrainImgToDB,
  selectTrainImg,
  spiderServer, trainHash
} from "../main.ts";
import NavigationComponent from "../components/NavigationComponent.vue";
import SelectedImgComponent from "../components/SelectedImgComponent.vue";
import 'vue-cropper/dist/index.css'
import {VueCropper} from "vue-cropper";
import {TrainImage} from "../types/TrainImage.ts";
import {ImageDB} from "../types/ImageDB.ts";

interface IRatio {
  w: number;
  h: number;
}

const currentTab = ref("裁剪");
const cropper = ref<typeof VueCropper>(VueCropper);
const cropperSpace = ref<HTMLElement | null>(null);
const option = ref<CropperOptions>(new CropperOptions());
const rationHistory: IRatio[] = [
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
const selectRatio = ref<IRatio>({w: 1, h: 1});

onMounted(() => {
  emitter.on("selectTrainImgChange", async (trainImg: TrainImage) => {
    if (trainImg.large_base64 != '') {
      const imgDB = await getDataInDBByKey<ImageDB>('spiders', 'images', 'urlIndex', trainImg.url);
      if (imgDB) {
        option.value.img = imgDB.large_base64;
        return
      }
    }
    // 要阻塞
    setCropperImg(trainImg);
  });
  resizeCutterSpace();
  if (selectTrainImg.value) {
    option.value.img = selectTrainImg.value.large_base64;
  }
});

function setCropperImg(imgUrl: TrainImage) {
  const temp = imgUrl.url.replace('medium_jpg', 'large_jpg');
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://' + spiderServer + '/img2base64', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = async function () {
    if (xhr.status === 200) {
      const result = JSON.parse(xhr.responseText);
      option.value.img = result['Base64'];
      if (imgUrl) {
        imgUrl.large_base64 = result['Base64'];
        await saveSelectTrainImgToDB();
        const imgDB = await getDataInDBByKey<ImageDB>('spiders', 'images', 'urlIndex', imgUrl.url);
        if (imgDB) {
          imgDB.large_base64 = imgUrl.large_base64;
          await saveDataToGlobalDB('images', imgDB);
        }
      }
    } else {
      alert('网络错误，请重试')
    }
  };
  xhr.send(temp);
}

function saveCropperResult() {
  document.createElement('a');
  // 输出
  cropper.value.getCropData(async (base64String: string) => {
    if (selectTrainImg.value) {
      selectTrainImg.value.large_base64 = base64String;
      trainHash[selectTrainImg.value.url] = selectTrainImg.value;
      await saveSelectTrainImgToDB();
    }
  })
}

function rationSelectChange(e: Event) {
  if (e.type == 'change' && selectRatio.value) {
    option.value.fixedNumber[1] = selectRatio.value.h;
    option.value.fixedNumber[0] = selectRatio.value.w;
  }
}
</script>

<template>
  <NavigationComponent id="navigationComponent" :activate-tab="currentTab"/>
  <div class="container-fluid row p-0 m-0" style="height: 80%;position: fixed">
    <div class="col-1 p-1 m-0">
      <SelectedImgComponent :delete-able="false" :is-header="false"/>
    </div>
    <div class="row col-11 m-0 d-flex" id="cropper-space" ref="cropperSpace" v-show="selectTrainImg!=null">
      <div class="cut w-100" id="cut" style="margin: 10px">
        <VueCropper ref="cropper" v-bind="option"></VueCropper>
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-2 form-check align-middle " style="margin-left: 20px;margin-top: 5px">
            <input class="form-check-input" type="checkbox" v-model="option.fixed" id="flexCheckDefault">
            <label class="form-check-label align-middle" for="flexCheckDefault">
              固定长宽比
            </label>
          </div>
          <div class="col-2">
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">w:</span>
              <input type="text" class="form-control" placeholder="Username" aria-label="Username"
                     aria-describedby="basic-addon1" v-model="option.fixedNumber[0]">
            </div>
          </div>
          <div class="col-2">
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">h:</span>
              <input type="text" class="form-control" placeholder="Username" aria-label="Username"
                     aria-describedby="basic-addon1" v-model="option.fixedNumber[1]">
            </div>
          </div>
          <div class="col-2">
            <select class="form-select" aria-label="Default select example" v-model="selectRatio"
                    @change="rationSelectChange">
              <option v-for="tag in rationHistory" :value="tag">{{ tag.w }}:{{ tag.h }}</option>
            </select>
          </div>
          <button @click="saveCropperResult" class="col-2 btn btn-primary h-100">保存</button>
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

.show-info h2 {
  line-height: 50px;
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
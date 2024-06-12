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
<script>
import 'vue-waterfall-plugin-next/dist/style.css';
import 'vue-cropper/dist/vue-cropper.umd.js';
import {loadSingleDataFromDB, saveTaggerImageToDB, spiderServer} from "@/main.js";

export default {
  data() {
    return {
      cropperW: 1500,
      cropperH: 1000,
      model: false,
      modelSrc: '',
      crap: false,
      previews: {},
      lists: [],
      option: {
        info: true,
        img: "",
        size: 1,
        full: true,
        outputType: "jpeg",
        canMove: true,
        fixedBox: false,
        original: true,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 1024,
        autoCropHeight: 1024,
        centerBox: false,
        high: false,
        cropData: {},
        enlarge: 1,
        mode: 'cover',
        maxImgSize: 40000,
        limitMinSize: [50, 50],
        fixed: true,
        fixedNumber: [1, 1],
        fillCover: '',
        canScale: false,
      },
      show: true
    }
  },
  created() {
    let temp = this.$route.query.imgUrl;
    if (temp !== undefined) {
      temp = temp.replace('medium_jpg', 'large_jpg');
      const xhr = new XMLHttpRequest();
      const that = this
      xhr.open('POST', 'http://' + spiderServer + '/img2base64', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText)
          document.getElementById('cut').style.width = result['Width'] + 'px';
          document.getElementById('cut').style.height = result['Height'] + 'px';
          that.option.img = result['Base64'];
          that.lists.push({
            img: result['Base64'],
          });
        } else {
          alert('网络错误，请重试')
        }
      };
      xhr.send(temp);
    }
  },
  methods: {
    nextStep() {
      document.createElement('a');
      // 输出
      this.$refs.cropper.getCropData(async (data) => {
        let document_id = this.$route.query.document_id;
        const project = await loadSingleDataFromDB('projects', 'name', document_id);
        let imgData = {name: this.$route.query.imgName, base64: data}
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
        imgData.keyword = sessionStorage.getItem('keyword');
        await saveTaggerImageToDB(this.$route.query.imgName, imgData)
        window.location = '#/img2img'
      })
    },
    async skip() {
      document.createElement('a');
      // 输出
      let document_id = this.$route.query.document_id;
      const project = await loadSingleDataFromDB('projects', 'name', document_id);
      let imgData = {name: this.$route.query.imgName, base64: this.option.img}
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
      imgData.keyword = sessionStorage.getItem('keyword');
      await saveTaggerImageToDB(this.$route.query.imgName, imgData)
      window.location = '#/img2img'
    },
    // 实时预览函数
    down(type) {
      const aLink = document.createElement('a');
      aLink.download = this.$route.query.imgName
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          aLink.href = window.URL.createObjectURL(data)
          aLink.click()
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          aLink.href = data
          aLink.click()
        })
      }
    }
  },
}
</script>

<style>
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
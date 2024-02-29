<template>
  <SettingComponent/>
  <div class="login">
    <div class="rounded mb-3" v-waterfall="el=>updateLayout(el)" v-for="(item, index) in files" :key="index">
      <div class="col rounded">
        <div class="rounded shadow-sm">
          <img :src=item.src alt="" class="card-img rounded">
          <button type="button" class="m-3 btn btn-sm btn-outline-secondary" @click="download(item.src)">下载</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import 'vue-waterfall-plugin-next/dist/style.css'
import SettingComponent from "@/components/SettingComponent.vue";

export default {
  components: {SettingComponent},
  created() {
    // console.log('created')
    // // POST 请求的 URL
    // let url = process.env.VUE_APP_SERVER + "/getDisplayResult";
    // // 创建一个新的 XMLHttpRequest 对象
    // let xhr = new XMLHttpRequest();
    // // 设置请求方法和 URL
    // xhr.open("POST", url, true);
    // // 设置请求头
    // xhr.setRequestHeader("Content-Type", "application/json");
    // const instanceFiles = this.files;
    // // 监听请求完成事件
    // xhr.onload = function () {
    //   if (xhr.status === 200) {
    //     // 请求成功，处理响应
    //     let response = JSON.parse(xhr.responseText);
    //     console.log("加载图片响应数据:", response);
    //     let images = response["images"]
    //     if (images == null) {
    //       return
    //     }
    //     for (let i = images.length - 1; i >= 0; i--) {
    //       let picData = {
    //         src: 'temp/' + images[i]['src'],
    //         width: images[i]['width'],
    //         height: images[i]['height']
    //       }
    //       instanceFiles.push(picData);
    //     }
    //   } else {
    //     // 请求失败
    //     console.log("请求失败:", xhr.status);
    //   }
    // };
    // // 发送 POST 请求
    // xhr.send(JSON.stringify({
    //   "user_info":
    //       {
    //         "username": Cookie.get('username')
    //       },
    //   "length": -1
    // }));
  },
  data() {
    return {
      tabName: "SDRS",
      files: [{
        src: "零食柜.jpeg",
      }, {
        src: "mac.jpg"
      }, {
        src: "1寸.jpg"
      }, {
        src: "1寸.jpg"
      }, {
        src: "1寸.jpg"
      }, {
        src: "1寸.jpg"
      }, {
        src: "1寸.jpg"
      }, {
        src: "1寸.jpg"
      }, {
        src: "1寸.jpg"
      }, {
        src: "1寸.jpg"
      },],
      columnHeights: [0, 0, 0]
    }
  },
  directives: {
    waterfall: {
      inserted(el, binding) {
        const callback = binding.value || {}
      },
    }
  },
  methods: {
    updateLayout(item) {
      const column = this.getMinColumnHeights(this.columnHeights)
      const itemTop = this.columnHeights[column]
      const itemLeft = column * item.clientWidth
      item.style.transform = `translate(${itemLeft}px,${itemTop}px)`
      this.columnHeights[column] += item.offsetHeight
    },
    getMinColumnHeights(arr) {
      let min = Math.min(...arr)
      return arr.indexOf(min) !== -1 ? arr.indexOf(min) : 0
    },
    download(filename) {
      // TODO 发到AI生成平台
    },
    deletePic(filename) {
      filename = filename.replace('temp/', '')
      let jsonData = {
        "filename": filename
      }
      let url = process.env.VUE_APP_SERVER + "/deletePic";
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      // 设置请求头
      xhr.setRequestHeader("Content-Type", "application/json");
      // 监听请求完成事件
      xhr.onload = function () {
        if (xhr.status === 200) {
          let response = JSON.parse(xhr.responseText);
          if (response['status'] != null && response['status']) {
            location.reload()
          }
          console.log("删除图片返回数据:", response);
        } else {
          // 请求失败
          console.log("请求失败:", xhr.status);
        }
      };
      // 发送 POST 请求
      xhr.send(JSON.stringify(jsonData));
    }
  }
}
</script>
<style scoped>
.login {
  margin: 10px;
  column-count: 4;
  column-gap: 10px;
}

.item {
  margin-bottom: 10px;
}

.item img {
  width: 100%;
  height: 100%;
}
</style>
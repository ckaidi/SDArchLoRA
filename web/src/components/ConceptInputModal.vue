<template>
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">请输入lora概念</h1>
        </div>
        <div class="modal-body">
          <form>
            <input type="text" class="form-control" id="message-text" placeholder="lora概念">
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary"
                  @click="addConcept()" data-bs-dismiss="modal"
                  id="staticBackdropButton">
            {{ buttonContent }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {addConcept, emitter} from "@/main";

export default {
  data() {
    return {
      isProgress: true,
      buttonContent: "确定",
      message: "请先上传图片!",
      isRendering: false,
      progressValue: 0,
    }
  },
  mounted() {
    emitter.on('modalSwitch', () => {
      const myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {
        backdrop: 'static', // 设置背景为静态
        keyboard: false // 禁止键盘关闭模态框
      });
      myModal.show(); // 显示模态框
    })
    emitter.on('positionChange', param => {
      if (param['before'] === 0) {
        this.label = "正在渲染您的图片,请稍等！"
        this.isRendering = true
        this.setRenderProgress()
        document.getElementById('staticBackdropButton').style.display = "none"
      } else {
        this.label = "排队中,前面还有" + param['before'] + "人"
        document.getElementById('progress-bar').style.width = param['current'] / param['position'] * 100 + "%"
      }
    })
  },
  methods: {
    addConcept,
    setRenderProgress() {
      if (this.progressValue < 100) {
        this.progressValue += 10
      }
      document.getElementById('progress-bar').style.width = this.progressValue + "%"
      setTimeout(this.setRenderProgress, 2000)
    },
    clickCancel() {
      if (this.isProgress) {
        let jsonData = {
          "username": Cookie.get("username"),
          "uniqueId": taskId,
          "modelPrompt": {
            "model": modelName
          }
        }
        let url = process.env.VUE_APP_SERVER + "/cancel";
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        // 设置请求头
        xhr.setRequestHeader("Content-Type", "application/json");
        // 监听请求完成事件
        xhr.onload = function () {
          if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            console.log('取消请求返回数据', response)
            if (!response['status']) {
              console.log("取消排队失败")
            }
          }
        };
        // 发送 POST 请求
        xhr.send(JSON.stringify(jsonData));
      }
    }
  }
}
</script>
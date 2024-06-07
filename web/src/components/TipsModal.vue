<template>
  <div class="modal fade" id="tipsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">{{ modelTitle }}</h1>
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

import {addConcept, emitter, tipsModalEvent} from "@/main";

export default {
  data() {
    return {
      modelTitle: '提示',
      isProgress: true,
      buttonContent: "确定",
      message: "请先上传图片!",
      isRendering: false,
      progressValue: 0,
    }
  },
  mounted() {
    emitter.on(tipsModalEvent, (data) => {
      const myModal = new bootstrap.Modal(document.getElementById('tipsModal'));
      myModal.show(); // 显示模态框
    })
  },
  methods: {
    addConcept
  }
}
</script>
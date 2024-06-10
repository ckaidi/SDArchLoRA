<template>
  <div class="modal fade" id="selectStaticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">请输入lora概念</h1>
        </div>
        <div class="modal-body">
          <form>
            <select class="form-select" id="message-text" v-model="concept">
              <option selected>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger"
                  data-bs-dismiss="modal"
                  id="staticBackdropButton">取消
          </button>
          <button type="button" class="btn btn-primary"
                  @click="addConcept(concept)" data-bs-dismiss="modal"
                  id="staticBackdropButton">确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {addConcept, conceptModalOpenEvent, emitter, selectModalOpenEvent} from "@/main";

export default {
  data() {
    return {
      concept: "",
      isProgress: true,
      message: "请先上传图片!",
      isRendering: false,
      progressValue: 0,
    }
  },
  mounted() {
    emitter.on(selectModalOpenEvent, () => {
      const myModal = new bootstrap.Modal(document.getElementById('selectStaticBackdrop'), {
        backdrop: 'static', // 设置背景为静态
        keyboard: false // 禁止键盘关闭模态框
      });
      myModal.show(); // 显示模态框
    })
  },
  methods: {
    addConcept,
  }
}
</script>
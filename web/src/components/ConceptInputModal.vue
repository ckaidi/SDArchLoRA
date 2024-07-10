<script setup lang="ts">
import {ref, nextTick} from 'vue';
import {addConcept, conceptModalOpenEvent, emitter} from "../main.ts";
import {Modal} from "bootstrap";

const conceptInput = ref<HTMLInputElement | null>(null);
const concept = ref('');

emitter.on(conceptModalOpenEvent, () => {
  const modelElement = document.getElementById('staticBackdrop');
  if (modelElement) {
    const myModal = new Modal(modelElement, {
      backdrop: 'static', // 设置背景为静态
      keyboard: false // 禁止键盘关闭模态框
    });
    // 设置焦点到输入框
    nextTick(() => {
      if (conceptInput.value)
        conceptInput.value.focus();
    });
    myModal.show(); // 显示模态框
  }
});


function keyboardEnter() {
  const buttonElement = document.getElementById('staticBackdropButton');
  if (buttonElement)
    buttonElement.click();
}

</script>

<template>
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">请输入lora概念</h1>
        </div>
        <div class="modal-body">
          <form @submit.prevent="keyboardEnter">
            <input type="text" class="form-control" id="message-text" placeholder="lora概念" ref="conceptInput"
                   v-model="concept">
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary"
                  @click="addConcept(concept)" data-bs-dismiss="modal"
                  id="staticBackdropButton">确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
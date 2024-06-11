<template>
  <div id="liveAlertPlaceholder" class="container-fluid align-self-center align-content-center"
       style="position: absolute;z-index: 9999;">
  </div>
  <ConceptInputModal/>
  <ConceptSelectModal/>
  <router-view/>
  <div class="position-fixed bottom-0 end-0 mb-3 me-3 rounded-circle bg-primary">
    <button class="btn btn-primary py-2 d-flex align-items-center justify-content-center bi-r-circle "
            data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="增加概念"
            data-bs-custom-class="custom-tooltip"
            id="bd-theme" @click="addConcept"
            type="button"
            style="width: 42px; height: 42px; border-radius: 50%;">
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <!-- Increased stroke-width for a thicker plus sign -->
        <path stroke="white" stroke-width="4" fill="none"
              d="M0 12 H24 M12 0 V24"/>
      </svg>
    </button>
  </div>

</template>
<script>
import MoreImagesPage from "@/views/MoreImagesPage.vue";
import ConceptInputModal from "@/components/ConceptInputModal.vue";
import ConceptSelectModal from "@/components/ConceptSelectModal.vue";
import {conceptModalOpenEvent, emitter, OneDay} from "@/main.js";

export default {
  components: {MoreImagesPage, ConceptInputModal, ConceptSelectModal},
  methods: {
    addConcept() {
      emitter.emit(conceptModalOpenEvent, 'progress');
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>

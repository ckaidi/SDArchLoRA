<script setup lang="ts">
import ConceptInputModal from "./components/ConceptInputModal.vue";
import ConceptSelectModal from "./components/ConceptSelectModal.vue";
import TipsModal from "./components/TipsModal.vue";

</script>

<template>
  <div id="liveAlertPlaceholder" class="container-fluid align-self-center align-content-center"
       style="position: absolute; z-index: 9999;">
  </div>
  <ConceptInputModal v-show="false"/>
  <ConceptSelectModal v-show="false"/>
  <TipsModal v-show="false"/>
  <router-view></router-view>
</template>

<style scoped>
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

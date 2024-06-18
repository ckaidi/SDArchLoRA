<template>
  <NavigationComponent :activate-tab="currentTab"/>
  <div class="container-fluid row p-0 m-0">
    <div class="col-1 p-0 m-0">
      <SelectedImgComponent/>
    </div>
    <div class="col-11 p-0 m-0">
      <SearchComponent/>
    </div>
  </div>
</template>
<script>
import 'vue-waterfall-plugin-next/dist/style.css'
import SelectedImgComponent from "@/components/SelectedImgComponent.vue";
import SearchComponent from "@/components/SearchComponent.vue";
import NavigationComponent from "@/components/NavigationComponent.vue";


export default {
  components: {SelectedImgComponent, NavigationComponent, SearchComponent},
  data() {
    return {
      currentTab: "搜图",
    }
  },
}
</script>

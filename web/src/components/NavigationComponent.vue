<template>
  <div class="container-fluid text-bg-dark">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li v-for="(item,index) in navigations" :key="index" class="nav-item">
          <a :href="item.path" :class="{'text-secondary':activateTab===item.name,'text-white':activateTab!==item.name}"
             class=" nav-link  fw-bold">{{ item.name }}</a>
        </li>
      </ul>
    </header>
  </div>
</template>
<script>

export default {
  data() {
    return {
      navigations: [
        {
          path: "#",
          name: "搜图"
        },
        {
          path: "#/txt2img",
          name: "文生图"
        },
        {
          path: "#/img2img",
          name: "图生图"
        }
      ]
    }
  },
  props: {
    activateTab: "",
  }
}
</script>

<style scoped>

</style>

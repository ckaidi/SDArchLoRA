<template>
  <div class="col-8 row">
    <div class="col">
      <input type="text" class="form-control" placeholder="关键字">
    </div>
    <div class="col">
      <select v-for="(items,index) in allOptions" :key="items.key"
              class="rounded form-select bg-light border-light-subtle" :id="items.key"
              aria-label="Default select example">
        <option selected>{{ items.key }}</option>
        <option v-for="item in items.value" :key="item">{{ item }}</option>
      </select>
    </div>
  </div>
  <!--  <div class="container-fluid row w-100 row-cols-6">-->
  <!--    <div class="input-group input-group-lg mb-3 col-1">-->
  <!--      <span class="input-group-text" id="inputGroup-sizing-lg">关键字</span>-->
  <!--      <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">-->

  <!--      <div class="input-group input-group-lg mb-3 col-1">-->
  <!--        <span class="input-group-text" id="inputGroup-sizing-lg">分类</span>-->
  <!--        <input type="text" class="form-control" aria-label="Sizing example input"-->
  <!--               aria-describedby="inputGroup-sizing-lg">-->
  <!--      </div>-->
  <!--      <div class="input-group input-group-lg mb-3 col-1">-->
  <!--        <span class="input-group-text" id="inputGroup-sizing-lg">国家</span>-->
  <!--        <input type="text" class="form-control" aria-label="Sizing example input"-->
  <!--               aria-describedby="inputGroup-sizing-lg">-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
</template>
<script>
export default {
  data() {
    return {
      allOptions: [
        {
          key: "分类",
          value: ['a', 'b']
        }
      ],
      keyword: ""
    }
  }
}
</script>

<style scoped>

</style>
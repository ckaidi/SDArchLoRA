<template>
  <div class="container-fluid m-2 row">
    <div class="col-10">
      <input type="text" class="form-control" placeholder="关键字">
    </div>
    <div class="col-2">
      <button type="button" class="btn btn-primary w-100">搜索</button>
    </div>
  </div>
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
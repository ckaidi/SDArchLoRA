<template>
  <div class="row">
    <img
        :src=selectImg
        class="img-thumbnail col-6 p-1" alt="...">
    <img
        src="https://images.adsttc.com/media/images/65ca/1c2e/b451/ce7a/fd95/6b42/slideshow/oyane-san-shikoku-mura-entrance-kousou_7.jpg?1707744319"
        class="img-thumbnail col-6 p-1" alt="...">
  </div>
  <div class="m-2 row">
    <label for="exampleFormControlTextarea1" class="text-start start-0 form-label fw-bold">正向提示词</label>
    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
  </div>
  <div class="m-2 row">
    <label for="exampleFormControlTextarea1" class="text-start start-0 form-label fw-bold">反向提示词</label>
    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
  </div>
  <div class="m-2 row">
    <label for="exampleFormControlTextarea1" class="text-start start-0 form-label fw-bold">ControlNet</label>
    <div class="row">
      <img
          :src=selectImg
          class="img-thumbnail col-6 p-1" alt="...">
      <div class="container-fluid col-6 row">
        <div class="input-group">
          <div class="col-2 m-1">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
              <label class="form-check-label" for="flexCheckDefault">
                启用
              </label>
            </div>
          </div>
          <div class="col-4 m-1">
            <select class="form-select">
              <option selected>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
          <div class="col-4 m-1">
            <select class="form-select">
              <option selected>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <label for="customRange2" class="form-label">权重</label>
          <input type="range" class="form-range" min="0" max="100" id="customRange2">
        </div>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
        <div class="col-12"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['selectImg']
}
</script>
<style scoped>

</style>

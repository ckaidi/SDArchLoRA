<template>
  <div class="container-fluid m-2 row">
    <div class="col-10">
      <input type="text" class="form-control" placeholder="关键字" v-model="keyword" @keydown.enter="search">
    </div>
    <div class="col-2">
      <button type="button" class="btn btn-primary w-100" @click="search">搜索</button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    search() {
      const that = this
      // 创建一个 WebSocket 对象，连接到本地的 8080 端口
      if (this.keyword !== "") {
        const ws = new WebSocket("ws://127.0.0.1:8081/archdaily?" + "keyword=" + this.keyword + "&page=1");

        // 注册 onopen 事件的回调函数
        ws.onopen = function () {
          // 连接成功，打印信息
          console.log("WebSocket 连接成功");
        };

        // 注册 onmessage 事件的回调函数
        ws.onmessage = function (event) {
          // 接收到服务器发送的数据，打印信息
          console.log("WebSocket 接收到数据：", event.data);
          that.$emit('transfer', event.data)
        };

        // 注册 onclose 事件的回调函数
        ws.onclose = function (event) {
          // 连接关闭，打印信息
          console.log("WebSocket 连接关闭：", event.code, event.reason);
        };

        // 注册 onerror 事件的回调函数
        ws.onerror = function (event) {
          // 连接错误，打印信息
          console.log("WebSocket 连接错误：", event);
        };
      }
    }
  },
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

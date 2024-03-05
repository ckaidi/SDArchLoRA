import './assets/main.css'
import 'jquery'
import 'popper.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import VueCookies from 'vue-cookies'

import {createApp} from 'vue'
import App from './App.vue'
import router from "@/router/index.js";

export const OneDay = 60 * 60 * 24

const instance = createApp(App)
instance.use(router)
instance.use(VueCookies)
instance.mount('#app')

function searchCore(ws, onReceiveImg) {
    // 注册 onopen 事件的回调函数
    ws.onopen = function () {
        // 连接成功，打印信息
        console.log("WebSocket 连接成功");
    };

    // 注册 onmessage 事件的回调函数
    ws.onmessage = function (event) {
        // 接收到服务器发送的数据，打印信息
        console.log("WebSocket 接收到数据：", event.data);
        onReceiveImg(event.data)
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

export function searchArchDaily(keyword, onReceiveImg) {
    const that = instance
    // 创建一个 WebSocket 对象，连接到本地的 8080 端口
    if (keyword !== "") {
        const ws = new WebSocket("ws://127.0.0.1:8081/archdaily?keyword=" + keyword +
            "&page=1&projectCount=0");

        searchCore(ws, onReceiveImg);
    }
}

export function continueSearchArchDaily(keyword, onReceiveImg) {
    const that = instance
    // 创建一个 WebSocket 对象，连接到本地的 8080 端口
    if (keyword !== "") {
        const count = that.$cookies.get('projectCount')
        const page = that.$cookies.get('page')
        const ws = new WebSocket("ws://127.0.0.1:8081/archdaily?" + "keyword=" + keyword +
            "&page=" + page + "&projectCount=" + count);

        searchCore(ws, onReceiveImg);
    }
}

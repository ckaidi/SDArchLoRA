import './assets/main.css'
import 'jquery'
import 'popper.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import {Modal} from 'bootstrap'; // 导入 JavaScript
import modal from "bootstrap/js/src/modal.js";
import * as bootstrap from 'bootstrap';
import VueCookies from 'vue-cookies'

import {createApp} from 'vue'
import App from './App.vue'
import router from "@/router/index.js";

window.bootstrap = bootstrap;
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
        const ws = new WebSocket("ws://gz.derper.chenkaidi.top:8081/archdaily?keyword=" + keyword +
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
        const ws = new WebSocket("ws://gz.derper.chenkaidi.top:8081/archdaily?" + "keyword=" + keyword +
            "&page=" + page + "&projectCount=" + count);

        searchCore(ws, onReceiveImg);
    }
}

export function hideGeneratingModal() {
    const header = document.getElementById('staticHeader')
    // 创建一个新的按钮元素
    const button = document.createElement('button');

    // 设置按钮的属性和类
    button.setAttribute('type', 'button');
    button.classList.add('btn-close');
    button.setAttribute('data-bs-dismiss', 'modal');
    button.setAttribute('aria-label', 'Close');

    // 将按钮添加到 DOM 中，例如添加到 body 中
    header.appendChild(button);

    // 模拟按钮点击
    button.click();

    // 从 DOM 中移除按钮
    header.removeChild(button);
}
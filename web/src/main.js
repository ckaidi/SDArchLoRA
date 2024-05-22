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
import {sdServer} from "@/sdApi.js";

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
        const ws = new WebSocket("ws://127.0.0.1:8081/archdaily?keyword=" + keyword + "&page=1&projectCount=0");
        searchCore(ws, onReceiveImg);
    }
}

export function continueSearchArchDaily(keyword, onReceiveImg) {
    const that = instance
    // 创建一个 WebSocket 对象，连接到本地的 8080 端口
    if (keyword !== "") {
        const count = that.$cookies.get('projectCount')
        const page = that.$cookies.get('page')
        const ws = new WebSocket("ws://127.0.0。1:8081/archdaily?" + "keyword=" + keyword + "&page=" + page + "&projectCount=" + count);

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

export function saveDataToDB(dataName, tableName, key, buffer) {
    // 打开一个名为imageDB的数据库，版本号为1
    const request = indexedDB.open(dataName, 1);

    // 如果数据库需要升级（即首次打开或版本增加），则会调用此事件处理函数
    request.onupgradeneeded = (e) => {
        // 获取数据库实例
        const db = e.target.result;
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db.objectStoreNames.contains(tableName)) {
            // 创建一个新的对象存储空间images，并设置keyPath为name，用于唯一标识每条记录
            db.createObjectStore(tableName, {keyPath: "name"});
        }
    };

    // 当成功打开数据库时，执行此回调函数
    request.onsuccess = (e) => {
        // 获取数据库实例
        const db = e.target.result;
        // 创建一个读写事务，目标对象存储空间为images
        const transaction = db.transaction([tableName], "readwrite");
        // 获取对象存储空间
        const store = transaction.objectStore(tableName);
        // 向对象存储空间中添加或更新一条记录
        const imgRequest = store.put({name: key, content: buffer});

        imgRequest.onsuccess = () => {
            console.log("Image saved successfully!");
        };

        imgRequest.onerror = (e) => {
            console.error("Error saving the image:", e.target.error);
        };
    };

    request.onerror = (e) => {
        console.error("Error opening database:", e.target.error);
    };
}

export function saveImageToDB(name, buffer) {
    saveDataToDB("imagesDB", "images", name, buffer)
}

// 保存爬取的图片
export function saveSpiderDataToDB(name, buffer) {
    saveDataToDB("spiderDB", "spiderData", name, buffer)
}

// 从数据库中加载数据
export function loadDataFromDB(dataName, tableName, array, finishCallback) {
    const request = indexedDB.open(dataName, 1);
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(tableName)) {
            db.createObjectStore(tableName, {keyPath: 'name'});
        }
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([tableName], 'readonly');
        const store = transaction.objectStore(tableName);
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                array.push(cursor.value.content);
                cursor.continue();
            } else finishCallback()
        };

        cursorRequest.onerror = (e) => console.error('Error fetching data from IndexedDB:', e.target.error);
    };

    request.onerror = (event) => console.error('Database error:', event.target.error);
}

export function loadImageFromDB(result, array) {
    loadDataFromDB("imagesDB", "images", array, () => {
        // 当游标没有更多数据时，更新Vue的data属性
        saveImageToDB(array.length, result['Base64'])
        let base64Img = result['Base64']
        array.push(base64Img)
    });
}

// 加载爬虫数据
export function loadSpiderDataFromDB(array) {
    let arrayList=[]
    loadDataFromDB("spiderDB", "spiderData", arrayList, () => {
        array = []
        for (const arrayListKey in arrayList) {
            array.push({
                src: {
                    original: ""
                },
                show: false
            })
        }
    });
}

// 清空指定的对象存储空间
export function clearObjectStore(dbName, storeName) {
    // const dbName = "imagesDB";  // 数据库名称
    // const storeName = "images"; // 对象存储空间名称

    // 打开数据库
    const request = indexedDB.open(dbName);

    request.onsuccess = (e) => {
        const db = e.target.result;
        // 创建读写事务
        const transaction = db.transaction([storeName], "readwrite");
        // 获取对象存储空间
        const store = transaction.objectStore(storeName);
        // 清空对象存储空间
        const clearRequest = store.clear();

        clearRequest.onsuccess = () => {
            console.log(`${storeName} store cleared successfully`);
        };

        clearRequest.onerror = (e) => {
            console.error(`Error clearing object store: ${e.target.errorCode}`);
        };
    };

    request.onerror = (e) => {
        console.error(`Error opening database: ${e.target.errorCode}`);
    };
}

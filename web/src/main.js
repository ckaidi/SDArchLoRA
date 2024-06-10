import 'jquery'
import 'popper.js'
import mitt from 'mitt'
import './assets/main.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import {v4} from 'uuid'
import App from './App.vue'
import {createApp} from 'vue'
import VueCookies from 'vue-cookies'
import VueCropper from 'vue-cropper';
import router from "@/router/index.js";
import * as bootstrap from 'bootstrap';

window.bootstrap = bootstrap;
export const OneDay = 60 * 60 * 24
export const tipsModalEvent = 'tipsModalEvent'
export const conceptModalOpenEvent = 'conceptModalOpenEvent'
export const conceptModalCloseEvent = 'conceptModalCloseEvent'
export const selectModalOpenEvent = 'selectModalOpenEvent'

export const emitter = mitt()
const instance = createApp(App)
instance.use(router)
instance.use(VueCookies)
instance.use(VueCropper)
instance.mount('#app')// 实现一个 once 功能

function once(event, handler) {
    const wrappedHandler = (eventData) => {
        emitter.off(event, wrappedHandler);  // 监听一次后移除
        handler(eventData);
    };
    emitter.on(event, wrappedHandler);
}

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

// 向后端发送请求，爬取archidaily
export function searchArchDaily(keyword, onReceiveImg) {
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

// 检查所给的的数据是否在数据库中
export function checkDataInDB(dbName, storeName, indexValue) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        // 如果数据库需要升级（即首次打开或版本增加），则会调用此事件处理函数
        request.onupgradeneeded = (e) => {
            // 获取数据库实例
            const db = e.target.result;
            // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
            if (!db.objectStoreNames.contains(storeName)) {
                // 创建一个新的对象存储空间images，并设置keyPath为name，用于唯一标识每条记录
                db.createObjectStore(storeName, {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
            }
            resolve('')
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index('nameIndex');  // 假设索引名为'nameIndex'
            const getRequest = index.get(indexValue);

            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    console.log('Item exists:', getRequest.result);
                    resolve(true);  // 存在时返回true
                } else {
                    console.log('Item does not exist.');
                    resolve(false);  // 不存在时返回false
                }
            };

            getRequest.onerror = (event) => {
                console.error('Error in fetching item:', event.target.errorCode);
                reject(new Error('Error in fetching item'));
            };
        };

        request.onerror = (event) => {
            console.error('Error in opening database:', event.target.errorCode);
            reject(new Error('Error in opening database'));
        };
    });
}


// 保存数据到前端数据库
export function saveDataToDB(tableName, key, buffer) {
    // 打开一个名为imageDB的数据库，版本号为1
    const request = indexedDB.open(tableName, 1);

    // 如果数据库需要升级（即首次打开或版本增加），则会调用此事件处理函数
    request.onupgradeneeded = (e) => {
        // 获取数据库实例
        const db = e.target.result;
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db.objectStoreNames.contains(tableName)) {
            // 创建一个新的对象存储空间images，并设置keyPath为name，用于唯一标识每条记录
            db.createObjectStore(tableName, {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
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
        // const imgRequest = store.put(buffer);
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

export function saveProjectInfoToDB(name, buffer) {
    saveDataToDB("projects", name, buffer)
}

export function saveTaggerImageToDB(name, buffer) {
    saveDataToDB("images", name, buffer)
}

// 保存爬取的图片
export function saveSpiderDataToDB(name, buffer) {
    const keyword = sessionStorage.getItem('keyword')
    saveDataToDB(keyword, name, buffer)
}

export function loadConceptDataFromDB(tableName) {
    return loadDataFromDB(tableName, tableName);
}

export function loadDataFromDB(dbname, tableName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbname, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(tableName)) {
                db.createObjectStore(tableName, {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction([tableName], 'readonly');
            const store = transaction.objectStore(tableName);
            const cursorRequest = store.openCursor();
            let array = [];
            cursorRequest.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    array.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(array);
                }
            };

            cursorRequest.onerror = (e) => console.error('Error fetching data from IndexedDB:', e.target.error);
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            resolve([])
        };
    });
}

export function loadSingleDataFromDB(dbname, keyPathName, key, callback) {
    const request = indexedDB.open(dbname, 1);

    request.onerror = (event) => {
        console.error('Database error:', event.target.error);
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([dbname], "readonly");
        const store = transaction.objectStore(dbname);
        const index = store.index(keyPathName + "Index"); // 假设索引名为"nameIndex"
        const getRequest = index.get(key);

        getRequest.onerror = (event) => {
            console.error('Error fetching data:', event.target.error);
            callback(undefined)
        };

        getRequest.onsuccess = (event) => {
            const projectData = getRequest.result;
            callback(projectData)
        };

        getRequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(dbname, {keyPath: keyPathName});
        };
    };
}

// 清空指定的对象存储空间
export function clearObjectStore(dbName, storeName) {
    // const dbName = "imagesDB";  // 数据库名称
    // const storeName = "images"; // 对象存储空间名称

    // 打开数据库
    const request = indexedDB.open(dbName);

    request.onsuccess = (e) => {
        const db = e.target.result;
        // 检查对象存储空间是否存在
        if (!db.objectStoreNames.contains(storeName)) {
            db.close(); // 关闭数据库连接
            return;
        }

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

// 生成客户端随机id
export function createClientId() {
    let uuid = sessionStorage.getItem('clientId')
    if (uuid === null)
        sessionStorage.setItem('clientId', v4())
}

export async function addConcept(concept) {

    const dbName = 'concepts';
    const storeName = 'concepts';


    const isExist = await checkDataInDB("concepts", "concepts", "nameIndex", concept)
    if (isExist) {
        emitter.emit(conceptModalOpenEvent);
    } else {
        sessionStorage.setItem('concept', concept)
        saveDataToDB('concepts', concept, concept)
        emitter.emit(conceptModalCloseEvent, concept);
    }
}

// 弹出提示消息
export function messagesShow(title, message) {

}

// 获取训练概念
export function getConcept() {
    return new Promise((resolve, reject) => {
        const concept = sessionStorage.getItem('concept');
        if (concept === null) {
            // 注册事件监听器，用于在模态对话框关闭后处理
            once(conceptModalCloseEvent, (userInput) => {
                // 用户输入或从对话框获取的信息作为结果返回
                resolve(userInput);
            });

            // 触发事件打开模态对话框
            emitter.emit(conceptModalOpenEvent);
        } else {
            // 如果已有concept则直接返回
            resolve(concept);
        }
    });
}

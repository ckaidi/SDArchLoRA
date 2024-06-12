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
import JSZip from 'jszip';

window.bootstrap = bootstrap;
export const OneDay = 60 * 60 * 24
export const tipsModalEvent = 'tipsModalEvent'
export const conceptModalOpenEvent = 'conceptModalOpenEvent'
export const conceptModalCloseEvent = 'conceptModalCloseEvent'
export const selectModalOpenEvent = 'selectModalOpenEvent'
export const spiderServer = '127.0.0.1:8081'

export async function initDataBase() {
    await openDataBase('concepts', (db_temp) => {
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db_temp.objectStoreNames.contains('concepts')) {
            // 创建一个新的对象存储空间images，并设置keyPath为name，用于唯一标识每条记录
            db_temp.createObjectStore('concepts', {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
        }
    });

    await openDataBase('projects', (db_temp) => {
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db_temp.objectStoreNames.contains('projects')) {
            // 创建一个新的对象存储空间images，并设置keyPath为name，用于唯一标识每条记录
            db_temp.createObjectStore('projects', {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
        }
    });
}

export const emitter = mitt()
const instance = createApp(App)
instance.use(router)
instance.use(VueCookies)
instance.use(VueCropper)
instance.mount('#app')// 实现一个 once 功能

//生成随机字符
const _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

/**
 * 随机生成索引
 * @param min 最小值
 * @param max 最大值
 * @param i 当前获取位置
 */
function RandomIndex(min, max, i) {
    let index = Math.floor(Math.random() * (max - min + 1) + min),
        numStart = _charStr.length - 10;
    //如果字符串第一位是数字，则递归重新获取
    if (i === 0 && index >= numStart) {
        index = RandomIndex(min, max, i);
    }
    //返回最终索引值
    return index;
}

/**
 * 随机生成字符串
 * @param len 指定生成字符串长度
 */
function getRandomString(len) {
    let min = 0, max = _charStr.length - 1, _str = '';
    //判断是否指定长度，否则默认长度为15
    len = len || 15;
    //循环生成字符串
    let i = 0, index;
    for (; i < len; i++) {
        index = RandomIndex(min, max, i);
        _str += _charStr[index];
    }
    return _str;
}

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

// 弹出提示
export const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    let uniqueId = getRandomString(20)
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible show" role="alert">`,
        `   <div>${message}</div>`,
        `   <button id="${uniqueId}" type="button" class="btn-close alert-btn-close" data-bs-dismiss="alert" aria-label="Close" onclick="whenClose()" "></button>`,
        '</div>'
    ].join('')
    let messageCount = sessionStorage.getItem("messageCount")
    let count = parseInt(messageCount)
    if (messageCount >= 3) {
        let eles = document.getElementsByClassName('alert-btn-close')
        eles.item(0).click()
    }
    const g = document.createElement('script');
    const s = document.getElementsByTagName('script')[0];
    g.text = 'function whenClose(){' +
        'let messageCount = sessionStorage.getItem("messageCount");' +
        'let count=parseInt(messageCount);' +
        'count--;' +
        'sessionStorage.setItem("messageCount", count.toString());' +
        '}'
    s.parentNode.insertBefore(g, s);
    alertPlaceholder.append(wrapper)
    count++
    sessionStorage.setItem("messageCount", count.toString())
    setTimeout(() => {
        let button = document.getElementById(uniqueId)
        if (button !== null) {
            button.click()
        }
    }, 3000)
}

// 检查ws服务器
export function checkWsServer() {
    return new Promise(async (resolve, reject) => {
        try {
            const ws = new WebSocket("ws://" + spiderServer + "/archdaily?test=true");
            // 注册 onmessage 事件的回调函数
            ws.onmessage = function (event) {
                resolve(true);
            };

            // 注册 onerror 事件的回调函数
            ws.onerror = function (event) {
                resolve(false);
            };
        } catch (error) {
            resolve(false);
        }
    });
}

// 向后端发送请求，爬取archidaily
export function searchArchDaily(keyword, onReceiveImg) {
    // 创建一个 WebSocket 对象，连接到本地的 8080 端口
    if (keyword !== "") {
        const ws = new WebSocket("ws://" + spiderServer + "/archdaily?keyword=" + keyword + "&page=1&projectCount=0");
        searchCore(ws, onReceiveImg);
    }
}

export async function continueSearchArchDaily(keyword, onReceiveImg) {
    await updateConceptItem('searches', keyword, 'date', Date.now())
    const that = instance
    // 创建一个 WebSocket 对象，连接到本地的 8080 端口
    if (keyword !== "") {
        const searchesKeywords = await loadConceptDataFromDB('searches')
        if (searchesKeywords === null || searchesKeywords.length === 0) {
            resolve(null)
        }
        try {
            let key = '';
            for (const item of searchesKeywords) {
                if (item.name === keyword) {
                    key = item;
                    break
                }
            }
            if (key === '') {
                messagesShow('错误', '服务器出现错误,请稍候再试');
            }
            const count = key.project_count;
            const page = key.page_count;
            const ws = new WebSocket("ws://" + spiderServer + "/archdaily?" + "keyword=" + keyword + "&page=" + page + "&projectCount=" + count);

            searchCore(ws, onReceiveImg);
        } catch (e) {
        }
    }
}

// 检查所给的的数据是否在数据库中
export function checkDataInDB(dbName, storeName, indexValue) {
    return new Promise(async (resolve, reject) => {
        const db = await openDataBase(dbName, (db_temp) => {
            // 关闭新创建的数据库
            event.target.result.close();
            // 删除新创建的数据库
            indexedDB.deleteDatabase(dbName);
            resolve('')
        });

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
    });
}


// 保存数据到前端数据库
export async function saveConceptsToDB(key, buffer) {
    const db = await openDataBase('concepts', (db_temp) => {
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db_temp.objectStoreNames.contains('concepts')) {
            // 创建一个新的对象存储空间images，并设置keyPath为name，用于唯一标识每条记录
            db_temp.createObjectStore('concepts', {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
        }
    });

    // 创建一个读写事务，目标对象存储空间为images
    const transaction = db.transaction(['concepts'], "readwrite");
    // 获取对象存储空间
    const store = transaction.objectStore('concepts');
    // 向对象存储空间中添加或更新一条记录
    // const imgRequest = store.put(buffer);
    const imgRequest = store.put({name: key, content: buffer});

    imgRequest.onsuccess = () => {
        console.log("Image saved successfully!");
    };

    imgRequest.onerror = (e) => {
        console.error("Error saving the image:", e.target.error);
    };

    await openDataBase(key, (db_temp) => {
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db_temp.objectStoreNames.contains('searches')) {
            db_temp.createObjectStore('searches', {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
        }
        if (!db_temp.objectStoreNames.contains('images')) {
            db_temp.createObjectStore('images', {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
        }
        if (!db_temp.objectStoreNames.contains('train_images')) {
            db_temp.createObjectStore('train_images', {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
        }
        if (!db_temp.objectStoreNames.contains('user_tags')) {
            db_temp.createObjectStore('user_tags', {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
        }
    });
}

// 保存数据到概念数据库
export async function saveDataToConceptToDB(tableName, key, buffer) {
    const concept = sessionStorage.getItem('concept')
    const db = await openDataBase(concept);

    // 创建一个读写事务，目标对象存储空间为images
    const transaction = db.transaction([tableName], "readwrite");
    // 获取对象存储空间
    const store = transaction.objectStore(tableName);
    // 向对象存储空间中添加或更新一条记录
    // const imgRequest = store.put(buffer);
    const imgRequest = store.put(buffer);

    imgRequest.onsuccess = () => {
        console.log("Image saved successfully!");
    };

    imgRequest.onerror = (e) => {
        console.error("Error saving the image:", e.target.error);
    };
}

export async function saveProjectInfoToDB(key, buffer) {
    const db = await openDataBase('projects', (db_temp) => {
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db_temp.objectStoreNames.contains('projects')) {
            // 创建一个新的对象存储空间images，并设置keyPath为name，用于唯一标识每条记录
            db_temp.createObjectStore('projects', {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
        }
    });

    // 创建一个读写事务，目标对象存储空间为images
    const transaction = db.transaction(['projects'], "readwrite");
    // 获取对象存储空间
    const store = transaction.objectStore('projects');
    // 向对象存储空间中添加或更新一条记录
    // const imgRequest = store.put(buffer);
    const imgRequest = store.put({name: key, content: buffer});

    imgRequest.onsuccess = () => {
        console.log("Image saved successfully!");
    };

    imgRequest.onerror = (e) => {
        console.error("Error saving the image:", e.target.error);
    };
}


export async function saveTaggerImageToDB(name, buffer) {
    await saveDataToConceptToDB("train_images", name, buffer)
}

export function loadConceptDataFromDB(tableName) {
    const concept = sessionStorage.getItem('concept')
    return loadDataFromDB(concept, tableName);
}

export function loadDataFromDB(dbname, tableName) {
    return new Promise(async (resolve, reject) => {
        if (dbname === null) {
            resolve([])
            return
        }

        const db = await openDataBase(dbname, (db_temp) => {
            // 关闭新创建的数据库
            event.target.result.close();
            // 删除新创建的数据库
            indexedDB.deleteDatabase(dbname);
            resolve([]);
        });
        if (!db) {
            resolve([]);
            return;
        }

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
    });
}

export function loadSingleDataFromDB(dbname, keyPathName, key) {
    return new Promise(async (resolve, reject) => {
        const db = await openDataBase(dbname, (db_temp) => {
            // 关闭新创建的数据库
            event.target.result.close();
            // 删除新创建的数据库
            indexedDB.deleteDatabase(dbname);
            resolve(undefined);
        });
        const transaction = db.transaction([dbname], "readonly");
        const store = transaction.objectStore(dbname);
        const index = store.index(keyPathName + "Index"); // 假设索引名为"nameIndex"
        const getRequest = index.get(key);

        getRequest.onerror = (event) => {
            alert(event)
            console.error('Error fetching data:', event.target.error);
            resolve(undefined)
        };

        getRequest.onsuccess = (event) => {
            const projectData = getRequest.result;
            resolve(projectData)
        };

        getRequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(dbname, {keyPath: keyPathName});
        };
    });
}

// 生成客户端随机id
export function createClientId() {
    let uuid = sessionStorage.getItem('clientId')
    if (uuid === null)
        sessionStorage.setItem('clientId', v4())
}

export async function addConcept(concept) {
    const isExist = await checkDataInDB("concepts", "concepts", "nameIndex", concept)
    if (isExist) {
        emitter.emit(conceptModalOpenEvent);
    } else {
        sessionStorage.setItem('concept', concept)
        await saveConceptsToDB(concept, concept)
        emitter.emit(conceptModalCloseEvent, concept);
    }
}

// 弹出提示消息
export function messagesShow(title, message) {

}

// 获取训练概念
export function getConcept() {
    return new Promise(async (resolve, reject) => {
        const concept = sessionStorage.getItem('concept');
        if (concept === null) {
            const concepts = await loadDataFromDB('concepts', 'concepts')
            if (concepts !== null && concepts !== undefined && concepts.length > 0) {
                sessionStorage.setItem('concept', concepts[0].content);
                resolve(concepts[0].content);
                return;
            }

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

export async function deleteConceptItem(tableName, key) {
    let concept = sessionStorage.getItem('concept');
    const db = await openDataBase(concept, (db_temp) => {
        // 关闭新创建的数据库
        event.target.result.close();
        // 删除新创建的数据库
        indexedDB.deleteDatabase(concept);
    });
    if (!db) {
        return;
    }

    const transaction = db.transaction([tableName], 'readwrite'); // 创建读写事务
    const store = transaction.objectStore(tableName);

    const itemRequest = store.delete(key);
}

// 更新物体
export async function updateConceptItem(tableName, key, field, newValue) {
    let concept = sessionStorage.getItem('concept');
    const db = await openDataBase(concept, (db_temp) => {
        // 关闭新创建的数据库
        event.target.result.close();
        // 删除新创建的数据库
        indexedDB.deleteDatabase(concept);
    });
    if (!db) {
        return;
    }

    const transaction = db.transaction([tableName], 'readwrite'); // 创建读写事务
    const store = transaction.objectStore(tableName);

    const itemRequest = store.get(key); // 假设 'a' 是你想要修改的项的键

    itemRequest.onsuccess = () => {
        const data = itemRequest.result;
        if (data) {
            // 修改page字段

            data[field] = newValue;
            const updateRequest = store.put(data); // 将修改后的对象写回数据库

            updateRequest.onsuccess = () => {
                console.log('Item updated successfully');
            };

            updateRequest.onerror = (event) => {
                console.error('Error updating item:', event.target.error);
            };
        } else {
            console.warn('Item not found');
        }
    };

    itemRequest.onerror = (event) => {
        console.error('Error fetching item:', event.target.error);
    };
}

// 获取训练关键字
export async function getKeyword() {
    return new Promise(async (resolve, reject) => {
        let keyword = sessionStorage.getItem('keyword')
        if (keyword !== null) {
            resolve(keyword)
        }
        const searchesKeywords = await loadConceptDataFromDB('searches')
        if (searchesKeywords === null || searchesKeywords.length === 0) {
            resolve(null)
        }
        try {
            const maxDateItem = searchesKeywords.reduce((max, item) => {
                return new Date(item.date) > new Date(max.date) ? item : max;
            });
            sessionStorage.setItem('keyword', maxDateItem.name)
            resolve(maxDateItem.name)
        } catch (e) {
            resolve(null)
        }
    });
}

// 所有方法都从这打开数据库
function openDataBase(dbname, createTable) {
    return new Promise(async (resolve, reject) => {
        const request = indexedDB.open(dbname);

        // 如果数据库需要升级（即首次打开或版本增加），则会调用此事件处理函数
        request.onupgradeneeded = (e) => {
            // 获取数据库实例
            const db = e.target.result;
            // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
            createTable(db);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            resolve(null)
        };
    });
}

// 下载文本文件
export function downloadTextFile(text, filename) {
    // 创建一个Blob对象，它包含要下载的数据
    const blob = new Blob([text], {type: 'text/plain'});

    // 创建一个链接元素
    const a = document.createElement('a');

    // 创建Blob的URL
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;

    // 添加链接元素到DOM（不可见），并触发点击事件
    document.body.appendChild(a);
    a.click();

    // 清理操作：删除添加的元素，释放Blob URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function base64ToBlob(base64, mimeType) {
    // Base64字符串解码
    let bytes = atob(base64.split(',')[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeType});
}

// 下载文件到zip
export async function downloadMultipleFilesAsZip(allImages) {
    const zip = new JSZip();
    let index = 0;
    for (const image of allImages) {
        let tagText = "";
        for (const tag of image.tag) {
            tagText += tag.tag + ','
        }
        // 添加文件到ZIP
        zip.file(index + '.txt', tagText);
        zip.file(index + '.jpg', base64ToBlob(image.url, 'jpeg'), {base64: true});
        index++;
    }

    // 生成ZIP并触发下载
    zip.generateAsync({type: 'blob'}).then(async function (content) {
        // 使用类似前面提到的下载方法
        const a = document.createElement('a');
        const url = URL.createObjectURL(content);
        a.href = url;
        a.download = '50_' + await getConcept() + '.zip'; // 设置下载的文件名
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

import 'jquery'
import 'popper.js'
import mitt from 'mitt'
import App from './App.vue'
import {createApp, reactive, ref} from 'vue'
import VueCookies from 'vue-cookies'
import VueCropper from 'vue-cropper';
import router from "./router";
import JSZip from 'jszip';
import {ImageDB} from "./types/ImageDB.ts";
import {ProjectDB} from "./types/ProjectDB.ts";
import {ConceptDB} from "./types/ConceptDB.ts";
import {SearchDB} from "./types/SearchDB.ts";
import {PageDataDB} from "./types/PageDataDB.ts";
import {getRandomString} from "./utils.ts";
import {PageImageDB} from "./types/PageImageDB.ts";
import {ImageItem} from "./types/ImageItem.ts";
import {TrainImage} from "./types/TrainImage.ts";
import './style.css'
import './assets/main.css'
import 'vue-cropper/dist/index.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tag} from "./types/Tag.ts";

type Events = {
    selectModalOpenEvent: void;
    stringValue: string;
    conceptModalOpenEvent: void;
    conceptModalCloseEvent: string;
    keywordChangedEvent: string;
    addTrainImg: ImageItem;
    selectTrainImgChange: TrainImage;
};

export let searchImageCount = 0;
export const emitter = mitt<Events>()
export const spiderServer = '127.0.0.1:8081'
export const selectModalOpenEvent = 'selectModalOpenEvent'
export const conceptModalOpenEvent = 'conceptModalOpenEvent'
export const conceptModalCloseEvent = 'conceptModalCloseEvent'

export const keyword = ref("");
export const initFinish = ref(false);
export const concept = ref<string>('default');
export const userTags = ref<Tag[]>([]);
export const allConcepts = ref<ConceptDB[]>([]);
export let selectTrainImg = ref<TrainImage | null>(null);
export const trainHash = reactive<{ [key: string]: TrainImage }>({});
export const showSearchImages = ref(reactive<{ [key: string]: ImageItem }>({}));

const initDateBaseFinish = ref(false);

const instance = createApp(App);
instance.component('vue-cropper', VueCropper);
instance.use(router)
instance.use(VueCookies)
instance.mount('#app')// 实现一个 once 功能
const alertPlaceholder = document.getElementById('liveAlertPlaceholder') as HTMLElement

window.onresize = (event: UIEvent) => {
    if (event.type == 'resize') {
        resizeCutterSpace();
        resizeTrainImgSpace();
    }
}

initDataBase().then(async () => {
    initDateBaseFinish.value = true;
    const images = await loadConceptDataFromDB<TrainImage>('train_images');
    for (const trainImage of images) {
        trainHash[trainImage.url] = trainImage;
    }

    const temp = await loadConceptDataFromDB<Tag>('user_tags');
    if (temp) {
        userTags.value = []
        for (const tag of temp) {
            userTags.value.push(tag);
        }
    }
    allConcepts.value = await loadDataFromDB<ConceptDB>('spiders', 'concepts');
    concept.value = allConcepts.value[0].name;
    initFinish.value = true;
});

/**
 * 重新计算放置训练图片空间的大小
 */
export function resizeTrainImgSpace() {
    const trainImgContainer = document.getElementById('trainImgContainer');
    if (trainImgContainer) {
        const navigation = document.getElementById('navigationComponent');
        if (navigation) {
            const nh = navigation.offsetHeight;
            trainImgContainer.style.maxHeight = (window.innerHeight - nh - 20) + 'px';
        }
    }
}

/**
 * 重新计算裁剪空间的大小
 */
export function resizeCutterSpace() {
    const cutElement = document.getElementById('cut');
    if (cutElement) {
        const navigation = document.getElementById('navigationComponent');
        if (navigation) {
            const nh = navigation.offsetHeight;
            cutElement.style.height = (window.innerHeight - nh - 70) + 'px';
        }
    }
}

// 插入概念数据库和项目数据库以及图片数据库
async function initDataBase() {
    await openDataBase('spiders', (db_temp) => {
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db_temp.objectStoreNames.contains('images')) {
            // 创建一个新的对象存储空间images，并设置keyPath为name，用于唯一标识每条记录
            const imagesTable = db_temp.createObjectStore('images', {keyPath: 'url'});
            imagesTable.createIndex("urlIndex", 'url', {unique: true});
        }
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db_temp.objectStoreNames.contains('projects')) {
            // 创建一个新的对象存储空间images，并设置keyPath为name，用于唯一标识每条记录
            const projectsTable = db_temp.createObjectStore('projects', {keyPath: 'document_id'});
            projectsTable.createIndex("document_idIndex", 'document_id', {unique: true});
        }
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db_temp.objectStoreNames.contains('searches')) {
            // 创建一个新的对象存储空间images，并设置keyPath为name，用于唯一标识每条记录
            const searchesTable = db_temp.createObjectStore('searches', {keyPath: 'keyword'});
            searchesTable.createIndex("keywordIndex", 'keyword', {unique: true});
        }
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db_temp.objectStoreNames.contains('concepts')) {
            // 创建一个新的对象存储空间images，并设置keyPath为name，用于唯一标识每条记录
            const searchesTable = db_temp.createObjectStore('concepts', {keyPath: 'name'});
            searchesTable.createIndex("nameIndex", 'name', {unique: true});
        }
    });
    await addConcept('default', false);
    concept.value = 'default';
}

// 所有方法都从这打开数据库
function openDataBase(dbname: string, createTable: (args: IDBDatabase) => void): Promise<IDBDatabase> {
    return new Promise(async (resolve, reject) => {
        const request = indexedDB.open(dbname);

        // 如果数据库需要升级（即首次打开或版本增加），则会调用此事件处理函数
        request.onupgradeneeded = (e) => {
            // 获取数据库实例
            const db = (e.target as IDBOpenDBRequest).result;
            // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
            createTable(db);
        };

        request.onsuccess = (event) => {
            // 获取数据库实例
            const db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
        };

        request.onerror = (event) => {
            reject(event);
        };
    });
}

// 检查所给的的数据是否在数据库中
export async function checkDataInDB(dbName: string, storeName: string, keyPath: string, indexValue: any): Promise<boolean> {
    const obj = await getDataInDBByKey<object>(dbName, storeName, keyPath, indexValue);
    return obj != null;
}

/**
 * 获取指定key的数据
 * @param dbName 数据库名称
 * @param tableName 数据表名称
 * @param keyPath 键路径（包含Index）
 * @param key 键值
 */
export async function getDataInDBByKey<T>(dbName: string, tableName: string, keyPath: string, key: any): Promise<T | null> {
    return new Promise(async (resolve, reject) => {
        const db = await openDataBase(dbName, (db_temp) => {
            // 关闭新创建的数据库
            db_temp.close();
            // 删除新创建的数据库
            indexedDB.deleteDatabase(dbName);
            resolve(null)
        });

        const transaction = db.transaction([tableName], 'readonly');
        const store = transaction.objectStore(tableName);
        const index = store.index(keyPath);
        const getRequest = index.get(key);

        getRequest.onsuccess = () => {
            if (getRequest.result) {
                resolve(getRequest.result);
            } else {
                console.log('Item does not exist.');
                resolve(null);
            }
        };

        getRequest.onerror = (event) => {
            const request = event.target as IDBRequest;
            console.error('Error in fetching item:', request.error);
            reject(new Error('Error in fetching item: ' + request.error?.message));
        };
    });
}

// 保存概念到数据库
export async function saveConceptToDB(key: string) {
    const db = await openDataBase('spiders', (db_temp) => {
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db_temp.objectStoreNames.contains('concepts')) {
            // 创建一个新的对象存储空间images，并设置keyPath为name，用于唯一标识每条记录
            db_temp.createObjectStore('concepts', {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
        }
    });

    // 创建一个读写事务，目标对象存储空间为concepts
    const transaction = db.transaction(['concepts'], "readwrite");
    // 获取对象存储空间
    const store = transaction.objectStore('concepts');
    // 向对象存储空间中添加或更新一条记录
    const imgRequest = store.put({name: key});

    imgRequest.onsuccess = () => {
        console.log("概念保存成功!");
    };

    imgRequest.onerror = (e) => {
        const request = e.target as IDBRequest;
        console.error("概念保存失败!", request.error);
    };

    // 创建概念相关数据库
    await openDataBase(key, (db_temp) => {
        // 检车是否已存在名为images的对象存储空间，如果不存在，则创建它
        if (!db_temp.objectStoreNames.contains('user_tags')) {
            db_temp.createObjectStore('user_tags', {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
        }
        if (!db_temp.objectStoreNames.contains('train_images')) {
            db_temp.createObjectStore('train_images', {keyPath: "name"}).createIndex("nameIndex", "name", {unique: true});
        }
    });
}

// 添加训练概念
export async function addConcept(concept: string, isModelOpen: boolean = true) {
    const isExist = await checkDataInDB("spiders", "concepts", "nameIndex", concept);
    if (isExist || concept === '') {
        if (isModelOpen)
            emitter.emit(conceptModalOpenEvent);
    } else {
        sessionStorage.setItem('concept', concept)
        await saveConceptToDB(concept)
        emitter.emit(conceptModalCloseEvent, concept);
    }
}


// 保存数据到概念数据库
export async function saveDataToConceptToDB(tableName: string, buffer: object) {
    if (!concept.value) return;
    const db = await openDataBase(concept.value, (_) => {
    });


    // 创建一个读写事务，目标对象存储空间为images
    console.log('open table: ', tableName);
    try {
        const transaction = db.transaction([tableName], "readwrite");
        // 获取对象存储空间
        const store = transaction.objectStore(tableName);
        // 向对象存储空间中添加或更新一条记录
        const imgRequest = store.put(buffer);

        imgRequest.onsuccess = () => {
            console.log("Image saved successfully!");
        };

        imgRequest.onerror = (e) => {
            const request = e.target as IDBRequest;
            console.error("Error saving the image:", request.error);
        };
    } catch (e) {
        console.error('Error saving the image: ' + e);
    }
}

export async function saveNewPage(data: PageDataDB[], page: number, project: number) {
    const key = sessionStorage.getItem('keyword');
    if (!key) return;
    const searchData = await loadSingleDataFromDB<SearchDB>('spiders', "searches", "keyword", key)
    if (searchData) {
        searchData.page_count = page;
        searchData.project_count = project;
        searchData.date = Date.now();
        for (const item of data) {
            // 添加新的page data
            item.page = searchData.pages_data.length + 1;
            searchData.pages_data.push(item);
        }
        await saveDataToGlobalDB("searches", searchData);
    }
}

// 向后端发送请求，爬取archidaily
export function searchArchDaily(keyword: string, onReceiveImg: (arg: string) => void) {
    // 创建一个 WebSocket 对象，连接到本地的 8080 端口
    if (keyword !== "") {
        const ws = new WebSocket("ws://" + spiderServer + "/archdaily?keyword=" + keyword + "&page=1&projectCount=-1");
        searchCore(ws, onReceiveImg);
    }
}

// 保存图片到page data里
function searchCore(ws: WebSocket, onReceiveImg: (arg: string) => void) {
    searchImageCount = 0;
    // 注册 onopen 事件的回调函数
    ws.onopen = function () {
        // 连接成功，打印信息
        console.log("WebSocket 连接成功");
    };

    // 注册 onmessage 事件的回调函数
    ws.onmessage = function (event) {
        // 接收到服务器发送的数据，打印信息
        console.log("WebSocket 接收到数据：", event.data);
        onReceiveImg(event.data.toString());
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

// 增加或更新
export async function addOrUpdateSearchToDB(keyword: string) {
    const searchData = await loadSingleDataFromDB<SearchDB>("spiders", "searches", "keyword", keyword);
    if (searchData) {
        // 存在则更更新
        await saveDataToGlobalDB("searches", searchData);
    } else {
        // 不存在则添加
        await saveDataToGlobalDB("searches", new SearchDB(keyword, Date.now()));
    }
}

// 从数据库中读取指定key的数据
export function loadSingleDataFromDB<T>(dbName: string, tableName: string, keyPathName: string, key: any): Promise<T | null> {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDataBase(dbName, (db_temp) => {
                // 关闭新创建的数据库
                db_temp.close();
                // 删除新创建的数据库
                indexedDB.deleteDatabase(dbName);
                resolve(null);
            });
            const transaction = db.transaction([tableName], "readonly");
            const store = transaction.objectStore(tableName);
            const index = store.index(keyPathName + "Index"); // 假设索引名为"nameIndex"
            const getRequest = index.get(key);

            getRequest.onerror = (event) => {
                reject(event)
            };

            getRequest.onsuccess = (_) => {
                const projectData = getRequest.result;
                resolve(projectData)
            };
        } catch (e) {
            console.error(e);
        }
    });
}

// 弹出提示
export const appendAlert = (message: string, type: string) => {
    const wrapper = document.createElement('div')
    let uniqueId = getRandomString(20)
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible show" role="alert">`,
        `   <div>${message}</div>`,
        `   <button id="${uniqueId}" type="button" class="btn-close alert-btn-close" data-bs-dismiss="alert" aria-label="Close" onclick="whenClose()" "></button>`,
        '</div>'
    ].join('')
    let messageCount = sessionStorage.getItem("messageCount")
    if (messageCount) {
        let count = parseInt(messageCount)
        if (count >= 3) {
            let eles = document.getElementsByClassName('alert-btn-close')
            const clickElement = eles.item(0) as HTMLButtonElement;
            if (clickElement) {
                clickElement.click();
            }
        }
        const g = document.createElement('script');
        const s = document.getElementsByTagName('script')[0];
        if (s.parentNode) {
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
    }
}

function base64ToBlob(base64: string, mimeType: string) {
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

function loadDataFromDB<T>(dbname: string, tableName: string): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
        try {
            if (dbname === null) {
                resolve([])
                return
            }

            const db = await openDataBase(dbname, (db_temp) => {
                // 关闭新创建的数据库
                db_temp.close();
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
            let array: T[] = [];
            cursorRequest.onsuccess = (e) => {
                const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
                if (cursor) {
                    const item = cursor.value as T;
                    if (item) {
                        array.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    resolve(array);
                }
            };

            cursorRequest.onerror = (e) => {
                const request = e.target as IDBRequest;
                console.error('Error fetching data from IndexedDB:', request.error);
            }
        } catch (e) {
            console.error(e)
            reject(e);
        }
    });
}

// 加载数据库中的第一行数据，如果数据库没有数据则返回null
export function loadFirstDataOrNullFromDB<T>(dbname: string, tableName: string): Promise<T | null> {
    return new Promise(async (resolve, reject) => {
        try {
            if (dbname === null) {
                resolve(null);
                return
            }

            const db = await openDataBase(dbname, (db_temp) => {
                // 关闭新创建的数据库
                db_temp.close();
                // 删除新创建的数据库
                indexedDB.deleteDatabase(dbname);
                resolve(null);
            });
            if (!db) {
                resolve(null);
                return;
            }

            const transaction = db.transaction([tableName], 'readonly');
            const store = transaction.objectStore(tableName);
            const cursorRequest = store.openCursor();
            cursorRequest.onsuccess = (e) => {
                const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
                if (cursor) {
                    const item = cursor.value as T;
                    if (item) {
                        resolve(cursor.value);
                        return;
                    }
                    cursor.continue();
                } else {
                    resolve(null);
                }
            };

            cursorRequest.onerror = (e) => {
                const request = e.target as IDBRequest;
                console.error('Error fetching data from IndexedDB:', request.error);
            }
        } catch (e) {
            console.error(e)
            reject(e);
        }
    });
}

/**
 * 下载训练文件到zip
 */
// 
export async function downloadMultipleFilesAsZip() {
    const zip = new JSZip();
    let index = 0;
    for (const image of Object.values(trainHash)) {
        let tagText = "";
        for (const tag of image.tags) {
            tagText += tag + ','
        }
        // 添加文件到ZIP
        zip.file(index + '.txt', tagText);
        zip.file(index + '.jpg', base64ToBlob(image.large_base64, 'jpeg'), {base64: true});
        index++;
    }

    // 生成ZIP并触发下载
    zip.generateAsync({type: 'blob'}).then(async function (content: Blob | MediaSource) {
        // 使用类似前面提到的下载方法
        const a = document.createElement('a');
        const url = URL.createObjectURL(content);
        a.href = url;
        a.download = '50_' + concept.value + '.zip'; // 设置下载的文件名
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// 删除概念
export async function loadConceptDataFromDB<T>(tableName: string): Promise<T[]> {
    if (!concept.value) return [];
    return await loadDataFromDB<T>(concept.value, tableName);
}

// 保存数据到指定到库和表
export async function saveDataToGlobalDB(tableName: string, data: object) {
    const db = await openDataBase('spiders', (_) => {
    });

    // 创建一个读写事务，目标对象存储空间为images
    const transaction = db.transaction([tableName], "readwrite");
    // 获取对象存储空间
    const store = transaction.objectStore(tableName);
    // 向对象存储空间中添加或更新一条记录
    const imgRequest = store.put(data);

    imgRequest.onsuccess = () => {
        console.log("Image saved successfully!");
    };

    imgRequest.onerror = (e) => {
        const request = e.target as IDBRequest;
        console.error("Error saving the image:", request.error);
    };
}


// 保存项目到数据库
export async function saveProjectInfoToDB(project: ProjectDB) {
    await saveDataToGlobalDB("projects", project);
}

// 保存图片到数据库
export async function saveImageToDB(image: ImageDB) {
    await saveDataToGlobalDB("images", image);
}

/**
 * 更新搜索的archidaily页面数和项目
 * 显示更多图片
 * @param keyword 搜索关键字
 * @param onReceiveImg 接受图片的委托
 */
export async function continueSearchArchDaily(keyword: string, onReceiveImg: (arg: string) => void) {
    // 创建一个 WebSocket 对象，连接到本地的 8080 端口
    if (keyword !== "") {
        const searchesKeywords = await loadSingleDataFromDB<SearchDB>('spiders', 'searches', 'keyword', keyword);
        if (searchesKeywords === null) {
            return;
        }
        const count = searchesKeywords.project_count;
        const page = searchesKeywords.page_count;
        const ws = new WebSocket("ws://" + spiderServer + "/archdaily?" + "keyword=" + keyword + "&page=" + page + "&projectCount=" + count);
        searchCore(ws, onReceiveImg);
    }
}

/**
 * 读取搜索结果
 * @param keyword 搜索关键字
 * @param page 页面
 * @param addImages 添加图片委托
 */
export async function readSearchesDB(keyword: string, page: number, addImages: (arg: string) => void): Promise<PageImageDB[]> {
    const searchDB = await loadSingleDataFromDB<SearchDB>('spiders', 'searches', 'keyword', keyword);
    if (!searchDB) return [];
    if (searchDB.pages_data.length >= page) {
        return searchDB.pages_data[page - 1].images;
    }
    await continueSearchArchDaily(keyword, addImages);
    return [];
}

/**
 * 删除数据库中指定项
 * @param dbname 数据库名称
 * @param tableName 页面
 * @param key 数据键
 */
export async function deleteDBItemByKey(dbname: string, tableName: string, key: any) {
    const db = await openDataBase(dbname, (db_temp) => {
        // 关闭新创建的数据库
        db_temp.close();
        // 删除新创建的数据库
        indexedDB.deleteDatabase(dbname);
    });
    if (!db) {
        return;
    }

    const transaction = db.transaction([tableName], 'readwrite'); // 创建读写事务
    const store = transaction.objectStore(tableName);
    store.delete(key);
}

/**
 * 保存选中的训练图片到数据库
 */
export async function saveSelectTrainImgToDB() {
    if (selectTrainImg.value)
        return saveTrainImgToDB(selectTrainImg.value);
}

/**
 * 保存选中的训练图片到数据库
 */
export async function saveTrainImgToDB(item: TrainImage) {
    if (item) {
        const cl = new TrainImage(item.name, item.url,
            item.page, item.indexInSearch, item.keyword);
        cl.large_base64 = item.large_base64;
        for (const tag of item.tags) {
            cl.tags.push(tag);
        }
        await saveDataToConceptToDB('train_images', cl);
    }
}
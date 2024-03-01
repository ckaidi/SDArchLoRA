import './assets/main.css'
import 'jquery'
import 'popper.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import {createApp} from 'vue'
import App from './App.vue'


const website = 'https://www.getphotoblanket.com'

export function randomID(length = 6) {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
}

export const getList = ({page = 1, pageSize = 20}) => {
    const url = `${website}/products.json?page=${page}&limit=${pageSize}`
    return fetch(url)
        .then(res => res.json())
        .then(res => res.products).then((res) => {
            return res.map((item) => {
                return {
                    id: randomID(),
                    star: false,
                    src: {
                        original: Math.random() > 0.1 ? item.images[0].src : 'https://cdn.shopify.com/s/files/1/0012/9217/3374/products/CHS0P159X01_3.jpg?v=1709087811',
                        // original: 'https://tq-alg-public.s3.us-west-2.amazonaws.com/kol/Seraphina_1702987997_0.png',
                    },
                    name: item.title,
                }
            })
        })
}

createApp(App).mount('#app')
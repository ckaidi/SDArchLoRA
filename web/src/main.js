import './assets/main.css'
import 'jquery'
import 'popper.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import {createApp} from 'vue'
import App from './App.vue'
import router from "@/router/index.js";

const instance = createApp(App)
instance.use(router)
instance.mount('#app')
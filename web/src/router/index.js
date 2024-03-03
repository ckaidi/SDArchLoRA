import {
    createRouter,
    createWebHashHistory,
} from "vue-router";

import Img2ImgPage from "../views/Img2ImgPage.vue";
import MoreImagesPage from '../views/MoreImagesPage.vue'

const routes = [
    {
        path: "/",
        name: "home",
        component: MoreImagesPage,
    },
    {
        path: "/img2img",
        name: "img2img",
        component: Img2ImgPage,
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;

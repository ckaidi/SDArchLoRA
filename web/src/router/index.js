import {
    createRouter,
    createWebHashHistory,
} from "vue-router";

import MoreImagesPage from '../views/MoreImagesPage.vue'
import Txt2ImgPage from "@/views/Txt2ImgPage.vue";
import Img2ImgPage from "../views/Img2ImgPage.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: MoreImagesPage,
    },
    {
        path: "/txt2img",
        name: "txt2img",
        component: Txt2ImgPage,
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

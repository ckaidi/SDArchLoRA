import {
    createRouter,
    createWebHashHistory,
} from "vue-router";

import MoreImagesPage from '../views/MoreImagesPage.vue'
import TaggerPage from "../views/TaggerPage.vue";
import CropperPage from "../views/CropperPage.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: MoreImagesPage,
    },
    {
        path: "/img2img",
        name: "img2img",
        component: TaggerPage,
    },
    {
        path: "/cropper",
        name: "cropper",
        component: CropperPage,
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;

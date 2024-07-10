// 假设 vue-cropper 没有类型定义，你可以创建一个简单的声明
// 在你的项目中的某个 .d.ts 文件中添加如下内容：
declare module 'vue-cropper' {
    import {App} from "vue";
    const VueCropper: ICropper;  // 用 any 代替具体类型，或者根据实际情况定义更精确的类型
    export default VueCropper;

    export interface ICropper {
        getCropData(funcArg: (arg: any) => void): void;
        install: (app: App, options?: any) => void;
    }
}

// vue-cropper.d.ts
// declare module 'vue-cropper/next/lib/vue-cropper.vue' {
//     import { DefineComponent } from 'vue';
//     const component: DefineComponent<{}, {}, any>;
//     export default component;
// }

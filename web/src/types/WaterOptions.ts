export class WaterOptions {

    // 唯一key值
    public rowKey: string;
    // 卡片之间的间隙
    public gutter: number;
    // 是否有周围的gutter
    public hasAroundGutter: boolean;
    // 卡片在PC上的宽度
    public width: number;
    // 自定义行显示个数，主要用于对移动端的适配
    public breakpoints: WaterOptionsBreakpoints;
    // 动画效果
    public animationEffect: string;
    // 动画时间
    public animationDuration: number;
    // 动画延迟
    public animationDelay: number;
    // imgSelector
    public imgSelector: string;
    // 加载配置
    // 是否懒加载
    public lazyload: boolean;
    public align: string;
    public crossOrigin: boolean;

    constructor() {
        this.rowKey = "id";
        this.gutter = 15;
        this.hasAroundGutter = false;
        this.width = 320;
        this.breakpoints = new WaterOptionsBreakpoints();
        this.animationEffect = 'animate__fadeInUp';
        this.animationDuration = 1000;
        this.animationDelay = 300;
        this.imgSelector = 'src.original';
        this.lazyload = true;
        this.align = 'center';
        this.crossOrigin = true;
    }
}

export class WaterOptionsBreakpoints {
    // 当屏幕宽度小于等于1200
    public 1200: WaterOptionsBreakpoint;
    // 当屏幕宽度小于等于800
    public 800: WaterOptionsBreakpoint;
    // 当屏幕宽度小于等于500
    public 500: WaterOptionsBreakpoint;


    constructor() {
        this["1200"] = new WaterOptionsBreakpoint(4);
        this["800"] = new WaterOptionsBreakpoint(3);
        this["500"] = new WaterOptionsBreakpoint(2);
    }
}

export class WaterOptionsBreakpoint {
    public rowPerView: number;

    constructor(rowPerView: number) {
        this.rowPerView = rowPerView;
    }
}
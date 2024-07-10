export class CropperOptions {
    public info: boolean;
    public img: string;
    public size: number;
    public full: boolean;
    public outputType: string;
    public canMove: boolean;
    public fixedBox: boolean;
    public original: boolean;
    public canMoveBox: boolean;
    public autoCrop: boolean;
    public autoCropWidth: number;
    public autoCropHeight: number;
    public centerBox: boolean;
    public high: boolean;
    public cropData: any;
    public enlarge: number;
    public mode: string;
    public maxImgSize: 40000;
    public limitMinSize: number[];
    public fixed: boolean;
    public fixedNumber: number[];
    public fillCover: string;
    public canScale: boolean;

    constructor() {
        this.info = false;
        this.img = "";
        this.size = 1;
        this.full = true;
        this.outputType = "jpeg";
        this.canMove = true;
        this.fixedBox = false;
        this.original = true;
        this.canMoveBox = true;
        this.autoCrop = true;
        this.autoCropWidth = 1024;
        this.autoCropHeight = 1024;
        this.centerBox = false;
        this.high = false;
        this.cropData = {};
        this.enlarge = 1;
        this.mode = 'cover';
        this.maxImgSize = 40000;
        this.limitMinSize = [50, 50];
        this.fixed = true;
        this.fixedNumber = [1, 1];
        this.fillCover = '';
        this.canScale = true;
    }
}
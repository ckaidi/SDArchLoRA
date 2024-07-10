export class ImgData {
    public name: string;
    public base64: string;
    public projecttags: string[];
    public tags: string;
    public keyword: string;

    constructor(name: string, base64: string) {
        this.name = name;
        this.base64 = base64;
        this.projecttags = [];
        this.tags = '[]';
        this.keyword = '';
    }
}
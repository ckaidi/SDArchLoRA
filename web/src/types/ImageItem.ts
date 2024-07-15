export class ImageItem {
    public keyword: string[];
    public document_id: string;
    public name: string;
    public src: Src;
    public show: boolean;

    constructor(keyword: string[], name: string, document_id: string, url: string) {
        this.keyword = keyword;
        this.name = name;
        this.document_id = document_id;
        this.src = new Src(url);
        this.show = false;
    }
}

export class Src {
    public original: string

    constructor(url: string) {
        this.original = url;
    }
}
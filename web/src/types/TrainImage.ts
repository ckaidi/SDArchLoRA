export class TrainImage {
    public name: string;
    public url: string;
    public page: number;
    public indexInSearch: number;
    public keyword: string;
    public tags: string[];
    public base64: string;

    constructor(name: string, url: string, page: number, indexInSearch: number, keyword: string, base64: string) {
        this.name = name;
        this.url = url;
        this.page = page;
        this.indexInSearch = indexInSearch;
        this.keyword = keyword;
        this.tags = [];
        this.base64 = base64;
    }
}
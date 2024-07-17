export class TrainImage {
    public name: string;
    public url: string;
    public page: number;
    public indexInSearch: number;
    public keyword: string;
    public tags: string[];
    public large_base64: string = '';
    public show: boolean;
    public isSelected: boolean = false;

    constructor(name: string, url: string, page: number, indexInSearch: number, keyword: string) {
        this.name = name;
        this.url = url;
        this.page = page;
        this.indexInSearch = indexInSearch;
        this.keyword = keyword;
        this.tags = [];
        this.show = false;
    }
}
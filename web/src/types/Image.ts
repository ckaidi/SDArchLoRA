import {Tag} from "./Tag.ts";

export class Image {
    public name: string;
    public index: number;
    public url: string;
    public tags: any[];
    public searchTag: Tag[];
    public projectTag: Tag[];

    constructor(name?: string, index?: number, url?: string, tags?: any, searchTag?: Tag[], projectTag?: Tag[]) {
        if (name && index != undefined && url && tags && searchTag && projectTag) {
            // 全参数构造器
            this.name = name;
            this.index = index;
            this.url = url;
            this.tags = tags;
            this.searchTag = searchTag;
            this.projectTag = projectTag;
        } else {
            // 无参数构造器
            this.name = "";
            this.index = 0;
            this.url = "";
            this.tags = [];
            this.searchTag = [];
            this.projectTag = [];
        }
    }
}
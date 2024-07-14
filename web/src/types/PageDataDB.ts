import {PageImageDB} from "./PageImageDB.ts";

export class PageDataDB {
    public page: number;
    public images: PageImageDB[];

    constructor(page: number) {
        this.page = page;
        this.images = [];
    }
}
export class PageDataDB {
    public url_hash: string;
    public page: number;
    public images: PageDataDB[];

    constructor(url_hash: string, page: number) {
        this.url_hash = url_hash;
        this.page = page;
        this.images = [];
    }
}
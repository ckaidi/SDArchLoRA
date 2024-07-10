export class ImageDB {
    public url: string;
    public title: string;
    public document_id: string;
    public large_base: string;

    constructor(url: string, title: string, document_id: string, large_base?: string) {
        this.url = url;
        this.title = title;
        this.document_id = document_id;
        if (large_base)
            this.large_base = large_base;
        else
            this.large_base = "";
    }
}
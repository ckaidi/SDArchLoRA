export class ImageDB {
    public url: string;
    public title: string;
    public document_id: string;
    public large_base64: string;

    constructor(url: string, title: string, document_id: string, large_base64?: string) {
        this.url = url;
        this.title = title;
        this.document_id = document_id;
        if (large_base64)
            this.large_base64 = large_base64;
        else
            this.large_base64 = "";
    }
}
export class ImageDetailJson {
    public name: string;
    public url: string;
    public document_id: string;
    public page: number;

    constructor(name: string, url: string, document_id: string, page: number) {
        this.name = name;
        this.url = url;
        this.document_id = document_id;
        this.page = page;
    }
}
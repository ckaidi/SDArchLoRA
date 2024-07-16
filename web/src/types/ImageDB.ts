export class ImageDB {
    public url: string;
    public title: string;
    public document_id: string;
    public large_base64: string | null;
    public large_width: number | null;
    public large_height: number | null;

    constructor(url: string, title: string, document_id: string, large_base64: string | null = null, large_width: number | null = null, large_height: number | null = null) {
        this.url = url;
        this.title = title;
        this.document_id = document_id;
        this.large_base64 = large_base64;
        this.large_width = large_width;
        this.large_height = large_height;
    }
}
export class ImageDetailJson {
    public name: string;
    public url: string;
    public document_id: string;
    public page: number;
    public project: number;
    public is_last: boolean;

    constructor(name: string, url: string, document_id: string, page: number, project: number, isLast: boolean) {
        this.name = name;
        this.url = url;
        this.document_id = document_id;
        this.page = page;
        this.project = project;
        this.is_last = isLast;
    }
}
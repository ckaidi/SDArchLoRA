export class ImageItem {
    public keyword: string[];
    public document_id: string;
    public name: string;
    public src: string;
    public show: boolean;
    public isInTrain: boolean;
    public index: number;
    public project_name: string;

    constructor(keyword: string[], name: string, document_id: string, url: string, index: number, project_name: string) {
        this.keyword = keyword;
        this.name = name;
        this.document_id = document_id;
        this.src = url;
        this.index = index;
        this.show = false;
        this.isInTrain = false;
        this.project_name = project_name;
    }
}
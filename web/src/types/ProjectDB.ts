export class ProjectDB {
    public document_id: string;
    public createat: string;
    public updateat: string;
    public author: string;
    public bim: boolean;
    public categories: string;
    public document_type: string;
    public location: string;
    public meta_description: string;
    public offices: string;
    public photographers: string;
    public tags: string;
    public title: string;
    public url: string;
    public year: string;

    constructor(document_id: string, createat: string, updateat: string, author: string, bim: boolean, categories: string,
                document_type: string, location: string, meta_description: string, offices: string,
                photographers: string, tags: string, title: string, url: string, year: string) {
        this.document_id = document_id;
        this.createat = createat;
        this.updateat = updateat;
        this.author = author;
        this.bim = bim;
        this.categories = categories;
        this.document_type = document_type;
        this.location = location;
        this.meta_description = meta_description;
        this.offices = offices;
        this.photographers = photographers;
        this.tags = tags;
        this.title = title;
        this.url = url;
        this.year = year;
    }
}
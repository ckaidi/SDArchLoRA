import {PageDataDB} from "./PageDataDB.ts";

export class SearchDB {
    public name: string;
    public date: number;
    public page_count: number;
    public project_count: number;
    public pages_data: PageDataDB[];

    constructor(name: string, date: number, page_count: number, project_count: number) {
        this.name = name;
        this.date = date;
        this.page_count = page_count;
        this.project_count = project_count;
        this.pages_data = [];
    }
}
import {PageDataDB} from "./PageDataDB.ts";

export class SearchDB {
    public keyword: string;
    public date: number;
    public page_count: number;
    public project_count: number;
    public pages_data: PageDataDB[];

    constructor(keyword: string, date: number, page_count?: number, project_count?: number) {
        this.keyword = keyword;
        this.date = date;
        if (page_count)
            this.page_count = page_count;
        else
            this.page_count = 1;
        if (project_count)
            this.project_count = project_count;
        else
            this.project_count = 0;
        this.pages_data = [];
    }
}
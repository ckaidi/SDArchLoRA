export class ProjectData {
    public content: ProjectContentData;

    constructor() {
        this.content = new ProjectContentData();
    }
}

export class ProjectContentData {
    public author: string;
    public categories: string;
    public location: string;
    public meta_description: string;
    public offices: string;
    public tags: string;

    constructor() {
        this.author = '';
        this.categories = '';
        this.location = '';
        this.meta_description = '';
        this.offices = '';
        this.tags = '';
    }
}
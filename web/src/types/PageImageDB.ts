export class PageImageDB {
    public url_hash: string;
    public is_in_train: boolean;

    constructor(url_hash: string, is_in_train: boolean = false) {
        this.url_hash = url_hash;
        this.is_in_train = is_in_train;
    }
}
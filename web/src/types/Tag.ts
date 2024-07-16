// TODO 推测tag类型
export class Tag {
    public key: string;
    public tag: string;
    public color: string;
    public tagType: string;

    constructor(key: string, tag: string, color: string, tagType: string) {
        this.key = key;
        this.tag = tag;
        this.color = color;
        this.tagType = tagType;
    }
}
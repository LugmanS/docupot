export interface Document {
    _id: string;
    title: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    content: object;
    __v: number;
}
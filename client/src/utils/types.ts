export interface Document {
    _id: string;
    title: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    content: string;
    isPublic: boolean;
    allowedUsers: AllowedUser[];
    __v: number;
}

export enum AccessType {
    EDIT = 'EDIT',
    VIEW = 'VIEW',
    OWNER = 'OWNER'
}

export interface AllowedUser {
    userEmail: string;
    accessType: string;
}
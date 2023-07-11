import { Document, AccessType } from "./types.js";


export const getUserAccessType = (document, userEmail) => {
    if (document.authorId === userEmail) {
        return AccessType.OWNER;
    }
    const user = document.allowedUsers.filter((user) => user.userEmail === userEmail);
    if (!user) return "NOT_FOUND";
    return user[0].accessType;
}; 
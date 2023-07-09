import { Schema, model } from "mongoose";
import { AccessType } from "../types.js";

const allowedUserSchema = new Schema({
    userEmail: {
        type: String,
        required: true
    },
    accessType: {
        type: String,
        enum: ['READ_ONLY', 'EDIT', 'OWNER'],
        required: true
    }
});

const DocumentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    content: {
        type: Object,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    allowedUsers: [allowedUserSchema]
});


const Document = model('Document', DocumentSchema);
export default Document;
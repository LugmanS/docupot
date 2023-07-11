import { Schema, model } from "mongoose";

const allowedUserSchema = new Schema({
    userEmail: {
        type: String,
        required: true
    },
    accessType: {
        type: String,
        enum: ['READ_ONLY', 'VIEW', 'OWNER'],
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
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    allowedUsers: [allowedUserSchema]
});

DocumentSchema.index({ title: 'text', content: 'text' });


const Document = model('Document', DocumentSchema);
export default Document;
import { Schema, model } from "mongoose";

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
    }
});


const Document = model('Document', DocumentSchema);
export default Document;
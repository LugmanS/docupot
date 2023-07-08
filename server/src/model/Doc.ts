import { Schema, model } from "mongoose";

const DocumentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    }
});


const Document = model('Document', DocumentSchema);
export default Document;
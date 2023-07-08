import { Router } from "express";
import Document from "../model/Document.js";
const router = Router();

//Get all user documents
router.get("/", async (req, res) => {
    const { userId } = req.auth;
    if (!userId) {
        return res.sendStatus(401);
    }
    try {
        const documents = await Document.find({
            authorId: userId
        });
        res.status(200).json(documents);
    } catch (error) {
        console.log('Error while fetching documents for user:', userId, error);
        res.sendStatus(500);
    }
});

router.post("/", async (req, res) => {
    const { userId } = req.auth;
    if (!userId) {
        return res.sendStatus(401);
    }

    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Document title is required" });
    }
    try {
        const document = new Document({
            authorId: userId,
            title,
            content: "Awesome content"
        });
        const newDocument = await document.save();
        res.status(200).json(newDocument);
    } catch (error) {
        console.log('Error while creating document for user:', userId, error);
        res.sendStatus(500);
    }
});


export { router as DocumentRouter };
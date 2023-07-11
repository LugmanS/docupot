import { Router } from "express";
import Document from "../model/Document.js";
import { initialContent } from "../utils/constants.js";
import { getUserAccessType } from "../utils/helper.js";
import { sendEmail } from "./email.js";
const router = Router();

//Get all user documents
router.get("/", async (req, res) => {
    const { userId, claims } = req.auth;
    if (!userId || !claims.userEmail) {
        return res.sendStatus(401);
    }
    const { search } = req.query;
    try {
        if (!search) {
            const documents = await Document.find({
                $or: [
                    { authorId: claims.userEmail },
                    { allowedUsers: { $elemMatch: { userEmail: req.auth.claims.userEmail } } }
                ]
            });
            res.status(200).json(documents);
        } else {
            const documents = await Document.find({
                $and: [
                    { $or: [{ authorId: claims.userEmail }, { allowedUsers: { $elemMatch: { userEmail: req.auth.claims.userEmail } } }] },
                    { $text: { $search: `/${search.toString()}/`, $caseSensitive: false, $diacriticSensitive: false } }
                ]
            });
            res.status(200).json(documents);
        }
    } catch (error) {
        console.log('Error while fetching documents for user:', userId, error);
        res.sendStatus(500);
    }
});

router.get("/:documentId", async (req, res) => {
    const { userId, claims } = req.auth;
    if (!userId || !claims.userEmail) {
        return res.sendStatus(401);
    }
    const { userEmail } = claims;
    const { documentId } = req.params;

    try {
        const document = await Document.findById(documentId);
        if (!document) {
            return res.sendStatus(404);
        }
        if (!document.isPublic && document.authorId !== userEmail && document.allowedUsers.filter((user) => user.userEmail === userEmail).length === 0) {
            return res.sendStatus(403);
        }
        res.status(200).json(document);
    } catch (error) {
        console.log(`Error while getting details for document:${documentId}`);
        res.sendStatus(500);
    }
});

router.post("/", async (req, res) => {
    const { userId, claims } = req.auth;
    if (!userId || !claims.userEmail) {
        return res.sendStatus(401);
    }

    const { title, content } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Document title is required" });
    }
    try {
        const document = new Document({
            authorId: claims.userEmail,
            title,
            content: content ?? initialContent
        });
        const newDocument = await document.save();
        res.status(200).json(newDocument);
    } catch (error) {
        console.log('Error while creating document for user:', userId, error);
        res.sendStatus(500);
    }
});

router.put("/:documentId", async (req, res) => {
    const { documentId } = req.params;
    const { userId } = req.auth;
    if (!userId) {
        return res.sendStatus(401);
    }
    try {
        const document = await Document.findByIdAndUpdate(documentId, {
            title: req.body.title,
            isPublic: req.body.isPublic,
            allowedUsers: req.body.allowedUsers,
            updatedAt: Date.now()
        });
        res.status(200).json(document);
    } catch (error) {
        console.log('Error while updating document for user:', userId, error);
        res.sendStatus(500);
    }
});

router.post("/:documentId/request-access", async (req, res) => {
    const { documentId } = req.params;
    const { claims } = req.auth;
    if (!claims.userEmail) {
        return res.sendStatus(401);
    }
    const { userEmail } = req.body;
    try {
        const document = await Document.findById(documentId);
        if (!document) {
            return res.sendStatus(404);
        }
        const userAccessType = getUserAccessType(document, claims.userEmail);
        if (userAccessType !== 'VIEW') {
            return res.sendStatus(403);
        }
        res.sendStatus(201);
        sendEmail(userEmail, 'request-access', document);
    } catch (error) {
        console.log('Error while adding shared user for document:', documentId, error);
        res.sendStatus(500);
    }
});

router.post("/:documentId/share", async (req, res) => {
    const { documentId } = req.params;
    const { claims } = req.auth;
    if (!claims.userEmail) {
        return res.sendStatus(401);
    }
    const { userEmail, accessType } = req.body;
    try {
        const document = await Document.findById(documentId);
        if (!document) {
            return res.sendStatus(404);
        }
        const userAccessType = getUserAccessType(document, claims.userEmail);
        if (userAccessType !== 'OWNER') {
            return res.sendStatus(403);
        }
        document.allowedUsers.push({ userEmail, accessType });
        await document.save();
        res.status(200).json(document);
        sendEmail(userEmail, 'invited', document);
    } catch (error) {
        console.log('Error while adding shared user for document:', documentId, error);
        res.sendStatus(500);
    }
});

router.delete("/:documentId", async (req, res) => {
    const { documentId } = req.params;
    const { userId, claims } = req.auth;
    if (!userId || !claims.userEmail) {
        return res.sendStatus(401);
    }
    try {
        await Document.findByIdAndDelete(documentId);
        res.sendStatus(204);
    } catch (error) {
        console.log('Error while updating document for user:', userId, error);
        res.sendStatus(500);
    }
});


export { router as DocumentRouter };
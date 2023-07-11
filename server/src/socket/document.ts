import { Socket } from "socket.io";
import Document from "../model/Document.js";
import { AccessType } from "../utils/types.js";

export default function documentEventHandler(socket: Socket) {

    const join = documentId => socket.join(documentId);

    const updateDocumentContent = async (config: {
        documentId: string;
        content: string;
    }) => {
        try {
            await Document.findByIdAndUpdate(config.documentId, { content: config.content });
            socket.broadcast.to(config.documentId).emit("document:broadcastedChanges", config.content);
        } catch (error) {
            console.log('Error while updating', error);
        }
    };

    const sendBriefDocumentData = async (documentId) => {
        try {
            const document = await Document.findById(documentId);
            console.log('DocumentData', document);
            socket.emit('document:BriefData', document);
        } catch (error) {
            console.log(`Error while sending brief data for document:${documentId} Error:`, error);
            socket.emit("error", error);
        }
    };

    const addAllowedUser = async (config: {
        documentId: string;
        userEmail: string;
        accessType: AccessType;
    }) => {
        try {
            await Document.findByIdAndUpdate(config.documentId, {
                $addToSet: {
                    allowedUsers: [
                        {
                            userEmail: config.userEmail,
                            accessType: config.accessType
                        }
                    ]
                }
            });
            console.log(`Added allowed user:${config.userEmail} for document:${config.documentId}`);
        } catch (error) {
            socket.emit("error", error);
            console.log(`Error-updating permission documentId:${config.documentId}`, error);
        }
    };

    const removedAllowedUser = async (config: {
        documentId: string;
        allowedUserId: string;
    }) => {
        try {
            await Document.updateOne({ _id: config.documentId }, {
                $pull: {
                    allowedUsers: { _id: config.allowedUserId }
                }
            });
            console.log(`Added allowed user:${config.allowedUserId} for document:${config.documentId}`);
        } catch (error) {
            socket.emit("error", error);
            console.log(`Error-updating permission documentId:${config.documentId}`, error);
        }
    };

    socket.on("document:join", join);
    socket.on("document:saveChanges", updateDocumentContent);
    socket.on("document:broadcastChanges", updateDocumentContent);
    socket.on("document:getBriefData", sendBriefDocumentData);
    socket.on("document:addAllowedUser", addAllowedUser);
    socket.on("document:removedAllowedUser", removedAllowedUser);
}
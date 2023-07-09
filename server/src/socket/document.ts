import { Socket } from "socket.io";
import Document from "../model/Document.js";
import { AccessType } from "../types.js";

export default function documentEventHandler(socket: Socket) {
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

    socket.on("document:addAllowedUser", addAllowedUser);
    socket.on("document:removedAllowedUser", removedAllowedUser);
}
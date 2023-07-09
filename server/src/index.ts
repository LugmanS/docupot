import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
    ClerkExpressWithAuth,
    LooseAuthProp,
} from '@clerk/clerk-sdk-node';
import http from "http";
import cors from "cors";
import { DocumentRouter } from "./controller/Documents.js";
import Document from "./model/Document.js";
import documentEventHandler from "./socket/document.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    }
});
const PORT = process.env.PORT || 8000;

declare global {
    namespace Express {
        interface Request extends LooseAuthProp { }
    }
}

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.use('/api/v1/documents', ClerkExpressWithAuth(), DocumentRouter);


const onConnection = (socket) => {
    documentEventHandler(socket);
};

io.on('connection', onConnection);

io.on("connection", socket => {
    socket.on("get-document", async documentId => {
        console.log('Socket connected for documentId:', documentId);
        const document = await findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document", document.content);

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        });

        socket.on("save-document", async content => {
            await Document.findByIdAndUpdate(documentId, { content });
        });
    });
});

async function findOrCreateDocument(id) {
    const document = await Document.findById(id);
    return document;
}


server.listen(PORT, () => console.log('Server started and listening at port:', PORT));
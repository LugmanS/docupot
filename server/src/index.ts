import express from "express";
import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
    ClerkExpressRequireAuth,
    LooseAuthProp,
    verifyToken
} from '@clerk/clerk-sdk-node';
import http from "http";
import cors from "cors";
import { DocumentRouter } from "./controller/Documents.js";
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

app.use('/api/v1/documents', ClerkExpressRequireAuth(), DocumentRouter);


const onConnection = (socket: Socket) => {
    documentEventHandler(socket);
    socket.on("disconnect", () => console.log('Disconnected socket:', socket.id));
};

io.use(async (socket, next) => {
    try {
        await verifyToken(socket.handshake.auth.token, {
            secretKey: process.env.CLERK_SECRET_KEY,
            issuer: "https://equal-llama-73.clerk.accounts.dev"
        });
        console.log('Successful handshake for socket:', socket.id);
        next();
    } catch (error) {
        console.log(`Error while socket handshake:${error}`);
    }
});

io.on('connection', onConnection);

server.listen(PORT, () => console.log('Server started and listening at port:', PORT));
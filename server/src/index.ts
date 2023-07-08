import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
    ClerkExpressWithAuth,
    LooseAuthProp,
} from '@clerk/clerk-sdk-node';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

declare global {
    namespace Express {
        interface Request extends LooseAuthProp { }
    }
}

mongoose.connect(process.env.MONGODB_URI);

app.get("/test", ClerkExpressWithAuth(), async (req, res) => {
    console.log(req.auth);
    res.send({ message: "Hello" });
});


app.listen(PORT, () => console.log('Server started and listening at port:', PORT));
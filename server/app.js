// server/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import chatRoutes from "./routes/chat.routes.js";
import gmailRoutes from "./routes/gmail.routes.js";

const app = express();


app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());


app.use("/api/chat", chatRoutes);
app.use("/api/gmail", gmailRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

export default app;

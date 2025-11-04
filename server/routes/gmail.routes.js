import { Router } from "express";
import { getAuthUrl, handleOAuthCallback, fetchLatestEmails } from "../services/gmail.js";

const router = Router();

// 🔹 Step 1: Send Google login URL
router.get("/login", (req, res) => {
  const sessionId = req.query.sessionId || "guest"; // 👈 frontend or Postman sends this
  const url = getAuthUrl(sessionId);
  res.json({ url });
});

// 🔹 Step 2: Handle callback from Google
router.get("/callback", async (req, res, next) => {
  try {
    const { code, state: sessionId } = req.query; // 👈 Google sends sessionId in `state`
    await handleOAuthCallback(code, sessionId);
    res.send(`✅ Gmail connected successfully for ${sessionId}!`);
  } catch (err) {
    next(err);
  }
});

// 🔹 Step 3: Fetch latest 20 emails (manual testing endpoint)
router.get("/fetch", async (req, res, next) => {
  try {
    const sessionId = req.query.sessionId || "guest";
    const emails = await fetchLatestEmails(sessionId);
    res.json({ count: emails.length, emails });
  } catch (err) {
    next(err);
  }
});

export default router;

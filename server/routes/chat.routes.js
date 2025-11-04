import { Router } from "express";
import { complete } from "../services/llm.js";
import { fetchLatestEmails, getAuthUrl } from "../services/gmail.js";
import { classifyIntent } from "../utils/classifyIntent.js"; // ✅ new import

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { message, sessionId = "guest" } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // ✅ Use centralized intent classifier
    const intent = classifyIntent(message);

    // 1️⃣ For general (non-Gmail) messages
    if (intent === "general") {
      const reply = await complete(message);
      return res.json({ intent, reply });
    }

    // 2️⃣ For Gmail-related messages
    if (intent === "gmail") {
      try {
        const emails = await fetchLatestEmails(sessionId);

        const context = `
        You are an intelligent assistant that summarizes, analyzes mail and give resposnse according to the message.
        Use the following emails as context:

        Emails:
        ${JSON.stringify(emails, null, 2)}

        User message: "${message}"
        `;

        const reply = await complete(context);
        return res.json({ intent: "gmail", reply });

      } catch (err) {
        // 3️⃣ Handle missing Gmail connection
        if (err.message.includes("No Gmail tokens found")) {
          const authUrl = getAuthUrl(sessionId);
          return res.status(401).json({
            intent: "gmail",
            error: "No Gmail tokens found — please connect Gmail.",
            authUrl,
          });
        }

        console.error("💥 Gmail error:", err);
        return res.status(500).json({ error: "Internal server error." });
      }
    }
  } catch (err) {
    console.error("💥 Chat route error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

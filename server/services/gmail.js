import { google } from "googleapis";
import Redis from "ioredis";

// ✅ Initialize Redis
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));

// ✅ Google OAuth setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

// 🔹 Step 1: Generate Google login URL (includes sessionId)
export function getAuthUrl(sessionId) {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    state: sessionId, // 👈 Helps identify which user is connecting
  });
}

// 🔹 Step 2: Handle OAuth callback — store tokens in Redis
export async function handleOAuthCallback(code, sessionId) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // 💾 Save tokens in Redis (30-day expiry)
  await redis.set(
    `gmail_tokens:${sessionId}`,
    JSON.stringify(tokens),
    "EX",
    60 * 60 * 24 * 30 // 30 days
  );

  console.log(`✅ Tokens stored in Redis for ${sessionId}`);
  return tokens;
}

// 🔹 Step 3: Retrieve Gmail auth client from Redis
export async function getAuth(sessionId) {
  const tokenData = await redis.get(`gmail_tokens:${sessionId}`);
  if (!tokenData) throw new Error("❌ No Gmail tokens found — connect Gmail first.");

  const tokens = JSON.parse(tokenData);
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

// 🔹 Step 4: Fetch and cache latest 20 emails
export async function fetchLatestEmails(sessionId) {
  const cacheKey = `gmail:latest20:${sessionId}`;

  // 1️⃣ Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`📥 Using cached Gmail emails for ${sessionId}`);
    return JSON.parse(cached);
  }

  // 2️⃣ If no cache → fetch from Gmail API
  const auth = await getAuth(sessionId);
  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 20,
  });

  const messages = res.data.messages || [];
  const emails = [];

  for (const msg of messages) {
    const detail = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "metadata",
      metadataHeaders: ["Subject", "From", "Date"],
    });

    const headers = Object.fromEntries(
      detail.data.payload.headers.map((h) => [h.name, h.value])
    );

    emails.push({
      id: msg.id,
      subject: headers.Subject || "",
      from: headers.From || "",
      date: headers.Date || "",
      snippet: detail.data.snippet || "",
    });
  }

  // 3️⃣ Save to Redis for 15 minutes (900 seconds)
  await redis.set(cacheKey, JSON.stringify(emails), "EX", 900);
  console.log(`📤 Cached Gmail emails for ${sessionId} (15 minutes)`);

  return emails;
}

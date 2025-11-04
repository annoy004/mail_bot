const BASE_URL = "http://localhost:8000/api";

export async function sendMessage(message, sessionId) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });
  return res.json();
}

export async function getGmailAuthUrl(sessionId) {
  const res = await fetch(`${BASE_URL}/gmail/login?sessionId=${sessionId}`);
  return res.json();
}

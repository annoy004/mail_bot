// server/utils/classifyIntent.js
export function classifyIntent(text) {
  const t = text.toLowerCase();

  // 🧠 Gmail-related keywords
  const gmailKeywords = [
    "email", "gmail", "inbox", "unread", "mail",
    "from", "sender", "subject", "attachment",
    "roast", "summarize", "messages", "compose", "draft"
  ];

  // 🧠 Future: add more intent groups here
  const isGmailIntent = gmailKeywords.some(k => t.includes(k));

  return isGmailIntent ? "gmail" : "general";
}

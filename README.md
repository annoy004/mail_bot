# mail_bot

This README will:

* Impress interviewers 💼
* Clearly explain your project 🔥
* Include setup steps for both frontend & backend 🧩
* Be deployment-friendly 🚀

---

## 📧 Mail Bot — Intelligent Gmail Chat Assistant

> An AI-powered chat-based web application that connects with Gmail to help users **interact with their emails intelligently** — summarize, analyze, or roast them — all via a chat interface powered by an **LLM** (Gemini/OpenAI) and **Gmail API**.

---

### 🧠 **Overview**

Mail Bot allows users to have natural conversations with an AI assistant that understands Gmail context.
Users can:

* Chat normally (general questions)
* Request Gmail actions like:

  * “Show me my recent emails”
  * “Summarize unread emails”
  * “Roast my inbox 😂”
* Authorize Gmail securely via OAuth2
* Cache emails in Redis for faster responses

---

### 🚀 **Tech Stack**

#### **Frontend**

* ⚛️ React (Vite or CRA)
* 🎨 Tailwind CSS
* 💬 Lucide React Icons
* 🌈 Responsive, animated UI

#### **Backend**

* 🧩 Node.js + Express.js
* 🤖 LLM API (Gemini or OpenAI)
* 📬 Gmail API via Google OAuth2
* ⚡ Redis (email caching)
* 🧾 dotenv for environment variables

---

## 🗂️ Folder Structure

```
mail_bot/
├── server/
│   ├── routes/
│   │   ├── chat.routes.js
│   │   └── gmail.routes.js
│   ├── services/
│   │   ├── llm.js
│   │   └── gmail.js
│   ├── utils/
│   │   └── classifyIntent.js
│   ├── app.js
│   └── .env
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   └── MessageBubble.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ **Setup Instructions**

### 🪶 Prerequisites

Before running locally, make sure you have:

* Node.js ≥ 18
* Redis installed locally or via Docker
* A Google Cloud Project with Gmail API enabled
* A valid LLM API Key (Gemini/OpenAI)

---

## 🧩 1️⃣ Backend Setup

### Step 1 — Navigate to server

```bash
cd server
npm install
```

### Step 2 — Create `.env` file

```bash
PORT=8000
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/gmail/callback
REDIS_URL=redis://localhost:6379
```

### Step 3 — Start Redis

If you have Docker:

```bash
docker run -d -p 6379:6379 redis
```

### Step 4 — Start the backend

```bash
npm run dev
```

✅ Server runs at `http://localhost:8000`

---

## 💬 2️⃣ Frontend Setup

### Step 1 — Navigate to client

```bash
cd client
npm install
```

### Step 2 — Start the frontend

```bash
npm start
```

✅ App runs at `http://localhost:3000`

---

## 🔐 **Gmail OAuth2 Setup**

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create OAuth Client ID:

   * Type: **Web application**
   * Redirect URI:

     ```
     http://localhost:8000/api/gmail/callback
     ```
3. Copy **Client ID** and **Client Secret** into your `.env`
4. Visit:

   ```
   http://localhost:8000/api/gmail/login?sessionId=user123
   ```
5. Sign in → Allow → Gmail connected ✅

---

## 🧠 **How It Works**

### 🌍 User Flow:

```
Frontend (React)
   ↓
POST /api/chat
   ↓
Backend (Express)
   ↓
→ If normal query → Send to LLM → Respond
→ If Gmail query → Fetch via Gmail API (cached in Redis) → Send to LLM → Respond
```

---

### 💾 Redis Caching

Emails are cached for **15 minutes** to avoid re-fetching Gmail repeatedly.

| Cache Key                     | Description                     |
| ----------------------------- | ------------------------------- |
| `gmail:latest20:<session_id>` | Stores latest 20 fetched emails |

---

## 🎨 **UI Features**

* Clean modern chat layout
* Dynamic LLM + Gmail responses
* Animated message bubbles
* Gmail connect button (auto-generated on missing token)
* Loading animation while waiting for AI

---

## 🔥 **Example Queries**

| Type          | Example                    |
| ------------- | -------------------------- |
| General       | “Tell me a joke.”          |
| Gmail         | “Show my latest 5 emails.” |
| Summarization | “Summarize unread emails.” |
| Fun           | “Roast my inbox.”          |

---

## 🧰 **Scripts**

### Backend

```bash
# Start server
npm run dev
# Lint
npm run lint
```

### Frontend

```bash
# Start client
npm start
# Build for production
npm run build
```

---

## 🧑‍💻 **Developer Notes**

* Tokens are securely stored in **Redis** (not local files).
* Gmail access is via **OAuth2 consent screen**.
* Redis helps in reducing API costs and latency.
* `.env` and credentials are fully ignored from GitHub.

---

## 🔐 **Security Practices**

✅ `.gitignore` includes:

```
.env
gmail_tokens.json
google-vision-key.json
*.key.json
```

✅ Sensitive keys **never committed**.
✅ Push protection enabled on GitHub.

---

## 🧱 **Future Enhancements**

* 🧭 Add voice command support
* 📊 Visual email summary dashboard
* 📅 Calendar + Tasks integration
* 📦 Fine-grained AI context memory
* 🧠 Sentiment-based email prioritization

---

## 👨‍💻 Author

**Arnav Singh**
💻 Full Stack Developer | React • Node.js • AI Integrations
🌐 [GitHub](https://github.com/annoy004) • [LinkedIn](https://linkedin.com/in/arnav-singh)

---

## 🏁 License

This project is licensed under the **MIT License**.

---

Would you like me to include **example screenshots and a small "Tech Architecture Diagram" (LLM + Gmail + Redis flow)** in the README using Markdown (like `![Diagram](url)`)?
That makes the repo stand out instantly on GitHub.

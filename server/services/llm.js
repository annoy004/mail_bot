import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

/**
 * Sends a text message to Gemini and returns the model's response.
 * @param {string} message - The user's message to the LLM.
 */
export const complete = async (message) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) throw new Error("GEMINI_API_KEY not found in .env");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: message, // 👈 send the user's actual message
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini API Error:", data);
    throw new Error(`Gemini API error: ${data.error?.message}`);
  }

  // Extract the model’s response text
  const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  return outputText || "No response from Gemini model.";
};

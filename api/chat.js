import { callGemini } from "../lib/gemini.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const { contents } = req.body;

  if (!contents || !Array.isArray(contents) || contents.length === 0) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  try {
    const { status, data } = await callGemini(req.body, API_KEY);
    res.status(status).json(data);
  } catch {
    res.status(500).json({ error: "Internal server error." });
  }
}

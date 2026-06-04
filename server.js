import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"] }));
app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again in a minute." },
});
app.use("/api/chat", limiter);

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/chat", async (req, res) => {
  const { contents } = req.body;

  if (!contents || !Array.isArray(contents) || contents.length === 0) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(30000),
      }
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));

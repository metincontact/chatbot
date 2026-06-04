import { useState, useEffect } from "react";
import type { Message } from "../types";

const STORAGE_KEY = "chat_messages";
const MAX_CONTEXT = 10;

async function callApi(
  contents: { role: string; parts: { text: string }[] }[],
  retries = 3,
  delay = 1000
): Promise<unknown> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: { maxOutputTokens: 2048 },
    }),
  });

  if (response.status === 429 && retries > 0) {
    await new Promise((r) => setTimeout(r, delay));
    return callApi(contents, retries - 1, delay * 2);
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

interface ApiResponse {
  candidates?: { content: { parts: { text: string }[] } }[];
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Message[]) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (messages.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    } catch {
    }
  }, [messages]);

  async function sendMessage(inputText: string): Promise<void> {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      message: inputText,
      sender: "user",
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    const contents = [
      ...messages.slice(-MAX_CONTEXT).map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.message }],
      })),
      { role: "user", parts: [{ text: inputText }] },
    ];

    try {
      const data = (await callApi(contents)) as ApiResponse;
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I could not generate a response.";

      setMessages([
        ...newMessages,
        {
          message: reply,
          sender: "robot",
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error && error.message.includes("429")
          ? "Too many requests. Please wait a moment and try again."
          : "Something went wrong. Please try again.";

      setMessages([
        ...newMessages,
        {
          message,
          sender: "robot",
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat(): void {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return { messages, loading, sendMessage, clearChat };
}

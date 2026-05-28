import { useState } from "react";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export function ChatInput({ chatMessages, setChatMessages }) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  function saveInputText(event) {
    setInputText(event.target.value);
  }

  async function sendMessage() {
    if (!inputText.trim() || loading) return;

    const userMessage = {
      message: inputText,
      sender: "user",
      id: crypto.randomUUID(),
    };

    const newMessages = [...chatMessages, userMessage];
    const currentInput = inputText;
    setChatMessages(newMessages);
    setInputText("");
    setLoading(true);

    const history = chatMessages.slice(-10).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.message }],
    }));

    async function callApi(retries = 3, delay = 1000) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              ...history,
              { role: "user", parts: [{ text: currentInput }] },
            ],
            generationConfig: { maxOutputTokens: 1000 },
          }),
        },
      );

      if (response.status === 429 && retries > 0) {
        await new Promise((r) => setTimeout(r, delay));
        return callApi(retries - 1, delay * 2);
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    }

    try {
      const data = await callApi();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I could not generate a response.";

      setChatMessages([
        ...newMessages,
        { message: reply, sender: "robot", id: crypto.randomUUID() },
      ]);
    } catch (error) {
      const message = error.message.includes("429")
        ? "Too many requests. Please wait a moment and try again."
        : "Something went wrong. Please try again.";

      setChatMessages([
        ...newMessages,
        { message, sender: "robot", id: crypto.randomUUID() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") sendMessage();
  }

  return (
    <div className="px-4 py-4 border-t border-slate-700 flex gap-3 items-center">
      <input
        placeholder={loading ? "Thinking..." : "Type a message..."}
        onChange={saveInputText}
        onKeyDown={handleKeyDown}
        value={inputText}
        disabled={loading}
        className="flex-1 bg-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-60"
      />
      <button
        onClick={sendMessage}
        disabled={loading || !inputText.trim()}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl text-sm font-medium transition"
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}

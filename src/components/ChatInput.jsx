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
    setChatMessages(newMessages);
    setInputText("");
    setLoading(true);

    try {
      const history = chatMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.message }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              ...history,
              { role: "user", parts: [{ text: inputText }] },
            ],
            generationConfig: {
              maxOutputTokens: 1000,
            },
          }),
        },
      );

      const data = await response.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I could not generate a response.";

      setChatMessages([
        ...newMessages,
        {
          message: reply,
          sender: "robot",
          id: crypto.randomUUID(),
        },
      ]);
    } catch {
      setChatMessages([
        ...newMessages,
        {
          message: "Something went wrong. Please try again.",
          sender: "robot",
          id: crypto.randomUUID(),
        },
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

import { useState } from "react";
import ReactMarkdown from "react-markdown";

function formatTime(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessage({ message, sender, timestamp }) {
  const [copied, setCopied] = useState(false);
  const isUser = sender === "user";

  async function handleCopy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`group flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
          isUser ? "bg-blue-600" : "bg-slate-600"
        }`}
        aria-hidden="true"
      >
        {isUser ? "👤" : "🤖"}
      </div>

      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-slate-700 text-slate-100 rounded-bl-sm"
          }`}
        >
          {isUser ? (
            message
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-2 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          {timestamp && (
            <span className="text-slate-500 text-xs">{formatTime(timestamp)}</span>
          )}
          <button
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : "Copy message"}
            className="text-slate-600 hover:text-slate-400 text-xs opacity-0 group-hover:opacity-100 transition"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import type { Message } from "../types";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  onSuggestion: (text: string) => void;
}

const SUGGESTIONS = [
  "Explain React hooks in simple terms",
  "Write a Python function to sort a list",
  "Difference between == and === in JavaScript",
];

export function ChatMessages({ messages, loading, onSuggestion }: ChatMessagesProps) {
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerElem = chatMessagesRef.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div
      ref={chatMessagesRef}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-relevant="additions"
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-none"
    >
      {messages.length === 0 && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-8">
          <div className="text-center">
            <div className="text-5xl mb-3" aria-hidden="true">🤖</div>
            <h2 className="text-white font-semibold text-lg">How can I help you?</h2>
            <p className="text-slate-400 text-sm mt-1">Ask me anything.</p>
          </div>
          <div className="flex flex-col gap-2 w-full max-w-sm">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSuggestion(suggestion)}
                className="text-left text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 px-4 py-3 rounded-xl transition h-12 flex items-center"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <ChatMessage
          message={msg.message}
          sender={msg.sender}
          timestamp={msg.timestamp}
          key={msg.id}
        />
      ))}

      {loading && (
        <div className="flex items-end gap-2" aria-label="AI is typing">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm shrink-0" aria-hidden="true">
            🤖
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-slate-700">
            <span className="typing-indicator" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

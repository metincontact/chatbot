import { useState } from "react";

interface ChatInputProps {
  loading: boolean;
  onSend: (text: string) => void;
}

export function ChatInput({ loading, onSend }: ChatInputProps) {
  const [inputText, setInputText] = useState("");

  function handleSubmit() {
    if (!inputText.trim() || loading) return;
    onSend(inputText);
    setInputText("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function handleInput(event: React.FormEvent<HTMLTextAreaElement>) {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = Math.min(target.scrollHeight, 128) + "px";
  }

  return (
    <div className="px-4 py-4 border-t border-slate-700 flex gap-3 items-end">
      <label htmlFor="chat-input" className="sr-only">
        Message
      </label>
      <textarea
        id="chat-input"
        rows={1}
        placeholder={loading ? "Thinking..." : "Message..."}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        value={inputText}
        disabled={loading}
        aria-label="Type your message"
        className="flex-1 bg-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-60 resize-none overflow-hidden"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !inputText.trim()}
        aria-label="Send message"
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl text-sm font-medium transition flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <span>Sending</span>
          </>
        ) : (
          "Send"
        )}
      </button>
    </div>
  );
}

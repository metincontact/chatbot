import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";

export function ChatMessages({ chatMessages, loading }) {
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const containerElem = chatMessagesRef.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }
  }, [chatMessages, loading]);

  return (
    <div
      ref={chatMessagesRef}
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-none"
    >
      {chatMessages.length === 0 && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 text-sm">
            Send a message to start chatting
          </p>
        </div>
      )}
      {chatMessages.map((chatMessage) => (
        <ChatMessage
          message={chatMessage.message}
          sender={chatMessage.sender}
          key={chatMessage.id}
        />
      ))}
      {loading && (
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm shrink-0">
            🤖
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-slate-700">
            <span className="typing-indicator">
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

import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";

export function ChatMessages({ chatMessages }) {
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const containerElem = chatMessagesRef.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div
      ref={chatMessagesRef}
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-none"
    >
      {chatMessages.length === 0 && (
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
    </div>
  );
}

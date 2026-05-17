import { useState } from "react";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";

function App() {
  const [chatMessages, setChatMessages] = useState([]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[85vh] flex flex-col bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-700 px-6 py-4 flex items-center gap-3 border-b border-slate-600">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg">
            🤖
          </div>
          <div>
            <h1 className="text-white font-semibold">AI Assistant</h1>
            <p className="text-green-400 text-xs">Online</p>
          </div>
        </div>

        {/* Messages */}
        <ChatMessages chatMessages={chatMessages} />

        {/* Input */}
        <ChatInput
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        />
      </div>
    </div>
  );
}

export default App;

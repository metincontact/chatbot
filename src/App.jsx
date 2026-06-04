import { useChat } from "./hooks/useChat";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";

function App() {
  const { messages, loading, sendMessage, clearChat } = useChat();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[85vh] flex flex-col bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <header className="bg-slate-700 px-6 py-4 flex items-center gap-3 border-b border-slate-600">
          <div
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg"
            aria-hidden="true"
          >
            🤖
          </div>
          <div>
            <h1 className="text-white font-semibold">AI Assistant</h1>
            <p className="text-green-400 text-xs" aria-live="polite">
              {loading ? "Thinking..." : "Online"}
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              aria-label="Clear chat history"
              className="ml-auto text-slate-400 hover:text-red-400 text-xs transition"
            >
              Clear chat
            </button>
          )}
        </header>

        <ChatMessages messages={messages} loading={loading} onSuggestion={sendMessage} />
        <ChatInput loading={loading} onSend={sendMessage} />
      </div>
    </div>
  );
}

export default App;

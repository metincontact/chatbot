import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";

SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("jsx", jsx);

function formatTime(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const markdownComponents = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    if (!inline && match) {
      return (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="rounded-lg text-sm my-2"
          customStyle={{ overflowX: "auto", maxWidth: "100%" }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    }
    return (
      <code className="bg-slate-900 text-blue-300 px-1.5 py-0.5 rounded text-sm" {...props}>
        {children}
      </code>
    );
  },
};

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

      <div className={`flex flex-col gap-1 ${isUser ? "max-w-[75%] items-end" : "max-w-[85%] items-start"}`}>
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
            <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:text-slate-100 prose-headings:text-sm prose-headings:font-semibold prose-h1:text-base prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown components={markdownComponents}>{message}</ReactMarkdown>
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

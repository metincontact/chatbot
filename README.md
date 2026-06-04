# AI Chatbot

A chatbot app built with React, powered by Google Gemini 2.5 Flash.

## Live Demo

https://metin-chatbot.vercel.app

## Features

- Real-time conversation with Gemini 2.5 Flash
- Markdown rendering in AI responses (code blocks, lists, bold, etc.)
- Typing indicator while waiting for a reply
- Multiline input with Shift+Enter
- Conversation history preserved across page refreshes (localStorage)
- Message timestamps and one-click copy
- Suggested prompts on the welcome screen
- Rate limiting on the backend (20 requests/minute)
- Error boundary — app recovers gracefully from unexpected errors
- Accessible: ARIA labels, live regions, keyboard navigation

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Google Gemini API (gemini-2.5-flash)
- Express (backend proxy to keep the API key server-side)

## Running Locally

```bash
git clone https://github.com/metincontact/chatbot.git
cd chatbot
npm install
```

Create a `.env` file in the root:

```
GEMINI_API_KEY=your_api_key_here
```

Start both the Vite dev server and Express backend together:

```bash
npm start
```

App runs at `http://localhost:5173`. The Express server runs on port `3001` and proxies all Gemini API calls so the key is never exposed in the browser.

## Project Structure

```
src/
├── components/
│   ├── ChatInput.jsx      # Message input with auto-resize textarea
│   ├── ChatMessage.jsx    # Single message bubble with copy + timestamp
│   ├── ChatMessages.jsx   # Scrollable message list + welcome screen
│   └── ErrorBoundary.jsx  # Catches runtime errors gracefully
├── hooks/
│   └── useChat.js         # All chat state, API logic, localStorage
├── App.jsx
└── main.jsx
server.js                  # Express API proxy with CORS + rate limiting
```

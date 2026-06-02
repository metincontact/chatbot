# Chatbot

A chatbot app built with React, powered by Google Gemini.

## Live Demo

https://metin-chatbot.vercel.app

## Features

- Real-time conversation with Gemini 2.5 Flash
- Markdown rendering in AI responses
- Typing indicator while waiting for a reply
- Multiline input with Shift+Enter
- Last 10 messages sent as context
- Clear chat button

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Google Gemini API
- Express (backend proxy to protect the API key)

## Running Locally

Clone the repo and install dependencies:

```bash
git clone https://github.com/metincontact/chatbot.git
cd chatbot
npm install
```

Create a `.env` file in the root:

```
GEMINI_API_KEY=your_api_key_here
```

Start both servers with one command:

```bash
npm start
```

App runs at `http://localhost:5173`. The Express backend runs on port 3001 and handles all Gemini API calls so the key is never exposed in the browser.

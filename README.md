# Chatbot

A chat interface built with React and the Gemini API. Conversations are stored in localStorage so they persist between page refreshes.

## Stack

- **React 19** + **TypeScript**
- **Vite** for bundling
- **Tailwind CSS** for styling
- **Express** backend to proxy API requests (keeps the API key off the client)
- **Vitest** + Testing Library for tests

## Getting started

You'll need a [Gemini API key](https://aistudio.google.com/app/apikey).

```bash
# Install dependencies
npm install

# Copy the example env file and fill in your key
cp .env.example .env

# Start both the frontend and backend
npm start
```

The app runs at `http://localhost:5173`, the backend at `http://localhost:3001`.

## Scripts

```bash
npm start          # dev frontend + backend together
npm test           # run tests
npm run build      # production build
npm run lint       # ESLint
npm run typecheck
```

## Deploying to Vercel

The `api/chat.js` file is a Vercel serverless function — deploying the repo to Vercel should work out of the box. Just set `GEMINI_API_KEY` in your project's environment variables.

## Project structure

```
src/
  components/
    ChatInput.tsx      # textarea + send button
    ChatMessage.tsx    # renders a single message (markdown + syntax highlighting)
    ChatMessages.tsx   # message list + typing indicator
    ErrorBoundary.tsx
  hooks/
    useChat.ts         # all state logic, API calls, localStorage
  types.ts
lib/
  gemini.js            # shared Gemini fetch logic
server.js              # Express proxy for local development
api/chat.js            # Vercel serverless function
```

## Notes

- Rate limiting is handled on the backend (20 req/min). The client retries automatically on 429s with exponential backoff.
- Context sent to the API is capped at the last 10 messages to keep token usage reasonable.
- Syntax highlighting supports JS, TS, Python, Bash, CSS, JSON, and JSX.

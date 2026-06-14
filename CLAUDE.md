# Chatbot — Claude Code Context

## What this is
A React + TypeScript chatbot using the Gemini 2.5 Flash API. Part of a React course project.

## Running locally
```
npm start        # frontend (5173) + backend (3001) together
npm test
npm run lint
npm run typecheck
```

Requires `.env` with `GEMINI_API_KEY`.

## Architecture
- `src/hooks/useChat.ts` — all state, API calls, localStorage persistence
- `src/components/` — purely presentational; no logic
- `lib/gemini.js` — shared Gemini fetch logic used by both server.js and api/chat.js
- `server.js` — Express proxy for local dev (keeps API key off client)
- `api/chat.js` — Vercel serverless function

## Key decisions
- Context capped at last 10 messages before each API call
- 429 retries handled client-side with exponential backoff (3 retries, starts at 1s)
- localStorage synced via useEffect; cleared when messages array empties
- `PrismLight` used instead of full Prism to reduce bundle size
- ESLint config has a separate Node.js block for `server.js`, `api/**/*.js`, and `lib/**/*.js`
- `Message` type uses `text` field (not `message`) to avoid `msg.message` awkwardness

## What's clean
- TypeScript: no errors
- ESLint: no errors
- Tests: 26/26 passing (Vitest + Testing Library)
- No comments in source except where non-obvious

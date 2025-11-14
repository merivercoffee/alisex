# alisex

Production-ready Next.js 15 + TypeScript + Tailwind starter with a minimal OpenAI (ChatGPT) chat demo.

Features
- Next.js 15 (App Router) + TypeScript (strict)
- Tailwind CSS
- ESLint + Prettier + EditorConfig
- Vitest + React Testing Library (basic tests included)
- OpenAI Chat API integration via server route
- Dockerfile and docker-compose for local dev
- GitHub Actions CI (lint, format check, typecheck, test, build)

Requirements
- Node.js 20.x LTS
- pnpm (recommended). If missing, enable via corepack: corepack enable

Getting started
1) Clone the repo and install dependencies
   pnpm install

2) Configure environment variables
   - Copy .env.example to .env
   - Set OPENAI_API_KEY to your OpenAI API key
   - Optionally set OPENAI_MODEL (defaults to gpt-4o-mini)

3) Run the dev server
   pnpm dev
   Open http://localhost:3000

4) Try the chat demo
   - Navigate to http://localhost:3000/chat
   - Send a message and you should see a model reply if OPENAI_API_KEY is set

Scripts
- pnpm dev: Start Next.js dev server
- pnpm build: Build the app
- pnpm start: Start the production server
- pnpm lint: Run ESLint
- pnpm format: Format code with Prettier
- pnpm format:check: Verify formatting
- pnpm typecheck: Run TypeScript type checking
- pnpm test: Run unit tests

OpenAI integration
- Server route: POST /api/chat
  Request body: { messages: Array<{ role: 'system'|'user'|'assistant', content: string }> }
  Success response: { content: string }
  - Reads API key from OPENAI_API_KEY and model from OPENAI_MODEL (default gpt-4o-mini)
  - Returns 400 if the key is missing or the request body is invalid
  - Currently non-streaming; TODO: add SSE streaming in a future version

Project structure
- src/app: App Router pages and API routes
  - src/app/api/chat/route.ts: Chat API endpoint
  - src/app/chat/page.tsx: Chat UI demo
- src/lib/openai.ts: OpenAI client and env validation helper
- src/styles/globals.css: Tailwind styles

Docker
- Build production image
  docker build -t alisex .

- Run in development with docker-compose
  docker-compose -f docker-compose.dev.yml up --build

CI
- GitHub Actions workflow runs on push and PR to main: install, lint, format check, typecheck, test, and build

Environment variables
- OPENAI_API_KEY: Your OpenAI API key (required)
- OPENAI_MODEL: Model name (optional, default: gpt-4o-mini)

Notes
- API key is used on the server only; it is never exposed to the client.
- Keep dependencies minimal; TypeScript is set to strict for better safety.

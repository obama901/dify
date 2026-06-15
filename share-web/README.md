# Dify Share Web

This is a standalone extraction of Dify's public share frontend. It contains the web app routes used by published chat, chatbot, completion, workflow, webapp sign-in, and webapp password reset pages.

## Run

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

`.env.example` is only a template. Runtime values must be placed in `.env.local` or exported in the shell before starting Next.js. Restart the dev server after changing any `NEXT_PUBLIC_*` value.

Open the published share routes, for example:

- `http://localhost:3000/chat/{token}`
- `http://localhost:3000/chatbot/{token}`
- `http://localhost:3000/completion/{token}`
- `http://localhost:3000/workflow/{token}`

## Environment

- `NEXT_PUBLIC_API_PREFIX`: console API base URL.
- `NEXT_PUBLIC_PUBLIC_API_PREFIX`: public web app API base URL.
- `NEXT_PUBLIC_BASE_PATH`: optional deployment base path.

The project vendors the Dify UI, contract, and icon packages under `packages/` and references them through local `file:` dependencies so it can be moved and run independently from the original monorepo.

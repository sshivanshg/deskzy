# Deskzy

Global file toolkit — PDF, image, and text utilities in one clean workspace.
Most tools run in the browser. The URL shortener uses a Go API built for speed.

**Site:** [deskzy.xyz](https://deskzy.xyz)

## Stack

- **apps/web** — Next.js 15 (App Router), Tailwind, client-side processors
- **services/api** — Go + Chi short-link API (memory store for local; Valkey-ready)
- Architecture notes: see Cursor canvas `deskzy-scale-architecture`

## Quick start

```bash
# Terminal 1 — Go API
cd services/api
go run ./cmd/api

# Terminal 2 — Web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

URL shortener calls `/deskzy-api/v1/links` (proxied to Go on `:8080`).

## Tools included

PDF: merge, split, compress, reorder, PDF→images  
Image: compress, resize, convert, WebP→PNG  
Text: JSON, Base64, hash, UUID, QR, URL shortener, encode, word count, case, markdown, password  
Media: Video→MP3 placeholder (ffmpeg.wasm next)

## Scripts

| Command | What |
|---------|------|
| `npm run dev` | Next.js on :3000 |
| `npm run dev:api` | Go API on :8080 |
| `npm run build` | Production web build |
| `npm run build:api` | Compile Go binary |

## Privacy

Browser tools never upload files. Hybrid tools (URL shortener) only send the URL string to the API.

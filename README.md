# Deskzy

Global file toolkit — PDF, image, and text utilities in one clean workspace.
Most tools run in the browser. URL shortening uses Cloudflare KV via the Next.js API.

**Site:** [deskzy.xyz](https://deskzy.xyz) · **Preview:** [deskzy.sshivanshg.workers.dev](https://deskzy.sshivanshg.workers.dev)

## Stack

- **apps/web** — Next.js 15 (App Router) on **Cloudflare Workers** via OpenNext
- **services/api** — Go + Chi short-link API (optional local; production uses Next `/api` + KV)
- Short links stored in Cloudflare KV (`LINKS`)

## Quick start (local)

```bash
# Web (Next.js)
npm install
npm run dev

# Optional: Go API (only if testing /deskzy-api proxy)
cd services/api && go run ./cmd/api
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Cloudflare)

```bash
# One-time: wrangler login
npm run deploy:web
```

This builds with OpenNext and deploys the `deskzy` Worker (custom domains `deskzy.xyz` / `www.deskzy.xyz`, plus `*.workers.dev`).

### DNS cutover (required for apex)

The Cloudflare zone is created but **pending** until the registrar nameservers point at Cloudflare.

At your registrar (currently GoDaddy / DomainControl), set nameservers to:

- `adrian.ns.cloudflare.com`
- `leonidas.ns.cloudflare.com`

Then remove `deskzy.xyz` from the Vercel project domains so Vercel is no longer an origin.

Until NS propagate, use https://deskzy.sshivanshg.workers.dev

### Workers Builds (optional CI)

In Cloudflare Dashboard → Workers & Pages → `deskzy` → Settings → Builds:

- Connect GitHub repo `sshivanshg/deskzy`
- Root directory: repo root
- Build command: `npm install && npm run deploy -w @deskzy/web`  
  (or OpenNext `upload` if you prefer version upload without immediate promote)

## Tools included

PDF: merge, split, compress, reorder, PDF→images  
Image: compress, resize, convert, WebP→PNG  
Text: JSON, Base64, hash, UUID, QR, URL shortener, encode, word count, case, markdown, password  
Media: Video→MP3 placeholder (ffmpeg.wasm next)

## Scripts

| Command | What |
|---------|------|
| `npm run dev` | Next.js on :3000 |
| `npm run build` | Next production build |
| `npm run deploy:web` | OpenNext build + Cloudflare deploy |
| `npm run preview:web` | OpenNext preview in workerd |
| `npm run dev:api` | Go API on :8080 |
| `npm run build:api` | Compile Go binary |

## Privacy

Browser tools never upload files. The URL shortener only sends the URL string to the API (KV-backed on Cloudflare).

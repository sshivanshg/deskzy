# SEO + Guides growth track

**Date:** 2026-07-29  
**Status:** Approved for implementation  
**Product:** Deskzy (`apps/web`)

## Problem

Tool pages exist with metadata and SEO bodies, but many tools still use thin generic copy, the sitemap is a static partial list, and there are no long-tail guide pages that answer “how do I…” queries and funnel into tools.

## Goals

1. Every `/tools/[slug]` has custom SEO copy (intro, steps, privacy, 4–6 FAQs) and strong titles/descriptions/aliases.
2. Ship a `/guides` system with first-batch how-to articles that CTA into tools.
3. Dynamic sitemap covering home, about, privacy, terms, categories, all tools, all guides.
4. Cross-link tools ↔ guides; expose guides in footer.
5. Structured data for tools (SoftwareApplication + FAQ) and guides (Article/HowTo + FAQ).

## Non-goals

- Headless CMS
- Paid ads / outreach campaigns
- Full blog CMS UX
- Redesigning tool workspaces
- `llms.txt` / AI suggestion track (follow-up)

## Architecture

- **Tool SEO:** keep `registry.ts` + `tool-content.ts` + `ToolSeoBody` (typed overrides for every slug).
- **Guides:** typed TS modules in `lib/seo/guides.ts` with Markdown bodies rendered via existing `marked` (no MDX / no new deps — Cloudflare-friendly).
- **Routes:** `/guides` index, `/guides/[slug]` article.
- **Sitemap:** Next.js `app/sitemap.ts`; remove stale `public/sitemap.xml`.

## Guide frontmatter shape

```ts
type Guide = {
  slug: string;
  title: string;
  description: string;
  toolSlug: string; // primary CTA tool
  relatedToolSlugs?: string[];
  keywords: string[];
  publishedAt: string; // ISO date
  updatedAt?: string;
  faqs: { q: string; a: string }[];
  body: string; // Markdown
};
```

## First-batch guides (7)

| Slug | Primary tool |
| --- | --- |
| `compress-pdf-for-email` | compress-pdf |
| `merge-pdf-without-uploading` | merge-pdf |
| `free-url-shortener-no-signup` | url-shortener |
| `compress-image-for-whatsapp` | compress-image |
| `create-qr-code-from-url` | qr-code |
| `whatsapp-click-to-chat-link` | whatsapp-link |
| `utm-campaign-url-builder` | utm-builder |

## Tool page polish

Custom `OVERRIDES` for all tools. Registry titles/descriptions/aliases upgraded for intent keywords. ToolSeoBody adds “Guides” section when guides target that tool.

## Success criteria

- `/guides` and each guide return 200 with H1, CTA to tool, FAQ.
- Sitemap lists every tool + guide + category.
- No tool page uses generic fallback SEO in production.
- e2e covers guides index, one guide, sitemap contains a guide URL.

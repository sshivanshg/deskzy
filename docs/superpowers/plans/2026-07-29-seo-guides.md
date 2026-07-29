# SEO + Guides Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Polish every tool SEO page and ship a `/guides` system with 7 how-to articles, dynamic sitemap, and cross-links.

**Architecture:** Typed guide registry + Markdown via `marked`; tool SEO overrides in `tool-content.ts`; Next.js `app/sitemap.ts`.

**Tech Stack:** Next.js 15 App Router, existing `marked`, TypeScript content modules (no MDX).

## Global Constraints

- No new CMS or MDX dependency
- Privacy wedge copy must stay accurate (browser vs hybrid shortener)
- Match existing Deskzy visual language (no new card-heavy layouts)

---

### Task 1: Guides registry + JSON-LD helpers

**Files:**
- Create `apps/web/src/lib/seo/guides.ts`
- Modify `apps/web/src/lib/seo/json-ld.ts`

- [x] Add `Guide` type + `GUIDES` array (7 guides with markdown bodies)
- [x] Helpers: `getGuide`, `getGuidesForTool`, `getAllGuides`
- [x] `buildGuideJsonLd(guide)` → Article + FAQPage

### Task 2: Guide routes

**Files:**
- Create `apps/web/src/app/guides/page.tsx`
- Create `apps/web/src/app/guides/[slug]/page.tsx`
- Create `apps/web/src/components/GuideArticle.tsx` (optional if page stays small)

- [x] Index lists all guides with links
- [x] Detail: metadata, H1, rendered markdown, CTA to tool, FAQ, related tools
- [x] `generateStaticParams` for guide slugs

### Task 3: Dynamic sitemap

**Files:**
- Create `apps/web/src/app/sitemap.ts`
- Delete `apps/web/public/sitemap.xml`

- [x] Include home, about, privacy, terms, guides index, categories, tools, guides
- [x] Include links category + missing link tools (utm, whatsapp, bio)

### Task 4: Full tool SEO overrides

**Files:**
- Modify `apps/web/src/lib/seo/tool-content.ts`
- Modify `apps/web/src/lib/tools/registry.ts` (aliases / titles where thin)

- [x] Custom OVERRIDES for every tool slug
- [x] Fallbacks remain only as safety net

### Task 5: Cross-links + footer

**Files:**
- Modify `apps/web/src/components/ToolSeoBody.tsx`
- Modify `apps/web/src/components/SiteFooter.tsx`

- [x] “Guides” section on tool pages
- [x] Footer link to `/guides`

### Task 6: e2e

**Files:**
- Modify `apps/web/e2e/navigation.spec.ts`

- [x] Assert `/guides`, one guide page, sitemap contains guide URL
  (tests added; Playwright browsers not installed in this environment — run `npx playwright install` then `npm run test:e2e -w @deskzy/web`)
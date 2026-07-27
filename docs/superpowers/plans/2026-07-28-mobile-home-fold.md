# Mobile Home Fold-First Launcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Deskzy mobile homepage into a shortener-first compact launcher (dock + search + category chips + Popular strip) while leaving the desktop homepage layout intact.

**Architecture:** Add a client `HomeShortenDock` that calls existing `shortenUrl(url, "/api")` and shows an inline success state. Restructure `apps/web/src/app/page.tsx` with a mobile-only launcher (`md:hidden`) and keep today’s multi-section layout under `hidden md:block` (or equivalent). Reuse `HomeSearch` and `getPopularTools()`; add a compact horizontal Popular strip for mobile only.

**Tech Stack:** Next.js App Router, React client components, Tailwind CSS v4, Phosphor icons, Playwright e2e, existing `/api/links` route via `shortenUrl`.

## Global Constraints

- Mobile-only visual change; desktop (≥ `md`) keeps hero, featured banner, use cases, popular grid, browse-by-category.
- Shortener dock must use `shortenUrl` from `@/lib/tools/text` with api base `"/api"` — no duplicated fetch logic.
- No new backend endpoints.
- Keep an H1 in the document for SEO (visually hidden on mobile is OK).
- No emojis in UI copy.
- Follow existing Deskzy tokens (`--accent`, `--accent-soft`, shell patterns) — no purple AI gradients.
- Spec: `docs/superpowers/specs/2026-07-28-mobile-home-fold-design.md`

## File Structure

| File | Responsibility |
| --- | --- |
| `apps/web/src/components/HomeShortenDock.tsx` | Client: paste URL, shorten, busy/error/success (Copy + Shorten another + link to full tool) |
| `apps/web/src/components/HomePopularStrip.tsx` | Presentational horizontal popular tools list (server-safe) |
| `apps/web/src/components/HomeCategoryChips.tsx` | Horizontal category chip links for mobile fold |
| `apps/web/src/app/page.tsx` | Compose mobile launcher vs desktop sections |
| `apps/web/src/components/HomeSearch.tsx` | Minor mobile compact tweaks only if needed |
| `apps/web/e2e/navigation.spec.ts` | Desktop assertions updated; add mobile viewport coverage |
| `apps/web/e2e/home-mobile.spec.ts` | Mobile fold + optional shorten smoke |

---

### Task 1: HomeShortenDock (inline shorten)

**Files:**
- Create: `apps/web/src/components/HomeShortenDock.tsx`
- Test: `apps/web/e2e/home-mobile.spec.ts` (created here with dock-visible assertion; shorten flow filled in Task 3 if API flaky — prefer full flow in this task)

**Interfaces:**
- Consumes: `shortenUrl(url: string, apiBase: string): Promise<TextResult>` from `@/lib/tools/text`
- Produces: `<HomeShortenDock />` — no props required for v1

- [ ] **Step 1: Write the failing e2e for dock on mobile**

Create `apps/web/e2e/home-mobile.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("Mobile home launcher", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("shows shorten dock, search, category chips, popular strip", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("textbox", { name: /long url|paste|url to shorten/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^Shorten$/i })).toBeVisible();
    await expect(page.getByPlaceholder(/shorten url|find a tool|search/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /^PDF$/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Image$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Popular/i })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "What do you need?" }),
    ).toHaveCount(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && npx playwright test e2e/home-mobile.spec.ts --reporter=list`

Expected: FAIL (dock textbox / chips / Popular heading missing or use-case heading still visible)

- [ ] **Step 3: Implement `HomeShortenDock`**

Create `apps/web/src/components/HomeShortenDock.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { LinkSimple } from "@phosphor-icons/react";
import { shortenUrl } from "@/lib/tools/text";

function looksLikeUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  try {
    const withProtocol = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    const u = new URL(withProtocol);
    return u.hostname.includes(".");
  } catch {
    return false;
  }
}

export function HomeShortenDock() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setShortUrl(null);
    setError(null);
    setCopied(false);
    setUrl("");
  };

  const onShorten = async () => {
    if (!looksLikeUrl(url) || busy) return;
    setBusy(true);
    setError(null);
    try {
      const raw = url.trim();
      const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      const result = await shortenUrl(normalized, "/api");
      setShortUrl(result.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to shorten URL");
    } finally {
      setBusy(false);
    }
  };

  const onCopy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Could not copy — select the link and copy manually");
    }
  };

  if (shortUrl) {
    return (
      <div className="rounded-2xl border border-[var(--accent)]/28 bg-[var(--accent-soft)] p-3.5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--accent-ink)]">
          <LinkSimple size={18} weight="bold" />
          Short link ready
        </div>
        <p className="mb-3 break-all rounded-xl border border-[var(--stroke)] bg-white px-3 py-2.5 font-mono text-sm text-[var(--ink)]">
          {shortUrl}
        </p>
        <div className="flex gap-2">
          <button type="button" className="btn-primary flex-1 !py-2.5" onClick={onCopy}>
            {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" className="btn-secondary flex-1 !py-2.5" onClick={reset}>
            Shorten another
          </button>
        </div>
        <Link
          href="/tools/url-shortener"
          className="mt-3 inline-block text-xs font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Open full shortener
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--accent)]/28 bg-[var(--accent-soft)] p-3.5">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--accent-ink)]">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
          <LinkSimple size={16} weight="bold" />
        </span>
        Shorten a link
      </div>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="home-shorten-url">
          URL to shorten
        </label>
        <input
          id="home-shorten-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void onShorten();
          }}
          placeholder="https://…"
          disabled={busy}
          className="field !rounded-xl !py-2.5 !text-base"
          autoComplete="url"
          inputMode="url"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "home-shorten-error" : undefined}
        />
        <button
          type="button"
          className="btn-primary shrink-0 !px-4 !py-2.5"
          disabled={busy || !looksLikeUrl(url)}
          onClick={() => void onShorten()}
        >
          {busy ? "…" : "Shorten"}
        </button>
      </div>
      {error ? (
        <p id="home-shorten-error" className="mt-2 text-sm text-[var(--warn-ink)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
```

Note: visible label “Shorten a link” is above the field; `sr-only` ties the input for a11y. If Playwright’s `{ name: /url to shorten/i }` fails because only `sr-only` is associated, prefer `page.locator("#home-shorten-url")` in the test — update the test in Step 5 to match the real accessible name (`URL to shorten`).

- [ ] **Step 4: Wire dock into page minimally (mobile-only wrapper)** so the e2e can see it — full page restructure is Task 2. For now, at the top of the page content inside `page.tsx`, add:

```tsx
<div className="md:hidden space-y-3">
  <HomeShortenDock />
</div>
```

Import `HomeShortenDock`. Do not remove desktop sections yet if that blocks other tests — Task 2 completes the split.

- [ ] **Step 5: Adjust e2e selectors to match implementation, re-run**

If Step 1 assertions are too strict before Task 2 (chips / Popular / no use-cases), temporarily assert only the dock in this task:

```ts
await expect(page.locator("#home-shorten-url")).toBeVisible();
await expect(page.getByRole("button", { name: /^Shorten$/i })).toBeVisible();
```

Keep the full mobile assertions in the file as `test.skip` or expand them in Task 2/3 once the layout exists.

Run: `cd apps/web && npx playwright test e2e/home-mobile.spec.ts --reporter=list`

Expected: PASS for dock visibility

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/HomeShortenDock.tsx apps/web/src/app/page.tsx apps/web/e2e/home-mobile.spec.ts
git commit -m "$(cat <<'EOF'
feat: add home shorten dock for mobile launcher

EOF
)"
```

---

### Task 2: Mobile launcher layout vs desktop sections

**Files:**
- Create: `apps/web/src/components/HomeCategoryChips.tsx`
- Create: `apps/web/src/components/HomePopularStrip.tsx`
- Modify: `apps/web/src/app/page.tsx`
- Optionally modify: `apps/web/src/components/HomeSearch.tsx` (tighter mobile padding only)

**Interfaces:**
- Consumes: `CATEGORIES`, `getPopularTools()`, `HomeShortenDock`, `HomeSearch`
- Produces: `HomeCategoryChips`, `HomePopularStrip`; page renders mobile + desktop branches

- [ ] **Step 1: Expand failing mobile e2e to full fold assertions**

Unskip / restore full assertions from Task 1 Step 1 in `home-mobile.spec.ts`, including:

```ts
await expect(page.getByRole("heading", { name: "What do you need?" })).toHaveCount(0);
await expect(page.getByRole("heading", { name: "Browse by category" })).toHaveCount(0);
```

Also assert H1 still exists for SEO (may be sr-only):

```ts
await expect(
  page.getByRole("heading", {
    level: 1,
    name: /Free online file tools — private & no signup/i,
  }),
).toBeAttached();
```

- [ ] **Step 2: Run mobile e2e — expect FAIL on chips / popular / removed sections**

Run: `cd apps/web && npx playwright test e2e/home-mobile.spec.ts --reporter=list`

- [ ] **Step 3: Add `HomeCategoryChips`**

Create `apps/web/src/components/HomeCategoryChips.tsx`:

```tsx
import Link from "next/link";
import { CATEGORIES } from "@/lib/tools/registry";

/** Mobile fold chips — PDF / Media / Image / Text / Links */
export function HomeCategoryChips() {
  return (
    <nav aria-label="Categories" className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((c) => (
        <Link
          key={c.id}
          href={`/${c.id}`}
          className="chip shrink-0 !text-[13px] !py-2"
        >
          {c.id === "text" ? "Text" : c.name}
        </Link>
      ))}
    </nav>
  );
}
```

(Spec mock showed four chips; product registry includes Links — include all `CATEGORIES` so Links is not orphaned.)

- [ ] **Step 4: Add `HomePopularStrip`**

Create `apps/web/src/components/HomePopularStrip.tsx`:

```tsx
import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools/registry";

export function HomePopularStrip({ tools }: { tools: ToolDefinition[] }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold tracking-tight">Popular</h2>
      <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tools.slice(0, 6).map((t) => (
          <Link
            key={t.slug}
            href={`/tools/${t.slug}`}
            className="w-[9.5rem] shrink-0 rounded-2xl border border-[var(--stroke)] bg-white/60 px-3.5 py-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {t.category}
            </p>
            <p className="mt-1 text-sm font-semibold leading-snug text-[var(--ink)]">
              {t.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Restructure `page.tsx`**

Pattern (keep existing desktop JSX moved under `hidden md:block`; mobile under `md:hidden`):

```tsx
export default function HomePage() {
  const popular = getPopularTools();

  return (
    <>
      <JsonLd data={buildWebsiteJsonLd()} />
      {/* SEO H1 always in DOM */}
      <h1 className="sr-only">
        Free online file tools — private &amp; no signup
      </h1>

      <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 md:hidden">
        <div className="space-y-3">
          <HomeShortenDock />
          <HomeSearch />
          <HomeCategoryChips />
        </div>
        <HomePopularStrip tools={popular} />
      </div>

      <div className="mx-auto hidden max-w-6xl px-4 pb-8 pt-10 md:block md:pt-16">
        {/* existing desktop sections: visible H1 hero, HomeSearch, featured,
            use cases, popular grid, browse by category — copy from current page.tsx
            Remove the temporary md:hidden dock-only block from Task 1 */}
      </div>
    </>
  );
}
```

Desktop hero should keep the visible H1 (duplicate text is OK: one `sr-only` global + one visual on desktop, OR only `sr-only` on mobile branch and visible H1 inside desktop branch — prefer **visible H1 only inside desktop branch** and **sr-only H1 only in mobile branch** to avoid duplicate H1s):

```tsx
{/* mobile */}
<h1 className="sr-only">Free online file tools — private &amp; no signup</h1>

{/* desktop */}
<h1 className="font-display text-5xl ...">Free online file tools — private &amp; no signup</h1>
```

Exactly one H1 per viewport’s rendered tree: both branches are in the DOM, so **use a single H1** with responsive classes instead:

```tsx
<h1 className="sr-only md:not-sr-only md:font-display md:text-5xl ...">
```

Tailwind `sr-only` + `md:not-sr-only` is awkward. Cleaner: **one H1 inside desktop block** and **one sr-only H1 inside mobile block** is invalid (two H1s in DOM). Best approach:

Use **one H1** at the top:

```tsx
<h1 className="sr-only">Free online file tools — private &amp; no signup</h1>
```

On desktop, show a visual headline as `<p role="presentation">` or keep a large `<p className="font-display...">` matching the brand line for sighted users, **or** accept two H1s (bad). Spec prioritizes SEO + less mobile scroll — **single sr-only H1 sitewide on home + desktop visual title as `p.font-display` with same text** is acceptable if current SEO tests look for `role=heading`. Current e2e uses `getByRole("heading", { name: /Free online.../})` — that requires a real heading.

**Decision for implementers:** Keep **one** `<h1>` in the desktop section (visible). On mobile, include the same `<h1 className="sr-only">` **only in the mobile section** and **do not render the desktop section’s H1 on mobile** — both sections stay in DOM with `hidden`/`md:hidden`, so **both H1s exist in DOM** (hidden CSS still in accessibility tree depending on `hidden` / `display:none`).

Using `hidden md:block` removes desktop from a11y tree on mobile; `md:hidden` removes mobile from a11y tree on desktop. So one H1 per active tree is fine:

- Mobile branch: `<h1 className="sr-only">...</h1>`
- Desktop branch: `<h1 className="font-display ...">...</h1>`

- [ ] **Step 6: Run mobile e2e — expect PASS**

Run: `cd apps/web && npx playwright test e2e/home-mobile.spec.ts --reporter=list`

- [ ] **Step 7: Update desktop navigation e2e**

Modify `apps/web/e2e/navigation.spec.ts` first test to set desktop viewport explicitly:

```ts
test("home shows brand, search, popular, categories", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  // existing assertions...
});
```

Update search test similarly so it targets desktop `HomeSearch` placeholder, or use mobile viewport and the mobile search field — prefer desktop viewport for existing tests.

For header nav test, desktop viewport required (nav hidden on phone).

- [ ] **Step 8: Run navigation + home-mobile e2e**

Run: `cd apps/web && npx playwright test e2e/navigation.spec.ts e2e/home-mobile.spec.ts --reporter=list`

Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/app/page.tsx apps/web/src/components/HomeCategoryChips.tsx apps/web/src/components/HomePopularStrip.tsx apps/web/e2e/home-mobile.spec.ts apps/web/e2e/navigation.spec.ts
git commit -m "$(cat <<'EOF'
feat: compact mobile home launcher with popular strip

EOF
)"
```

---

### Task 3: Mobile shorten smoke + polish polish

**Files:**
- Modify: `apps/web/e2e/home-mobile.spec.ts`
- Modify: `apps/web/src/components/HomeShortenDock.tsx` (only if e2e reveals gaps)
- Optionally: `apps/web/src/components/HomeSearch.tsx` — reduce label size / padding on default (mobile) if fold feels tight

**Interfaces:**
- Consumes: `HomeShortenDock` success UI (Copy / Shorten another)
- Produces: e2e coverage for shorten + copy on home

- [ ] **Step 1: Add shorten smoke test**

Append to `home-mobile.spec.ts`:

```ts
test("shorten on home shows copyable short link", async ({ page, request }) => {
  await page.goto("/");
  await page.locator("#home-shorten-url").fill("https://example.com/home-dock-e2e");
  await page.getByRole("button", { name: /^Shorten$/i }).click();
  await expect(page.getByText(/Short link ready/i)).toBeVisible();
  const shortText = await page.locator("p.font-mono").innerText();
  expect(shortText.trim()).toMatch(/\/r\/[A-Za-z0-9]+$/);
  await page.getByRole("button", { name: /^Copy$/i }).click();
  await expect(page.getByRole("button", { name: /^Copied$/i })).toBeVisible();

  const res = await request.get(shortText.trim(), { maxRedirects: 0 });
  expect(res.status()).toBe(302);
});
```

Grant clipboard permissions if needed:

```ts
await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
```

- [ ] **Step 2: Run the new test**

Run: `cd apps/web && npx playwright test e2e/home-mobile.spec.ts --reporter=list`

Expected: PASS (API via `/api/links`)

- [ ] **Step 3: Manual fold check**

Run: `cd apps/web && npm run dev`

Open `http://127.0.0.1:3000` at 390px width. Confirm shortener + search + chips fit without scrolling past the fold (Popular may sit just below). Desktop ≥768px still shows full sections.

- [ ] **Step 4: Commit**

```bash
git add apps/web/e2e/home-mobile.spec.ts apps/web/src/components/HomeShortenDock.tsx apps/web/src/components/HomeSearch.tsx
git commit -m "$(cat <<'EOF'
test: cover mobile home shorten dock end-to-end

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| Compact shortener dock on mobile fold | 1 |
| Inline success (Copy / Shorten another / full tool link) | 1, 3 |
| Search on fold | 2 |
| Category chips | 2 |
| Popular horizontal strip only below fold | 2 |
| Hide featured / use cases / tall grids / browse cards on mobile | 2 |
| Desktop layout unchanged | 2 |
| Reuse `shortenUrl` + `/api` | 1 |
| E2E mobile + desktop | 2, 3 |
| A11y label / error / no focus trap | 1 |

## Plan self-review

- No TBD placeholders left in steps.
- `shortenUrl` / `#home-shorten-url` / component names consistent across tasks.
- Category chips include full `CATEGORIES` (including Links) — intentional product alignment beyond the 4-chip mockup.

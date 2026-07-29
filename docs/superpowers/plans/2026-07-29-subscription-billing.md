# Deskzy Subscription & Billing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Deskzy Free → Pro → Business → API monetization (iLovePDF-style, INR via Razorpay, Supabase auth), starting with a live pricing page and ending with paid entitlements and API access.

**Architecture:** Next.js on Cloudflare Workers talks to Supabase (Auth + Postgres) for accounts/entitlements/usage and Razorpay for INR subscriptions. Short links stay in KV. Browser PDF/image tools remain local; Free limits are usage counters, not file uploads.

**Tech Stack:** Next.js 15, React 19, Tailwind 4, Supabase JS, Razorpay Subscriptions API, Cloudflare KV, Playwright e2e

## Global Constraints

- Pro: ₹399/user/month · ₹2,699/user/year; seats 1–25; Business “Let’s talk”
- Free limited like iLovePDF; no ads on Free
- Browser file tools never upload files
- Pricing UI follows Deskzy shell/accent tokens (not iLovePDF yellow/red)
- Do not commit unless user asks
- Phase 1 ships without live payments (early-access CTA)

## File map (all phases)

| Path | Responsibility |
| --- | --- |
| `apps/web/src/lib/pricing.ts` | Plan constants, seat math, INR formatters |
| `apps/web/src/app/pricing/page.tsx` | Pricing route + SEO |
| `apps/web/src/components/PricingPlans.tsx` | Toggle, seats, cards, FAQ |
| `apps/web/src/components/SiteHeader.tsx` | Pricing + auth nav links |
| `apps/web/src/components/SiteFooter.tsx` | Pricing link |
| `apps/web/e2e/pricing.spec.ts` | Pricing page e2e |
| `apps/web/src/lib/supabase/*` | Client/server Supabase (Phase 2+) |
| `supabase/migrations/*` | Schema (Phase 2+) |
| `apps/web/src/app/api/billing/*` | Razorpay checkout + webhooks (Phase 3+) |
| `apps/web/src/lib/entitlements.ts` | Plan + usage checks (Phase 2+) |

---

## Phase 1 — Pricing marketing (build now)

### Task 1: Pricing constants module

**Files:**
- Create: `apps/web/src/lib/pricing.ts`

**Interfaces:**
- Produces: `BILLING_PLANS`, `formatInr()`, `proTotalPaise(seats, cycle)`, seat clamp 1–25

- [ ] **Step 1: Add pricing constants**

```ts
export type BillingCycle = "monthly" | "yearly";

export const PRO_SEAT_MIN = 1;
export const PRO_SEAT_MAX = 25;

/** Display / Razorpay amounts in INR (rupees). */
export const PRO_MONTHLY_INR = 399;
export const PRO_YEARLY_INR = 2699; // ~₹225/mo (−43% vs 399×12)

export function clampSeats(n: number): number {
  return Math.min(PRO_SEAT_MAX, Math.max(PRO_SEAT_MIN, Math.floor(n) || 1));
}

export function proUnitInr(cycle: BillingCycle): number {
  return cycle === "yearly" ? PRO_YEARLY_INR : PRO_MONTHLY_INR;
}

export function proTotalInr(seats: number, cycle: BillingCycle): number {
  return clampSeats(seats) * proUnitInr(cycle);
}

/** Effective monthly when billed yearly (rounded). */
export function proEffectiveMonthlyInr(): number {
  return Math.round(PRO_YEARLY_INR / 12);
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const FREE_FEATURES = [
  "Access to essential Deskzy tools",
  "Limited daily document processing",
  "Browser-first — files stay on your device",
] as const;

export const PRO_FEATURES = [
  "Full access to all Deskzy tools",
  "Unlimited document processing",
  "Higher short-link limits + custom slugs",
  "Link click analytics",
  "Saved presets across devices",
  "Priority support",
] as const;

export const BUSINESS_FEATURES = [
  "All Pro features",
  "Custom contracts designed for scalability",
  "Dedicated account manager",
  "Single Sign-On (SSO)",
  "API access & higher rate limits",
] as const;
```

- [ ] **Step 2: Commit when user asks** (skip unless requested)

### Task 2: PricingPlans UI + `/pricing` page

**Files:**
- Create: `apps/web/src/components/PricingPlans.tsx`
- Create: `apps/web/src/app/pricing/page.tsx`
- Modify: `apps/web/src/components/SiteHeader.tsx`
- Modify: `apps/web/src/components/SiteFooter.tsx`

**Interfaces:**
- Consumes: `apps/web/src/lib/pricing.ts`
- Produces: Interactive pricing section with monthly/yearly toggle and seat stepper

- [ ] **Step 1: Build client `PricingPlans`**
  - Billing toggle (Yearly default, show −43% badge)
  - Three cards: Free / Pro (highlighted with accent-soft) / Business
  - Pro: seat −/+, live total using `formatInr(proTotalInr(...))`
  - CTAs: Free → `/`; Pro → early-access note + X contact; Business → X contact
  - FAQ accordion below (cancel anytime, files private, invoices later, etc.)
  - Compact comparison table Free vs Pro vs Business

- [ ] **Step 2: Add `pricing/page.tsx` with `buildPageMetadata`**

- [ ] **Step 3: Add Pricing link in header (desktop + mobile menu) and footer**

- [ ] **Step 4: Add Playwright smoke `e2e/pricing.spec.ts`**
  - Visits `/pricing`, sees Free / Pro / Business, toggles yearly/monthly, changes seats, totals update

### Task 3: Phase 1 verification

- [ ] Run `npm run test:e2e -w @deskzy/web -- pricing.spec.ts` (or project e2e script)
- [ ] Manual: `/pricing` matches Deskzy chrome; prices ₹399 / ₹2,699

---

## Phase 2 — Auth + schema + Free limits

### Task 4: Supabase project wiring

**Files:**
- Create: `apps/web/src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`
- Modify: `apps/web/.env.example`, `apps/web/src/middleware.ts`
- Create: `supabase/migrations/20260729_billing_init.sql`

Schema (directional):

```sql
-- profiles, subscriptions (razorpay ids, plan, seats, status, cycle),
-- usage_daily (user_id or anon_key, tool_slug, day, count),
-- seat_members (subscription_id, user_id, role)
```

- [ ] Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Auth pages: `/login`, `/signup`, `/account`
- [ ] Header Log in / Sign up when unauthenticated; avatar/account when signed in

### Task 5: Usage gate

**Files:**
- Create: `apps/web/src/lib/entitlements.ts`, `apps/web/src/lib/usage-limits.ts`
- Create: `apps/web/src/components/UpgradeModal.tsx`
- Modify: tool workspace / shortener create path

Free daily caps (initial):

| Tool | Free/day |
| --- | --- |
| merge-pdf, split-pdf, compress-pdf, reorder-pdf, pdf-to-images | 2 each |
| compress-image, resize-image, convert-image, webp-to-png | 5 each |
| url-shortener | 10 |
| text / qr / utm / whatsapp / bio | unlimited |

- [ ] Increment usage on successful tool run / shortener create
- [ ] Anonymous: cookie/localStorage id + IP fallthrough for shortener
- [ ] On limit: UpgradeModal → `/pricing`

---

## Phase 3 — Razorpay subscriptions

### Task 6: Razorpay plans + checkout API

**Files:**
- Create: `apps/web/src/app/api/billing/checkout/route.ts`
- Create: `apps/web/src/app/api/billing/webhook/route.ts`
- Create: `apps/web/src/lib/razorpay.ts`
- Modify: Pro CTA on pricing to start checkout when authed

- [ ] Create Razorpay plans (monthly ₹399, yearly ₹2,699) in dashboard; store plan IDs in env
- [ ] Checkout: require auth; `quantity = seats`; return subscription/order for Razorpay Checkout.js
- [ ] Webhook: verify signature; map activated/charged/halted/cancelled → `subscriptions` row
- [ ] `/account` shows plan, seats, manage/cancel links

---

## Phase 4 — Pro features + Business contact

### Task 7: Link analytics + custom slugs

**Files:**
- Modify: `apps/web/src/lib/links-store.ts`, `apps/web/src/app/api/links/route.ts`, redirect hop
- Create: account links dashboard

- [ ] Pro: optional `slug` on create; store `owner_id`
- [ ] Increment hits on redirect (KV or Postgres events)
- [ ] Dashboard: clicks last 7/30 days

### Task 8: Business contact

**Files:**
- Create: `apps/web/src/app/pricing` contact section or `/contact-sales`
- Optional: store leads in Supabase `sales_leads`

---

## Phase 5 — API + SSO

### Task 9: API keys

- [ ] `api_keys` table; Bearer auth on `/api/v1/links`
- [ ] Business (and later Pro) rate limits by plan

### Task 10: SSO

- [ ] Enable Google/Microsoft providers in Supabase for Business orgs
- [ ] Domain-restricted org membership

---

## Spec coverage checklist

| Spec item | Phase |
| --- | --- |
| Pricing page Free/Pro/Business | 1 |
| Undercut INR + seat stepper | 1 |
| Supabase Auth + Postgres | 2 |
| Free limits like iLovePDF | 2 |
| Razorpay INR subscriptions | 3 |
| Pro link features | 4 |
| Business contact / SSO / API | 4–5 |
| Browser files never uploaded | All |

## Execution note

Phase 1 is independently shippable. Do not block Phase 1 on Supabase/Razorpay credentials. Later phases need live project keys.

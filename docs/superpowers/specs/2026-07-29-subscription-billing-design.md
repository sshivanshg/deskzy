# Deskzy subscription & billing design

**Date:** 2026-07-29  
**Status:** Approved for implementation (Approach 1 — phased monolith)  
**Product:** Deskzy (`apps/web`)

## Problem

Deskzy is free, private, and browser-first with no monetization path. Competitors like iLovePDF convert via Free limits → Premium seats → Business. Deskzy needs the same funnel, priced slightly under iLovePDF in INR, without abandoning privacy for browser tools.

## Goals

1. Ship an iLovePDF-style pricing experience (Free / Pro / Business, monthly–yearly toggle, 1–25 seats).
2. Monetize via Razorpay (INR: UPI, cards, netbanking).
3. Accounts via Supabase Auth + Postgres entitlements.
4. Free tier limited like iLovePDF; Pro unlocks unlimited + link power features.
5. Keep browser file processing local (no file uploads for PDF/image tools).

## Non-goals (v1 program)

- Desktop/mobile apps
- OCR, e-sign, AI credits
- Ads on Free (limits drive upgrades)
- Stripe / non-INR primary billing (Razorpay first)

## Decisions

| Topic | Choice |
| --- | --- |
| Approach | Phased monolith (5 releases) |
| Auth + DB | Supabase Auth + Postgres |
| Payments | Razorpay Subscriptions (INR) |
| Pricing UI | iLovePDF-like 3 cards + billing toggle + seat stepper |
| Pro price | ₹399 / user / mo · ₹2,699 / user / yr (~₹225/mo, −43%) |
| Free model | Limited daily processing (like iLovePDF) |
| Business | 25+ seats, “Let’s talk”, SSO later |
| Privacy | Files stay in browser; only usage/account/link metadata server-side |

## Tiers

### Free (Basic)

- 1 user, no payment
- Essential tools with daily task limits (per tool; finalized in plan)
- Shortener fair-use cap
- No signup required to try; signed-in Free syncs limits across devices

### Pro

- 1–25 seats (quantity on Razorpay subscription)
- Unlimited processing within fair abuse limits
- Link analytics, custom slugs, saved presets, priority support
- Seat invites for purchased quantity

### Business

- 25+ users, custom pricing
- All Pro + SSO, dedicated support, invoices/GST, API keys, higher limits
- Contact sales CTA (X / form)

## Architecture

```
Next.js (Cloudflare Workers/OpenNext)
  → Supabase Auth + Postgres (profiles, subscriptions, seats, usage, api_keys)
  → KV (short links; existing)
  → Razorpay (plans, subscriptions, webhooks)
```

Entitlement: `getPlan()` → `free | pro | business`. Usage counters gate Free. Webhooks sync subscription status and seat quantity.

## Phased delivery

1. **Pricing marketing** — `/pricing`, nav/footer, FAQ, comparison; Pro CTA = early access until checkout lives
2. **Auth + usage limits + schema** — Supabase, daily counters, upgrade modal
3. **Razorpay checkout + webhooks** — monthly/yearly, seat qty 1–25
4. **Pro features + Business contact** — analytics, custom slugs, presets, sales form
5. **API + SSO** — API keys, Google/Microsoft SSO for Business

## Success criteria

- Pricing page mirrors competitor clarity with Deskzy brand and undercut INR price
- Free users hit a clear upgrade path when limited
- Paying Pro users receive entitlements within minutes of Razorpay activation
- Privacy copy remains accurate: browser tools do not upload files

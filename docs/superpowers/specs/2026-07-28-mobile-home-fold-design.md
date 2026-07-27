# Mobile home fold-first launcher

**Date:** 2026-07-28  
**Status:** Approved for planning  
**Product:** Deskzy (`apps/web`)

## Problem

The mobile home page stacks hero copy, search, a featured shortener banner, use-case cards, popular tool cards, and category cards. Discovery paths overlap, so the page feels like endless scroll instead of a decisive launcher.

## Goals

1. Make the URL shortener the primary action on the mobile first screen.
2. Keep other tools reachable in one or two taps (search + category chips).
3. Reduce vertical scroll on mobile to: first fold + one short Popular strip.
4. Leave desktop’s richer multi-section layout intact.

## Non-goals

- Redesigning the full tool workspace or category pages.
- Building a bottom-tab app shell.
- Changing shortener API semantics or `/r/[code]` redirects.
- Removing SEO content from the desktop homepage.

## Decisions

| Topic | Choice |
| --- | --- |
| Primary job of mobile home | Shortener first; everything else secondary |
| First-screen composition | Compact dock: shortener + search + category chips share the fold |
| Shorten interaction | Lean hybrid: paste + Shorten on home |
| Success pattern | Inline result in the dock (short URL + Copy; optional “Open full tool”) |
| Below fold | Horizontal Popular strip only |
| Desktop | Keep current richer layout (≥ `md`) |

## Mobile layout

### First fold (≈ one viewport)

Order, top to bottom:

1. Existing sticky header (Deskzy + search/menu icons) — unchanged chrome.
2. **Shortener dock** — tinted accent surface:
   - Label: “Shorten a link”
   - Input for long URL
   - Primary **Shorten** button (inline with input on narrow widths)
3. **Tool search** — reuse current `HomeSearch` behavior (query + results / hint chips). Prefer a compact variant so it does not dominate the dock.
4. **Category chips** — horizontal row linking to `/pdf`, `/image`, `/media`, `/text`.

No giant marketing H1 / multi-paragraph hero on mobile. Brand signal stays in the header; a single short dock title is enough.

### Shortener dock states

- **Idle:** empty input + Shorten (disabled or no-op until valid-looking URL).
- **Busy:** Shorten shows loading; input disabled.
- **Success:** dock swaps (or expands in place) to show short URL, **Copy**, and **Shorten another** (resets to idle). Optional text link to `/tools/url-shortener`.
- **Error:** inline error under the field; keep input value for retry.

Implementation should call the same shorten path already used by the tool (`shortenUrl` / links API). Do not duplicate business logic.

### Below fold

- Section title: “Popular” (or existing “Popular right now” shortened).
- Horizontal scroll of ~4–6 popular tools (compact cards: category + name).
- No use-case grid, no featured banner, no tall popular grid, no “Browse by category” card stack on mobile.

### Removed / hidden on mobile only

Use responsive visibility (`md:` show / default hide or dedicated mobile layout branch) so these remain on desktop:

- Large SEO hero (H1 + long supporting paragraphs)
- Featured URL shortener banner block
- “What do you need?” use-case grid
- Multi-column popular card grid
- “Browse by category” multi-line category cards

Category access on mobile is via chips; deeper browse stays on category routes.

## Desktop layout

At `md` and up, keep the current homepage structure (hero, search, featured, use cases, popular grid, categories). Optional later polish is out of scope unless it falls out of shared components cleanly.

## Components (expected)

| Piece | Notes |
| --- | --- |
| `HomeShortenDock` (client) | Paste, shorten, inline success/error; uses existing `shortenUrl` |
| `HomeSearch` | Keep; may tighten mobile spacing/chrome |
| Home page (`page.tsx`) | Mobile launcher vs desktop sections via responsive structure |
| Popular strip | New compact horizontal list for mobile; desktop keeps grid |

## Data / behavior

- Popular tools: existing `getPopularTools()`.
- Categories: existing `CATEGORIES` / nav hrefs.
- Shorten: existing API base + `shortenUrl`; copy via clipboard API with fallback messaging.
- No new backend endpoints required.

## Accessibility

- Dock input has a visible label (not placeholder-only).
- Loading and error states announced clearly (text, not color alone).
- Horizontal Popular strip is keyboard-scrollable / focusable links.
- Do not trap focus; success actions are standard buttons/links.

## Testing

- Update home e2e (`navigation.spec.ts` etc.) for mobile viewport: dock visible, featured banner / use-case grid not required on small viewports.
- Smoke: shorten on home succeeds when API available; Copy works.
- Desktop smoke: existing sections still present at desktop width.

## Open points resolved in design

- Inline shorten on home (not navigate-first, not bottom sheet).
- Compact dock composition (not stacked fold, not split-actions).
- Mobile-only scope for the scroll cut.

## Success criteria

- On a typical phone viewport, primary shortener + search + four category chips are visible without scrolling (allowing for browser chrome variance).
- Reaching a popular non-shortener tool takes at most: scroll a short strip + one tap, or search + one tap.
- Desktop homepage visual structure remains essentially unchanged.

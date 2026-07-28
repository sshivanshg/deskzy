# Image prepare presets + target size

**Date:** 2026-07-28  
**Status:** Approved for implementation (user: build)  
**Scope (Wave 1):** `compress-image` + `resize-image` only. PDF deferred.

## Goals

1. Use-case presets (Email, WhatsApp, Web, Avatar) that set max dimension + quality (± target bytes).
2. Custom mode: quality + optional max width + optional “under X KB/MB”.
3. Stay fully in-browser; honest failure if target cannot be met.

## Presets

| Preset | Max edge (px) | Quality | Target (bytes) | Notes |
| --- | --- | --- | --- | --- |
| Email | 2048 | 0.75 | 1_000_000 | Attachment-friendly |
| WhatsApp | 1600 | 0.72 | 2_000_000 | Chat photo-ish |
| Web | 1920 | 0.8 | 400_000 | Hero / article |
| Avatar | 512 | 0.85 | 150_000 | Square crop not required; max edge |
| Custom | user | user | optional | Current chips + fields |

## Compress image UI

1. Use-case chip row (Email / WhatsApp / Web / Avatar / Custom).
2. When Custom: existing High/Balanced/Smallest + optional Max width + optional Target size (number + KB/MB).
3. When preset: show read-only summary (“≤ 1920px · under 400 KB”).

## Resize image UI

1. Same use-case chips (set width/height from max edge, keep aspect on).
2. Custom keeps width/height/keepAspect fields.

## Algorithm (`compressImage`)

1. Decode image; optionally downscale so longest edge ≤ `maxEdge`.
2. Encode JPEG (PNG inputs convert to JPEG when targeting size or when quality applied).
3. If `targetBytes`: binary-search quality in `[0.15, 0.92]`; if still over, scale dimensions ×0.85 and retry (cap ~6 rounds).
4. Meta: before/after/width/height/quality/targetHit (bool). If not hit, throw or return with warning text in UI.

## Non-goals

- PDF target size (Wave 2).
- Exact Instagram crop ratios.
- Server-side compression.

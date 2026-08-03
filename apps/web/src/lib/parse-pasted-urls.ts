import { looksLikeUrl, normalizeUrl } from "./normalize-url";

/**
 * Abuse-only ceiling for list payloads (KV / request size).
 * Not a Free/Pro product cap — not shown in UI copy.
 */
export const MAX_LIST_URLS_TECHNICAL = 200;

/**
 * Split whitespace-separated paste into URL-like tokens (spaces, newlines, tabs).
 * Order preserved; duplicates kept (user intent).
 */
export function parsePastedUrls(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && looksLikeUrl(t));
}

export type NormalizedUrlBatch =
  | { ok: true; urls: string[] }
  | { ok: false; error: string; invalidCount: number; total: number };

/**
 * Normalize every token. On any failure, return a clear batch error
 * ("N of M links invalid") rather than partial success.
 */
export function normalizeUrlBatch(rawUrls: string[]): NormalizedUrlBatch {
  if (rawUrls.length === 0) {
    return { ok: false, error: "url required", invalidCount: 0, total: 0 };
  }
  if (rawUrls.length > MAX_LIST_URLS_TECHNICAL) {
    return {
      ok: false,
      error: `too many urls (max ${MAX_LIST_URLS_TECHNICAL} per request)`,
      invalidCount: 0,
      total: rawUrls.length,
    };
  }

  const urls: string[] = [];
  let invalidCount = 0;
  for (const raw of rawUrls) {
    try {
      urls.push(normalizeUrl(raw));
    } catch {
      invalidCount += 1;
    }
  }

  if (invalidCount > 0) {
    return {
      ok: false,
      error: `${invalidCount} of ${rawUrls.length} links invalid`,
      invalidCount,
      total: rawUrls.length,
    };
  }

  return { ok: true, urls };
}

/**
 * Resolve POST /api/links body into raw URL tokens.
 * Prefers `urls` array; otherwise paste-parses whitespace-separated `url`.
 */
export function resolveCreateUrlTokens(body: {
  url?: string;
  urls?: string[];
}): string[] {
  if (Array.isArray(body.urls) && body.urls.length > 0) {
    return body.urls.map(String);
  }
  if (typeof body.url === "string" && body.url.trim()) {
    const parsed = parsePastedUrls(body.url);
    return parsed.length > 0 ? parsed : [body.url.trim()];
  }
  return [];
}

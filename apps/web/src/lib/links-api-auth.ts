import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Machine API key for pipeline / script creates (single URL or multi-link list).
 * Set as Worker secret `LINKS_API_KEY` (wrangler secret put LINKS_API_KEY).
 * Local: LINKS_API_KEY in apps/web/.env.local or .dev.vars.
 *
 * POST /api/links body:
 * - `{ "url": "https://…" }` — single short link
 * - `{ "urls": ["https://…", "https://…"] }` — list short link (PasteLinks-style)
 * - `{ "url": "https://a … https://b" }` — whitespace-separated multi also works
 */
export async function getLinksApiKey(): Promise<string | null> {
  const fromProcess = process.env.LINKS_API_KEY?.trim();
  if (fromProcess) return fromProcess;

  try {
    const { env } = getCloudflareContext();
    const key = (env as { LINKS_API_KEY?: string }).LINKS_API_KEY?.trim();
    return key || null;
  } catch {
    return null;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

/** Returns true if Authorization: Bearer <key> matches configured LINKS_API_KEY. */
export async function isLinksApiAuthorized(
  authHeader: string | null,
): Promise<boolean> {
  const expected = await getLinksApiKey();
  if (!expected) return false;
  if (!authHeader) return false;
  const m = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  if (!m) return false;
  const token = m[1].trim();
  if (!token) return false;
  return timingSafeEqual(token, expected);
}

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { resolveUserApiKey } from "@/lib/api-keys";

/**
 * Machine / Pro API auth for POST /api/links.
 *
 * Accepts either:
 * - Global Worker secret `LINKS_API_KEY` (internal pipelines), or
 * - A Pro/Business user key from Account (`dz_…`)
 *
 * POST /api/links body:
 * - `{ "url": "https://…" }` — single short link
 * - `{ "urls": ["https://…", "https://…"] }` — list short link
 * - `{ "url": "https://a … https://b" }` — whitespace-separated multi also works
 * - `{ "slug": "custom" }` — Pro custom slug (user keys only attach ownership)
 */

export type LinksApiAuth =
  | { ok: true; kind: "global" }
  | { ok: true; kind: "user"; userId: string }
  | { ok: false };

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

function extractBearer(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const m = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  if (!m) return null;
  const token = m[1].trim();
  return token || null;
}

/** Returns true if Authorization matches the global LINKS_API_KEY. */
export async function isLinksApiAuthorized(
  authHeader: string | null,
): Promise<boolean> {
  const result = await resolveLinksApiAuth(authHeader);
  return result.ok;
}

/** Resolve Bearer token to global pipeline key or a paid user API key. */
export async function resolveLinksApiAuth(
  authHeader: string | null,
): Promise<LinksApiAuth> {
  const token = extractBearer(authHeader);
  if (!token) return { ok: false };

  const expected = await getLinksApiKey();
  if (expected && timingSafeEqual(token, expected)) {
    return { ok: true, kind: "global" };
  }

  const userKey = await resolveUserApiKey(token);
  if (userKey) {
    return { ok: true, kind: "user", userId: userKey.userId };
  }

  return { ok: false };
}

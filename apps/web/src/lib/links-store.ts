/** Short-link store: Cloudflare KV in production, in-memory for local next dev. */

export type LinkRecord = {
  code: string;
  dest: string;
  hits: number;
  createdAt: string;
  userId?: string | null;
  isCustom?: boolean;
};

type KvPutOptions = { expirationTtl?: number };

type KvLike = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: KvPutOptions): Promise<void>;
};

const memory = new Map<string, LinkRecord>();
const memoryRate = new Map<string, { count: number; resetAt: number }>();

/** ~12 months — documented in Privacy Policy. */
export const LINK_TTL_SECONDS = 60 * 60 * 24 * 365;

/** Max short-link creates per IP per rolling minute (abuse only — not a Free plan cap). */
export const LINK_RATE_LIMIT_PER_MINUTE = 20;

const RESERVED_SLUGS = new Set([
  "api",
  "auth",
  "login",
  "signup",
  "account",
  "pricing",
  "privacy",
  "terms",
  "about",
  "guides",
  "tools",
  "pdf",
  "image",
  "media",
  "text",
  "links",
  "r",
  "shorten",
  "short",
  "link",
  "admin",
  "www",
  "app",
  "static",
  "favicon",
]);

async function getKv(): Promise<KvLike | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    const links = (env as { LINKS?: KvLike }).LINKS;
    return links ?? null;
  } catch {
    return null;
  }
}

export function isSafeCode(code: string): boolean {
  return /^[a-zA-Z0-9]{1,32}$/.test(code);
}

/** Custom Pro slugs: 3–32 chars, lowercase alphanumeric + hyphen. */
export function normalizeCustomSlug(raw: string): string {
  const slug = raw.trim().toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$/.test(slug)) {
    throw new Error(
      "Custom slug must be 3–32 characters: letters, numbers, hyphens (not at ends)",
    );
  }
  if (RESERVED_SLUGS.has(slug)) {
    throw new Error("That slug is reserved — try another");
  }
  return slug;
}

export async function getLink(code: string): Promise<LinkRecord | undefined> {
  if (!isSafeCode(code) && !/^[a-z0-9-]{3,32}$/.test(code)) return undefined;
  const kv = await getKv();
  if (kv) {
    const raw = await kv.get(code);
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as LinkRecord;
    } catch {
      return undefined;
    }
  }
  return memory.get(code);
}

export async function putLink(
  code: string,
  dest: string,
  opts?: { userId?: string | null; isCustom?: boolean },
): Promise<LinkRecord> {
  const record: LinkRecord = {
    code,
    dest,
    hits: 0,
    createdAt: new Date().toISOString(),
    userId: opts?.userId ?? null,
    isCustom: opts?.isCustom ?? false,
  };
  await putLinkRecord(record);
  return record;
}

export async function hasLink(code: string): Promise<boolean> {
  return (await getLink(code)) !== undefined;
}

export async function bumpLinkHits(code: string): Promise<void> {
  const link = await getLink(code);
  if (!link) return;
  link.hits = (link.hits || 0) + 1;
  await putLinkRecord(link);
}

/**
 * Simple per-IP create limit. Returns true if the request is allowed.
 * Fail-open if KV is unavailable so local/dev still works.
 */
export async function allowLinkCreate(ip: string): Promise<boolean> {
  const key = rateKey(ip);
  const kv = await getKv();
  if (kv) {
    const raw = await kv.get(key);
    const count = raw ? Number.parseInt(raw, 10) || 0 : 0;
    if (count >= LINK_RATE_LIMIT_PER_MINUTE) return false;
    await kv.put(key, String(count + 1), { expirationTtl: 120 });
    return true;
  }

  const now = Date.now();
  const bucket = memoryRate.get(key);
  if (!bucket || bucket.resetAt <= now) {
    memoryRate.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (bucket.count >= LINK_RATE_LIMIT_PER_MINUTE) return false;
  bucket.count += 1;
  return true;
}

function rateKey(ip: string): string {
  const safe = (ip || "unknown").slice(0, 128).replace(/[^\w.:-]/g, "_");
  const minute = Math.floor(Date.now() / 60_000);
  return `rl:${safe}:${minute}`;
}

async function putLinkRecord(record: LinkRecord): Promise<void> {
  const kv = await getKv();
  if (kv) {
    await kv.put(record.code, JSON.stringify(record), {
      expirationTtl: LINK_TTL_SECONDS,
    });
    return;
  }
  memory.set(record.code, record);
}

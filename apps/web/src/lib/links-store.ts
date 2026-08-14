/** Short-link store: Cloudflare KV in production, Supabase fallback, memory for local next dev. */

export type LinkRecord = {
  code: string;
  /** Single destination, or first URL for list links (account list / OG fallback). */
  dest: string;
  /** Legacy field kept for KV schema; click counts live in Supabase (`short_links.hits`). */
  hits: number;
  createdAt: string;
  userId?: string | null;
  isCustom?: boolean;
  /** Omitted or "single" for classic one-dest links; "list" for multi-URL paste. */
  kind?: "single" | "list";
  /** Present when kind === "list" — normalized destinations in paste order. */
  urls?: string[];
};

export function isListLink(
  link: LinkRecord,
): link is LinkRecord & { kind: "list"; urls: string[] } {
  return (
    link.kind === "list" && Array.isArray(link.urls) && link.urls.length > 0
  );
}

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
  "p",
  "shorten",
  "short",
  "link",
  "list",
  "multilink",
  "admin",
  "www",
  "app",
  "static",
  "favicon",
]);

function isKvWriteLimitError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  return /kv put\(\) limit exceeded|limit exceeded for the day/i.test(msg);
}

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

function rowToLink(row: {
  code: string;
  dest: string;
  hits?: number | null;
  created_at?: string | null;
  user_id?: string | null;
  is_custom?: boolean | null;
  kind?: string | null;
  urls?: unknown;
}): LinkRecord {
  const urls = Array.isArray(row.urls)
    ? row.urls.filter((u): u is string => typeof u === "string")
    : undefined;
  const kind =
    row.kind === "list" || (urls && urls.length > 1) ? "list" : "single";
  return {
    code: row.code,
    dest: row.dest,
    hits: Number(row.hits ?? 0),
    createdAt: row.created_at || new Date().toISOString(),
    userId: row.user_id ?? null,
    isCustom: row.is_custom ?? false,
    kind,
    ...(kind === "list" && urls ? { urls } : {}),
  };
}

async function getLinkFromSupabase(
  code: string,
): Promise<LinkRecord | undefined> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return undefined;
  try {
    const { createServiceClient } = await import("@/lib/supabase/admin");
    const admin = createServiceClient();
    const { data, error } = await admin
      .from("short_links")
      .select("code,dest,hits,created_at,user_id,is_custom,kind,urls")
      .eq("code", code)
      .maybeSingle();
    if (error || !data) return undefined;
    return rowToLink(data);
  } catch {
    return undefined;
  }
}

async function putLinkToSupabase(record: LinkRecord): Promise<void> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Link storage unavailable (KV limit and no Supabase fallback)");
  }
  const { createServiceClient } = await import("@/lib/supabase/admin");
  const admin = createServiceClient();
  const kind = record.kind === "list" ? "list" : "single";
  const { error } = await admin.from("short_links").upsert(
    {
      code: record.code,
      dest: record.dest,
      user_id: record.userId ?? null,
      is_custom: record.isCustom ?? false,
      kind,
      urls: kind === "list" ? record.urls ?? null : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "code" },
  );
  if (error) throw new Error(error.message);
}

export async function getLink(code: string): Promise<LinkRecord | undefined> {
  if (!isSafeCode(code) && !/^[a-z0-9-]{3,32}$/.test(code)) return undefined;
  const kv = await getKv();
  if (kv) {
    try {
      const raw = await kv.get(code);
      if (raw) {
        try {
          return JSON.parse(raw) as LinkRecord;
        } catch {
          /* fall through */
        }
      }
    } catch {
      /* fall through to Supabase */
    }
    const fromDb = await getLinkFromSupabase(code);
    if (fromDb) return fromDb;
    return undefined;
  }
  return memory.get(code) ?? (await getLinkFromSupabase(code));
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
    kind: "single",
  };
  await putLinkRecord(record);
  return record;
}

export async function putListLink(
  code: string,
  urls: string[],
  opts?: { userId?: string | null; isCustom?: boolean },
): Promise<LinkRecord> {
  if (urls.length < 2) {
    throw new Error("list links require at least 2 urls");
  }
  const record: LinkRecord = {
    code,
    dest: urls[0],
    urls,
    kind: "list",
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

function allowFromMemory(key: string): boolean {
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

/**
 * Simple per-IP create limit. Returns true if the request is allowed.
 * Fail-open if KV is unavailable / write-capped so creates still work.
 */
export async function allowLinkCreate(ip: string): Promise<boolean> {
  const key = rateKey(ip);
  const kv = await getKv();
  if (kv) {
    try {
      const raw = await kv.get(key);
      const count = raw ? Number.parseInt(raw, 10) || 0 : 0;
      if (count >= LINK_RATE_LIMIT_PER_MINUTE) return false;
      await kv.put(key, String(count + 1), { expirationTtl: 120 });
      return true;
    } catch (err) {
      // Daily KV write cap (or transient KV errors) — don't block creates.
      if (isKvWriteLimitError(err)) return allowFromMemory(key);
      return allowFromMemory(key);
    }
  }

  return allowFromMemory(key);
}

function rateKey(ip: string): string {
  const safe = (ip || "unknown").slice(0, 128).replace(/[^\w.:-]/g, "_");
  const minute = Math.floor(Date.now() / 60_000);
  return `rl:${safe}:${minute}`;
}

async function putLinkRecord(record: LinkRecord): Promise<void> {
  const kv = await getKv();
  if (kv) {
    try {
      await kv.put(record.code, JSON.stringify(record), {
        expirationTtl: LINK_TTL_SECONDS,
      });
      return;
    } catch {
      // Free-plan daily write cap (or transient KV put failure) —
      // persist in Supabase so creates/redirects still work.
      await putLinkToSupabase(record);
      return;
    }
  }
  memory.set(record.code, record);
}

/** Short-link store: Cloudflare KV in production, in-memory for local next dev. */

export type LinkRecord = {
  code: string;
  dest: string;
  hits: number;
  createdAt: string;
};

type KvLike = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};

const memory = new Map<string, LinkRecord>();

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

export async function getLink(code: string): Promise<LinkRecord | undefined> {
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

export async function hitLink(code: string): Promise<LinkRecord | undefined> {
  const link = await getLink(code);
  if (!link) return undefined;
  link.hits += 1;
  await putLinkRecord(link);
  return link;
}

export async function putLink(code: string, dest: string): Promise<LinkRecord> {
  const record: LinkRecord = {
    code,
    dest,
    hits: 0,
    createdAt: new Date().toISOString(),
  };
  await putLinkRecord(record);
  return record;
}

export async function hasLink(code: string): Promise<boolean> {
  return (await getLink(code)) !== undefined;
}

async function putLinkRecord(record: LinkRecord): Promise<void> {
  const kv = await getKv();
  if (kv) {
    await kv.put(record.code, JSON.stringify(record));
    return;
  }
  memory.set(record.code, record);
}

/** Shared in-memory short-link store for local/dev Next.js path. */

export type LinkRecord = {
  code: string;
  dest: string;
  hits: number;
  createdAt: string;
};

const globalStore = globalThis as typeof globalThis & {
  __deskzyLinks?: Map<string, LinkRecord>;
};

export function linkStore() {
  if (!globalStore.__deskzyLinks) {
    globalStore.__deskzyLinks = new Map();
  }
  return globalStore.__deskzyLinks;
}

export function getLink(code: string): LinkRecord | undefined {
  return linkStore().get(code);
}

export function hitLink(code: string): LinkRecord | undefined {
  const link = linkStore().get(code);
  if (!link) return undefined;
  link.hits += 1;
  linkStore().set(code, link);
  return link;
}

export function putLink(code: string, dest: string): LinkRecord {
  const record: LinkRecord = {
    code,
    dest,
    hits: 0,
    createdAt: new Date().toISOString(),
  };
  linkStore().set(code, record);
  return record;
}

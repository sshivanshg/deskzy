/** Fetch destination Open Graph tags for short-link social unfurls. */

export type DestOpenGraph = {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
};

const FETCH_TIMEOUT_MS = 3500;
const MAX_HTML_BYTES = 400_000;

function isBlockedHostname(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/\.$/, "");
  if (
    h === "localhost" ||
    h === "0.0.0.0" ||
    h === "::1" ||
    h.endsWith(".localhost") ||
    h.endsWith(".local") ||
    h.endsWith(".internal") ||
    h.endsWith(".lan")
  ) {
    return true;
  }
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(h)) {
    const parts = h.split(".").map(Number);
    const [a, b] = parts;
    if (a === 10 || a === 127 || a === 0 || (a === 169 && b === 254)) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  }
  return false;
}

function metaContent(html: string, key: string): string | undefined {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]?.trim()) return decodeHtmlEntities(m[1].trim());
  }
  return undefined;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&apos;/g, "'");
}

function pageTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const raw = m?.[1]?.trim();
  return raw ? decodeHtmlEntities(raw) : undefined;
}

function resolveUrl(base: string, maybeRelative: string | undefined): string | undefined {
  if (!maybeRelative) return undefined;
  try {
    return new URL(maybeRelative, base).toString();
  } catch {
    return undefined;
  }
}

async function readLimitedHtml(res: Response): Promise<string | null> {
  const ctype = (res.headers.get("content-type") || "").toLowerCase();
  if (
    ctype &&
    !ctype.includes("text/html") &&
    !ctype.includes("application/xhtml") &&
    !ctype.includes("text/plain")
  ) {
    return null;
  }

  if (!res.body) {
    const text = await res.text();
    return text.slice(0, MAX_HTML_BYTES);
  }

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_HTML_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    const remaining = MAX_HTML_BYTES - total;
    if (value.byteLength <= remaining) {
      chunks.push(value);
      total += value.byteLength;
    } else {
      chunks.push(value.slice(0, remaining));
      total += remaining;
      try {
        await reader.cancel();
      } catch {
        /* ignore */
      }
      break;
    }
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(merged);
}

/**
 * Best-effort destination unfurl. Returns null on timeout, blocked host, or empty meta.
 * Used so plain short links show the *destination* preview in chats — not Deskzy branding.
 */
export async function fetchDestOpenGraph(
  dest: string,
): Promise<DestOpenGraph | null> {
  let url: URL;
  try {
    url = new URL(dest);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (isBlockedHostname(url.hostname)) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (compatible; DeskzyPreview/1.0; +https://deskzy.xyz)",
      },
    });
    if (!res.ok) return null;

    const html = await readLimitedHtml(res);
    if (!html) return null;

    const title =
      metaContent(html, "og:title") ||
      metaContent(html, "twitter:title") ||
      pageTitle(html);
    const description =
      metaContent(html, "og:description") ||
      metaContent(html, "twitter:description") ||
      metaContent(html, "description");
    const image = resolveUrl(
      res.url || url.toString(),
      metaContent(html, "og:image") ||
        metaContent(html, "og:image:secure_url") ||
        metaContent(html, "twitter:image") ||
        metaContent(html, "twitter:image:src"),
    );
    const siteName = metaContent(html, "og:site_name");

    if (!title && !description && !image) return null;

    return {
      title: title || undefined,
      description: description || undefined,
      image: image || undefined,
      siteName: siteName || undefined,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

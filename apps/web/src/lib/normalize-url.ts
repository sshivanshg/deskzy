/** Shared http(s) URL normalization for short-link creates. */

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("url required");
  if (trimmed.length > 2048) throw new Error("url too long");
  const withScheme = /:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  let u: URL;
  try {
    u = new URL(withScheme);
  } catch {
    throw new Error("invalid url");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("only http/https allowed");
  }
  if (!u.host || u.host.includes(" ")) throw new Error("invalid url");
  if (u.username || u.password) throw new Error("credentials in url not allowed");
  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    /^(10\.|192\.168\.|169\.254\.|127\.)/.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  ) {
    throw new Error("url not allowed");
  }
  return u.toString();
}

/** Soft check for client UX — not a security boundary. */
export function looksLikeUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  try {
    const withProtocol = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    const u = new URL(withProtocol);
    return u.hostname.includes(".");
  } catch {
    return false;
  }
}

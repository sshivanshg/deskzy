/** Public share path for new links (Pastelink-style). */
export const LINK_PUBLIC_PREFIX = "/p" as const;

/** Legacy hop path — existing links keep working. */
export const LINK_LEGACY_PREFIX = "/r" as const;

export type LinkPathPrefix =
  | typeof LINK_PUBLIC_PREFIX
  | typeof LINK_LEGACY_PREFIX;

/** Main product site. */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL || "https://deskzy.xyz";

/**
 * Host for newly created share URLs (dedicated domain — separate from deskzy.xyz).
 */
export const SHARE_ORIGIN =
  process.env.NEXT_PUBLIC_SHARE_URL || "https://jfas.site";

export const SHARE_HOST = SHARE_ORIGIN.replace(/^https?:\/\//i, "").replace(
  /\/$/,
  "",
);

/** Legacy share hosts that still serve /p and /r (bookmarks). */
const LEGACY_SHARE_HOSTS = new Set([
  "jfas.site",
  "www.jfas.site",
  "yoururl.buzz",
  "www.yoururl.buzz",
  "go.deskzy.xyz",
  "www.go.deskzy.xyz",
]);

/** Path only, e.g. `/p/Ab12xYz`. */
export function publicLinkPath(code: string): string {
  return `${LINK_PUBLIC_PREFIX}/${code}`;
}

/** Absolute share URL on the dedicated share domain. */
export function publicLinkUrl(code: string): string {
  const base = SHARE_ORIGIN.replace(/\/$/, "");
  return `${base}${publicLinkPath(code)}`;
}

/** Display host for UI (no scheme). */
export function publicLinkHostPath(code: string): string {
  return `${SHARE_HOST}${publicLinkPath(code)}`;
}

export type ShareVariant = {
  id: string;
  label: string;
  hint: string;
  url: string;
};

/**
 * Canonical creator option for new shares.
 * Legacy hosts still resolve, but we only present the new domain to creators.
 */
export function shareVariantsForCode(code: string): ShareVariant[] {
  const path = publicLinkPath(code);
  return [
    {
      id: "direct",
      label: "Share link",
      hint: "Use this new canonical domain",
      url: `${SHARE_ORIGIN.replace(/\/$/, "")}${path}`,
    },
  ];
}

/** Extract /p/{code} or /r/{code} from a share URL. */
export function codeFromShareUrl(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const m = u.pathname.match(/^\/(?:p|r)\/([^/]+)\/?$/i);
    return m?.[1] ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

/** Hop pages hide site chrome. */
export function isHopPathname(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith(`${LINK_PUBLIC_PREFIX}/`) ||
    pathname.startsWith(`${LINK_LEGACY_PREFIX}/`)
  );
}

/** True for the dedicated share domain and legacy share hosts. */
export function isShareHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const h = host.split(":")[0].toLowerCase();
  return (
    h === SHARE_HOST.toLowerCase() ||
    h === `www.${SHARE_HOST.toLowerCase()}` ||
    LEGACY_SHARE_HOSTS.has(h)
  );
}

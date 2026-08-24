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

/** Alternate hosts that serve the same /p and /r pages (creator copy options). */
const SHARE_ALT_ORIGINS = [
  "https://yoururl.buzz",
  "https://go.deskzy.xyz",
  SITE_ORIGIN.replace(/\/$/, ""),
] as const;

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
 * Pastelink-style creator options: same paste, different domains.
 * Use another variant if a platform blocks the direct link.
 */
export function shareVariantsForCode(code: string): ShareVariant[] {
  const path = publicLinkPath(code);
  const primary = SHARE_ORIGIN.replace(/\/$/, "");
  const alts = SHARE_ALT_ORIGINS.filter(
    (o) => o.replace(/\/$/, "").toLowerCase() !== primary.toLowerCase(),
  );

  const variants: ShareVariant[] = [
    {
      id: "direct",
      label: "Direct link",
      hint: "Best default — start with this",
      url: `${primary}${path}`,
    },
  ];

  if (alts[0]) {
    variants.push({
      id: "facebook",
      label: "Facebook sharing link",
      hint: "Try if Facebook or similar blocks the direct link",
      url: `${alts[0].replace(/\/$/, "")}${path}`,
    });
  }
  if (alts[1]) {
    variants.push({
      id: "reddit",
      label: "Reddit sharing link",
      hint: "Backup domain for picky sites",
      url: `${alts[1].replace(/\/$/, "")}${path}`,
    });
  }

  return variants;
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

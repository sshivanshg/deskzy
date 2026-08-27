import type { Metadata } from "next";

export const SITE_NAME = "Deskzy";

function normalizeSiteUrl(value: string | undefined): string {
  const fallback = "https://deskzy.xyz";
  const raw = value?.trim() || fallback;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(withProtocol);
    return url.origin.replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

/** Share/paste host for published links (dedicated domain). */
export const SHARE_URL =
  process.env.NEXT_PUBLIC_SHARE_URL || "https://jfas.site";

export const DEFAULT_DESCRIPTION =
  "Deskzy is an AI-native tool system built for the agent era. Use focused actions directly or call them from agents and automations, with a free API tier and private browser-first file processing.";

/** Founder / support contact (X). Prefer a product email later if you add one. */
export const CONTACT_X_HANDLE = "sshivanshg";
export const CONTACT_X_URL = `https://x.com/${CONTACT_X_HANDLE}`;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: absoluteUrl("/og.png"),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/og.png")],
    },
  };
}

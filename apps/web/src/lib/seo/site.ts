import type { Metadata } from "next";

export const SITE_NAME = "Deskzy";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://deskzy.xyz";

export const DEFAULT_DESCRIPTION =
  "Free URL shortener on deskzy.xyz — plus private PDF and image tools in your browser. No signup. Most files never leave your device. Try Deskzy.";

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

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SHARE_HOST, SHARE_ORIGIN } from "@/lib/link-path";

/**
 * Published paste pages — no marketing chrome, no product brand in defaults.
 * Absolute title avoids root `%s | Deskzy` template.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SHARE_ORIGIN),
  title: { absolute: "Shared content" },
  applicationName: SHARE_HOST,
  authors: [{ name: SHARE_HOST, url: SHARE_ORIGIN }],
  creator: SHARE_HOST,
  openGraph: {
    siteName: SHARE_HOST,
    images: [],
  },
  twitter: {
    card: "summary",
    images: [],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  // Neutral icons only — do not inherit product favicon.ico.
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23f4f4f5'/%3E%3C/svg%3E",
        type: "image/svg+xml",
      },
    ],
    apple: [],
    shortcut: [],
  },
  // Do not inherit AdSense account meta on share pages.
  other: {},
};

/** Published paste pages — no header/footer/ads (avoids shortener fingerprints). */
export default function HopLayout({ children }: { children: ReactNode }) {
  return <main className="relative z-0 min-h-[100dvh]">{children}</main>;
}

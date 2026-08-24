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

export default function HopLayout({ children }: { children: ReactNode }) {
  return (
    <main className="hop-shell relative z-0 min-h-[100dvh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-8rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(248,194,221,0.38),rgba(248,194,221,0)_68%)] blur-3xl" />
        <div className="absolute right-[-10rem] top-[12rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(200,223,255,0.34),rgba(200,223,255,0)_68%)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-[-8rem] h-[24rem] bg-[radial-gradient(ellipse_at_center,rgba(244,228,210,0.45),rgba(244,228,210,0)_72%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.65)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
      </div>
      <div className="relative">{children}</div>
    </main>
  );
}

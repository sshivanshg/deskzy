import type { Metadata } from "next";
import { Analytics } from "@/components/Analytics";
import { SiteChromeGate } from "@/components/SiteChromeGate";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Outfit, Syne } from "next/font/google";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import "./globals.css";

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Every file tool. One place.`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Every file tool. One place.`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Every file tool. One place.`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Every file tool. One place.`,
    description: DEFAULT_DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${display.variable} antialiased`}>
        <SiteChromeGate mode="header">
          <SiteHeader />
        </SiteChromeGate>
        <SiteChromeGate mode="main">{children}</SiteChromeGate>
        <SiteChromeGate mode="footer">
          <SiteFooter />
        </SiteChromeGate>
        <Analytics />
      </body>
    </html>
  );
}

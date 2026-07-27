import type { Metadata } from "next";
import Link from "next/link";
import { Outfit, Syne } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
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
  title: {
    default: "Deskzy — Every file tool. One place.",
    template: "%s | Deskzy",
  },
  description:
    "Fast, private file tools in your browser. PDF, image, and text utilities with no signup wall.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://deskzy.xyz",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${display.variable} antialiased`}>
        <SiteHeader />
        <main className="relative z-0 min-h-[70dvh]">{children}</main>
        <footer className="relative z-0 mx-auto mt-8 max-w-6xl px-4 pb-12 pt-4">
          <div className="shell">
            <div className="shell-core flex flex-col gap-4 px-5 py-5 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
              <p className="font-display text-base font-semibold tracking-tight text-[var(--ink)]">
                Deskzy
              </p>
              <p className="max-w-md leading-relaxed">
                Drop. Done. Private. Files stay in your browser whenever
                possible.
              </p>
              <Link
                href="/about"
                className="font-medium text-[var(--ink)] underline-offset-4 hover:underline"
              >
                About & privacy
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

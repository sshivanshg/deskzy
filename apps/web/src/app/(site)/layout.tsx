import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/** Marketing / tools shell. Ads are deliberately limited to in-flow slots. */
export const metadata: Metadata = {};

/** Marketing / tools shell — header + footer. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="relative z-0 min-h-[70dvh]">{children}</main>
      <SiteFooter />
    </>
  );
}

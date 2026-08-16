import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  AdsterraPopunder,
  AdsterraSocialBar,
} from "@/components/Adsterra";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/** Adsterra + analytics live only on the product site — never on share/hop pages. */
export const metadata: Metadata = {
};

/** Marketing / tools shell — header + footer. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdsterraPopunder />
      <SiteHeader />
      <main className="relative z-0 min-h-[70dvh]">{children}</main>
      <SiteFooter />
      <AdsterraSocialBar />
    </>
  );
}

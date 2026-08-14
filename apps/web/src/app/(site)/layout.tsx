import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdSenseLoader } from "@/components/AdSenseLoader";
import { HilltopAds } from "@/components/HilltopAds";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ADSENSE_CLIENT } from "@/lib/ads";

/** AdSense + analytics live only on the product site — never on share/hop pages. */
export const metadata: Metadata = {
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
};

/** Marketing / tools shell — header + footer. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdSenseLoader />
      <SiteHeader />
      <main className="relative z-0 min-h-[70dvh]">{children}</main>
      <SiteFooter />
      <HilltopAds />
    </>
  );
}

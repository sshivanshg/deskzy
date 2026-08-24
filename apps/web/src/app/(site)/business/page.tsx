import type { Metadata } from "next";
import { BusinessLanding } from "@/components/BusinessLanding";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Business — private file tools & short links for teams",
  description:
    "Deskzy for teams: browser-first PDF and image tools, jfas.site short links with analytics, Pro API keys, and Business plans with SSO and custom contracts.",
  path: "/business",
  keywords: [
    "deskzy business",
    "team pdf tools",
    "private document tools",
    "url shortener for teams",
    "short link api",
  ],
});

export default function BusinessPage() {
  return <BusinessLanding />;
}

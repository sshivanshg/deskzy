import type { Metadata } from "next";
import { LinkAnalyticsLanding } from "@/components/LinkAnalyticsLanding";
import { buildPageMetadata } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildPageMetadata({
  title: "Link analytics — see who clicks your short links",
  description:
    "Deskzy Pro link analytics: daily charts, referrers, live click feeds, and custom slugs. Know which campaigns convert — from ₹225/month billed yearly.",
  path: "/link-analytics",
  keywords: [
    "link analytics",
    "url shortener analytics",
    "click tracking india",
    "deskzy pro",
    "short link stats",
  ],
});

export default async function LinkAnalyticsPage() {
  let loggedIn = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    loggedIn = Boolean(user);
  } catch {
    loggedIn = false;
  }

  return <LinkAnalyticsLanding loggedIn={loggedIn} />;
}

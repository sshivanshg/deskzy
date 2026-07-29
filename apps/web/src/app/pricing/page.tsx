import type { Metadata } from "next";
import { PricingPlans } from "@/components/PricingPlans";
import type { BillingCycle } from "@/lib/pricing";
import { clampSeats } from "@/lib/pricing";
import { buildPageMetadata } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing — Free, Pro & Business plans",
  description:
    "Deskzy pricing: free tools with daily limits, Pro from ₹399/user/month (or ₹2,699/year), and Business for 25+ seats. Private browser tools. Pay with Razorpay.",
  path: "/pricing",
  keywords: [
    "deskzy pricing",
    "pdf tools subscription",
    "ilovepdf alternative india",
    "cheap pdf tools india",
  ],
});

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ cycle?: string; seats?: string }>;
}) {
  const params = await searchParams;
  const initialCycle: BillingCycle =
    params.cycle === "monthly" ? "monthly" : "yearly";
  const initialSeats = clampSeats(Number(params.seats || 1));

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

  return (
    <PricingPlans
      loggedIn={loggedIn}
      initialCycle={initialCycle}
      initialSeats={initialSeats}
    />
  );
}

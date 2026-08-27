export type BillingCycle = "monthly" | "yearly";

export const PRO_SEAT_MIN = 1;
export const PRO_SEAT_MAX = 25;

/** Display / Razorpay amounts in INR (rupees). */
export const PRO_MONTHLY_INR = 399;
export const PRO_YEARLY_INR = 2699; // ~₹225/mo (−43% vs 399×12)

export const YEARLY_DISCOUNT_PCT = 43;

export function clampSeats(n: number): number {
  return Math.min(PRO_SEAT_MAX, Math.max(PRO_SEAT_MIN, Math.floor(n) || 1));
}

export function proUnitInr(cycle: BillingCycle): number {
  return cycle === "yearly" ? PRO_YEARLY_INR : PRO_MONTHLY_INR;
}

export function proTotalInr(seats: number, cycle: BillingCycle): number {
  return clampSeats(seats) * proUnitInr(cycle);
}

/** Effective monthly when billed yearly (rounded). */
export function proEffectiveMonthlyInr(): number {
  return Math.round(PRO_YEARLY_INR / 12);
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const FREE_FEATURES = [
  "Access to essential Deskzy tools",
  "Unlimited free shared links on deskzy.xyz",
  "Free API key · 25 requests per day",
  "Limited daily PDF & image processing",
  "Browser-first — files stay on your device",
] as const;

export const PRO_FEATURES = [
  "Full access to all Deskzy tools",
  "Unlimited PDF & image processing",
  "Custom share slugs (deskzy.xyz/you)",
  "Link click analytics dashboard",
  "Unlimited API requests · up to 5 keys",
  "Saved UTM & image presets",
  "Team seats — invite up to 25 members",
  "Priority customer support",
] as const;

export const BUSINESS_FEATURES = [
  "All Pro features",
  "Custom contracts designed for scalability",
  "Dedicated account manager",
  "Single Sign-On (SSO)",
  "Higher API rate limits",
] as const;

export const PRICING_FAQS = [
  {
    q: "What do I get with Free?",
    a: "Free includes all core tools, unlimited shared links, and one API key with 25 requests per day. PDF and image tools have daily processing limits. Files processed in the browser never leave your device.",
  },
  {
    q: "Why upgrade to Pro?",
    a: "Pro removes PDF/image daily limits, adds custom share slugs, click analytics, share-link API keys (Account → API), synced presets, and team seats. From ₹399 per user per month.",
  },
  {
    q: "Can I use the API for free?",
    a: "Yes. Every signed-in account can create one API key and call POST /api/links up to 25 times per day. Pro removes the daily request limit and supports up to five active keys.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Upgrade, change seats, or cancel from your account when billing goes live. No long lock-ins on self-serve Pro.",
  },
  {
    q: "Do you upload my PDFs or images?",
    a: "No. Browser tools process files locally. Only account data, usage counters, and URL strings for Share Link touch our servers — and we label hybrid tools clearly.",
  },
  {
    q: "How does Business pricing work?",
    a: "For 25+ seats we custom-quote contracts, SSO, invoicing, and higher API rate limits. Pro already includes share-link API keys. Contact sales and we’ll tailor a plan.",
  },
] as const;

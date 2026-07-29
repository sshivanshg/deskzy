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
  "Unlimited free short links",
  "Limited daily PDF & image processing",
  "Browser-first — files stay on your device",
] as const;

export const PRO_FEATURES = [
  "Unlimited PDF & image processing",
  "Custom short slugs (deskzy.xyz/you)",
  "Link click analytics dashboard",
  "Saved UTM & image presets",
  "Team seats (invite members)",
  "Priority support",
] as const;

export const BUSINESS_FEATURES = [
  "All Pro features",
  "Custom contracts designed for scalability",
  "Dedicated account manager",
  "Single Sign-On (SSO)",
  "API access & higher rate limits",
] as const;

export const PRICING_FAQS = [
  {
    q: "What do I get with Free?",
    a: "Free includes all core tools and unlimited short links. PDF and image tools have daily processing limits. Files processed in the browser never leave your device.",
  },
  {
    q: "Why upgrade to Pro?",
    a: "Pro removes PDF/image daily limits, adds custom short slugs, click analytics, synced presets, and team seats. From ₹399 per user per month.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Upgrade, change seats, or cancel from your account when billing goes live. No long lock-ins on self-serve Pro.",
  },
  {
    q: "Do you upload my PDFs or images?",
    a: "No. Browser tools process files locally. Only account data, usage counters, and URL strings for the shortener touch our servers — and we label hybrid tools clearly.",
  },
  {
    q: "How does Business pricing work?",
    a: "For 25+ seats we custom-quote contracts, SSO, invoicing, and API limits. Contact sales and we’ll tailor a plan.",
  },
] as const;

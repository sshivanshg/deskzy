import type { BillingCycle } from "@/lib/pricing";

export type PlanId = "free" | "pro" | "business";

export type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: PlanId;
  status: string;
  billing_cycle: BillingCycle | null;
  seats: number;
  razorpay_subscription_id: string | null;
  current_period_end: string | null;
};

const ACTIVE_STATUSES = new Set(["active", "authenticated"]);

export function isPaidActive(sub: Pick<SubscriptionRow, "plan" | "status"> | null): boolean {
  if (!sub) return false;
  return (sub.plan === "pro" || sub.plan === "business") && ACTIVE_STATUSES.has(sub.status);
}

export function planFromSubscription(
  sub: Pick<SubscriptionRow, "plan" | "status"> | null,
): PlanId {
  return isPaidActive(sub) ? sub!.plan : "free";
}

/** Free daily caps (iLovePDF-style). Unlimited tools use Infinity. */
export const FREE_DAILY_CAPS: Record<string, number> = {
  "api-links": 25,
  "merge-pdf": 2,
  "split-pdf": 2,
  "compress-pdf": 2,
  "reorder-pdf": 2,
  "pdf-to-images": 2,
  "compress-image": 5,
  "resize-image": 5,
  "convert-image": 5,
  "webp-to-png": 5,
  // url-shortener: unlimited on Free (abuse still rate-limited per IP)
};

export function freeDailyCap(toolSlug: string): number | null {
  if (!(toolSlug in FREE_DAILY_CAPS)) return null; // unlimited
  return FREE_DAILY_CAPS[toolSlug];
}

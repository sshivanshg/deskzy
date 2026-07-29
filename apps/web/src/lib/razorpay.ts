import type { BillingCycle } from "@/lib/pricing";

type RazorpaySubscription = {
  id: string;
  status: string;
  plan_id: string;
  quantity: number;
  current_end?: number | null;
  customer_id?: string | null;
};

function authHeader(): string {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) {
    throw new Error("Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET");
  }
  return `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`;
}

export function razorpayPlanId(cycle: BillingCycle): string {
  const id =
    cycle === "yearly"
      ? process.env.RAZORPAY_PLAN_YEARLY_ID
      : process.env.RAZORPAY_PLAN_MONTHLY_ID;
  if (!id) {
    throw new Error(
      cycle === "yearly"
        ? "Missing RAZORPAY_PLAN_YEARLY_ID"
        : "Missing RAZORPAY_PLAN_MONTHLY_ID",
    );
  }
  return id;
}

export function isRazorpayConfigured(): boolean {
  return Boolean(
    (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) &&
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.RAZORPAY_PLAN_MONTHLY_ID &&
      process.env.RAZORPAY_PLAN_YEARLY_ID,
  );
}

export async function createRazorpaySubscription(input: {
  cycle: BillingCycle;
  seats: number;
  userId: string;
  email?: string | null;
}): Promise<RazorpaySubscription> {
  const planId = razorpayPlanId(input.cycle);
  // Enough cycles that “cancel anytime” feels unlimited; Razorpay requires total_count.
  const totalCount = input.cycle === "yearly" ? 20 : 120;

  const res = await fetch("https://api.razorpay.com/v1/subscriptions", {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      total_count: totalCount,
      quantity: input.seats,
      customer_notify: 1,
      notes: {
        user_id: input.userId,
        email: input.email || "",
        cycle: input.cycle,
        seats: String(input.seats),
      },
    }),
  });

  const data = (await res.json()) as RazorpaySubscription & {
    error?: { description?: string };
  };
  if (!res.ok) {
    throw new Error(data.error?.description || "Failed to create Razorpay subscription");
  }
  return data;
}

export async function verifySubscriptionPaymentSignature(input: {
  paymentId: string;
  subscriptionId: string;
  signature: string;
}): Promise<boolean> {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const payload = `${input.paymentId}|${input.subscriptionId}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const hex = Buffer.from(sig).toString("hex");
  return timingSafeEqual(hex, input.signature);
}

export async function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
): Promise<boolean> {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const hex = Buffer.from(sig).toString("hex");
  return timingSafeEqual(hex, signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

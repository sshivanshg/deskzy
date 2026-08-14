import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { createServiceClient } from "@/lib/supabase/admin";

type WebhookBody = {
  event?: string;
  payload?: {
    subscription?: {
      entity?: {
        id?: string;
        status?: string;
        quantity?: number;
        plan_id?: string;
        customer_id?: string | null;
        current_end?: number | null;
        notes?: { user_id?: string; cycle?: string; seats?: string };
      };
    };
  };
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const valid = await verifyWebhookSignature(rawBody, signature);
  if (!valid) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let event: WebhookBody;
  try {
    event = JSON.parse(rawBody) as WebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sub = event.payload?.subscription?.entity;
  if (!sub?.id) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const status = sub.status || "pending";
  const activeLike = status === "active" || status === "authenticated";
  const plan = activeLike ? "pro" : "pro";
  const seats = Number(sub.quantity || sub.notes?.seats || 1);
  const cycle =
    sub.notes?.cycle === "monthly" || sub.notes?.cycle === "yearly"
      ? sub.notes.cycle
      : null;

  const admin = createServiceClient();
  const patch = {
    status,
    plan: activeLike || status === "created" || status === "pending" ? plan : "free",
    seats: Number.isFinite(seats) ? seats : 1,
    billing_cycle: cycle,
    razorpay_plan_id: sub.plan_id || null,
    razorpay_customer_id: sub.customer_id || null,
    current_period_end: sub.current_end
      ? new Date(sub.current_end * 1000).toISOString()
      : null,
    updated_at: new Date().toISOString(),
  };

  // Prefer update by razorpay id; insert if missing and we have user_id in notes
  const { data: existing } = await admin
    .from("subscriptions")
    .select("id")
    .eq("razorpay_subscription_id", sub.id)
    .maybeSingle();

  if (existing?.id) {
    await admin.from("subscriptions").update(patch).eq("id", existing.id);
  } else if (sub.notes?.user_id) {
    await admin.from("subscriptions").insert({
      user_id: sub.notes.user_id,
      razorpay_subscription_id: sub.id,
      ...patch,
    });
  }

  // Downgrade mapping for cancelled/halted/expired
  if (["cancelled", "halted", "completed", "expired"].includes(status)) {
    await admin
      .from("subscriptions")
      .update({ plan: "free", status, updated_at: new Date().toISOString() })
      .eq("razorpay_subscription_id", sub.id);
  }

  return NextResponse.json({ ok: true });
}

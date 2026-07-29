import { NextRequest, NextResponse } from "next/server";
import {
  BillingCycle,
  PRO_SEAT_MAX,
  PRO_SEAT_MIN,
  clampSeats,
} from "@/lib/pricing";
import {
  createRazorpaySubscription,
  isRazorpayConfigured,
} from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: "Billing is not configured yet" },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const body = (await req.json()) as {
      cycle?: BillingCycle;
      seats?: number;
    };
    const cycle: BillingCycle = body.cycle === "monthly" ? "monthly" : "yearly";
    const seats = clampSeats(body.seats ?? 1);
    if (seats < PRO_SEAT_MIN || seats > PRO_SEAT_MAX) {
      return NextResponse.json({ error: "Invalid seat count" }, { status: 400 });
    }

    const subscription = await createRazorpaySubscription({
      cycle,
      seats,
      userId: user.id,
      email: user.email,
    });

    const admin = createServiceClient();
    const { error: upsertError } = await admin.from("subscriptions").upsert(
      {
        user_id: user.id,
        plan: "pro",
        status: subscription.status || "created",
        billing_cycle: cycle,
        seats,
        razorpay_subscription_id: subscription.id,
        razorpay_plan_id: subscription.plan_id,
        razorpay_customer_id: subscription.customer_id || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "razorpay_subscription_id" },
    );

    // If unique on razorpay id only — also ensure one row per user for latest
    if (upsertError) {
      // Fallback: insert without onConflict if constraint missing yet
      await admin.from("subscriptions").insert({
        user_id: user.id,
        plan: "pro",
        status: subscription.status || "created",
        billing_cycle: cycle,
        seats,
        razorpay_subscription_id: subscription.id,
        razorpay_plan_id: subscription.plan_id,
        razorpay_customer_id: subscription.customer_id || null,
      });
    }

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      cycle,
      seats,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

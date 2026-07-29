import { NextRequest, NextResponse } from "next/server";
import { verifySubscriptionPaymentSignature } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const body = (await req.json()) as {
      razorpay_payment_id?: string;
      razorpay_subscription_id?: string;
      razorpay_signature?: string;
    };

    const paymentId = body.razorpay_payment_id || "";
    const subscriptionId = body.razorpay_subscription_id || "";
    const signature = body.razorpay_signature || "";

    if (!paymentId || !subscriptionId || !signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    const ok = await verifySubscriptionPaymentSignature({
      paymentId,
      subscriptionId,
      signature,
    });
    if (!ok) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const admin = createServiceClient();
    const { error } = await admin
      .from("subscriptions")
      .update({
        status: "active",
        plan: "pro",
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_subscription_id", subscriptionId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verify failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

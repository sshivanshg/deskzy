import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  isPaidActive,
  type PlanId,
  type SubscriptionRow,
} from "@/lib/entitlements";

export async function getUserPlan(userId: string | null | undefined): Promise<{
  plan: PlanId;
  subscription: SubscriptionRow | null;
}> {
  if (!userId) return { plan: "free", subscription: null };
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("subscriptions")
      .select(
        "id,user_id,plan,status,billing_cycle,seats,razorpay_subscription_id,current_period_end",
      )
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const sub = (data as SubscriptionRow | null) ?? null;
    return { plan: isPaidActive(sub) ? sub!.plan : "free", subscription: sub };
  } catch {
    return { plan: "free", subscription: null };
  }
}

export async function persistOwnedLink(input: {
  code: string;
  dest: string;
  userId: string;
  isCustom: boolean;
}): Promise<void> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    const admin = createServiceClient();
    await admin.from("short_links").upsert(
      {
        code: input.code,
        dest: input.dest,
        user_id: input.userId,
        is_custom: input.isCustom,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "code" },
    );
  } catch {
    /* non-fatal */
  }
}

export async function recordLinkClick(input: {
  code: string;
  referrer?: string | null;
  userAgent?: string | null;
}): Promise<{ recorded: boolean; reason?: string }> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { recorded: false, reason: "no_service_role" };
  }
  try {
    const admin = createServiceClient();
    const { data: link, error: linkErr } = await admin
      .from("short_links")
      .select("code,hits")
      .eq("code", input.code)
      .maybeSingle();
    if (linkErr) return { recorded: false, reason: linkErr.message };
    if (!link) return { recorded: false, reason: "link_not_owned" };

    const { error: clickErr } = await admin.from("link_clicks").insert({
      code: input.code,
      referrer: input.referrer?.slice(0, 500) || null,
      user_agent: input.userAgent?.slice(0, 300) || null,
    });
    if (clickErr) return { recorded: false, reason: clickErr.message };

    await admin
      .from("short_links")
      .update({
        hits: (link.hits ?? 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("code", input.code);

    return { recorded: true };
  } catch (e) {
    return {
      recorded: false,
      reason: e instanceof Error ? e.message : "unknown",
    };
  }
}

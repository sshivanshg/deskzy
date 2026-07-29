import { createClient } from "@/lib/supabase/server";
import { isPaidActive, type SubscriptionRow } from "@/lib/entitlements";
import { freeDailyCap } from "@/lib/entitlements";
import { createServiceClient } from "@/lib/supabase/admin";

export type UsageCheckResult =
  | { ok: true; plan: "free" | "pro" | "business"; remaining: number | null }
  | { ok: false; plan: "free"; limit: number; used: number };

/** Check (and optionally increment) daily usage for Free users. Pro/Business skip caps. */
export async function checkAndIncrementUsage(input: {
  toolSlug: string;
  userId?: string | null;
  anonKey?: string | null;
  increment?: boolean;
}): Promise<UsageCheckResult> {
  const cap = freeDailyCap(input.toolSlug);
  if (cap === null) {
    return { ok: true, plan: "free", remaining: null };
  }

  let plan: "free" | "pro" | "business" = "free";

  if (input.userId) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("subscriptions")
        .select("plan,status")
        .eq("user_id", input.userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const sub = data as Pick<SubscriptionRow, "plan" | "status"> | null;
      if (isPaidActive(sub)) {
        plan = sub!.plan;
        return { ok: true, plan, remaining: null };
      }
    } catch {
      // Fall through to free limits if entitlements unavailable
    }
  }

  // Without service role / DB, fail open for local tools but shortener can still IP-limit.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { ok: true, plan: "free", remaining: null };
  }

  const admin = createServiceClient();
  const day = new Date().toISOString().slice(0, 10);

  let query = admin
    .from("usage_daily")
    .select("id,count")
    .eq("tool_slug", input.toolSlug)
    .eq("day", day);

  if (input.userId) query = query.eq("user_id", input.userId);
  else if (input.anonKey) query = query.eq("anon_key", input.anonKey);
  else return { ok: true, plan: "free", remaining: null };

  const { data: row } = await query.maybeSingle();
  const used = row?.count ?? 0;

  if (used >= cap) {
    return { ok: false, plan: "free", limit: cap, used };
  }

  if (input.increment !== false) {
    if (row?.id) {
      await admin
        .from("usage_daily")
        .update({ count: used + 1, updated_at: new Date().toISOString() })
        .eq("id", row.id);
    } else {
      await admin.from("usage_daily").insert({
        user_id: input.userId || null,
        anon_key: input.userId ? null : input.anonKey || null,
        tool_slug: input.toolSlug,
        day,
        count: 1,
      });
    }
  }

  return { ok: true, plan: "free", remaining: cap - used - 1 };
}

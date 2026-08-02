import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AccountDashboard } from "@/components/AccountDashboard";
import { isPaidActive, type SubscriptionRow } from "@/lib/entitlements";
import { buildPageMetadata } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";
import type { BillingCycle } from "@/lib/pricing";

export const metadata: Metadata = buildPageMetadata({
  title: "Account",
  description: "Manage your Deskzy membership, Pro benefits, links, and team seats.",
  path: "/account",
});

function statusLabel(paid: boolean, status: string | undefined): string {
  if (paid) {
    if (status === "authenticated" || status === "active") return "Active membership";
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Active membership";
  }
  if (!status || status === "inactive") return "Free plan";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string; joined?: string; tab?: string }>;
}) {
  const params = await searchParams;
  let user = null as { id: string; email?: string } | null;
  let sub: SubscriptionRow | null = null;
  let configured = true;

  const nextPath =
    params.tab && params.tab.length > 0
      ? `/account?tab=${encodeURIComponent(params.tab)}`
      : "/account";

  try {
    const supabase = await createClient();
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    if (!u) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
    user = { id: u.id, email: u.email ?? undefined };

    const { data } = await supabase
      .from("subscriptions")
      .select(
        "id,user_id,plan,status,billing_cycle,seats,razorpay_subscription_id,current_period_end",
      )
      .eq("user_id", u.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    sub = (data as SubscriptionRow | null) ?? null;
  } catch {
    configured = false;
  }

  if (!configured || !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="font-display text-3xl font-semibold">Account</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Supabase is not configured. Add env vars and restart the server.
        </p>
      </div>
    );
  }

  const paid = isPaidActive(sub);
  const planLabel =
    paid && sub?.plan === "business"
      ? "Business"
      : paid
        ? "Pro"
        : "Free";

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-[var(--muted)]">
          Loading account…
        </div>
      }
    >
      <AccountDashboard
        email={user.email || "member"}
        paid={paid}
        planLabel={planLabel}
        statusLabel={statusLabel(paid, sub?.status)}
        seats={sub?.seats ?? 1}
        billingCycle={(sub?.billing_cycle as BillingCycle | null) ?? null}
        periodEnd={sub?.current_period_end ?? null}
        flash={params.upgraded ? "upgraded" : params.joined ? "joined" : null}
      />
    </Suspense>
  );
}

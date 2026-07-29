import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountProPanel } from "@/components/AccountProPanel";
import { SignOutButton } from "@/components/SignOutButton";
import { formatInr, proUnitInr } from "@/lib/pricing";
import { isPaidActive, type SubscriptionRow } from "@/lib/entitlements";
import { buildPageMetadata } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildPageMetadata({
  title: "Account",
  description: "Manage your Deskzy account and Pro subscription.",
  path: "/account",
});

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string; joined?: string }>;
}) {
  const params = await searchParams;
  let user = null as { id: string; email?: string } | null;
  let sub: SubscriptionRow | null = null;
  let configured = true;

  try {
    const supabase = await createClient();
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    if (!u) redirect("/login?next=/account");
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

  return (
    <div className="mx-auto max-w-lg px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Account</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">{user.email}</p>

      {params.upgraded ? (
        <p className="mt-4 rounded-xl bg-[var(--ok-bg)] px-3 py-2 text-sm text-[var(--ok-ink)]">
          Welcome to Pro — your subscription is active.
        </p>
      ) : null}
      {params.joined ? (
        <p className="mt-4 rounded-xl bg-[var(--ok-bg)] px-3 py-2 text-sm text-[var(--ok-ink)]">
          You joined a Pro team seat.
        </p>
      ) : null}

      <div className="mt-8 shell">
        <div className="shell-core space-y-3 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Plan
              </p>
              <p className="mt-1 font-display text-xl font-semibold">
                {paid ? "Pro" : "Free"}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                paid
                  ? "bg-[var(--ok-bg)] text-[var(--ok-ink)]"
                  : "bg-[var(--surface)] text-[var(--muted)]"
              }`}
            >
              {sub?.status || "inactive"}
            </span>
          </div>

          {paid && sub ? (
            <ul className="space-y-1 text-sm text-[var(--muted)]">
              <li>
                Seats: <span className="text-[var(--ink)]">{sub.seats}</span>
              </li>
              <li>
                Billing:{" "}
                <span className="text-[var(--ink)]">
                  {sub.billing_cycle
                    ? `${formatInr(proUnitInr(sub.billing_cycle))} / user / ${sub.billing_cycle === "yearly" ? "year" : "month"}`
                    : "—"}
                </span>
              </li>
              {sub.current_period_end ? (
                <li>
                  Current period ends:{" "}
                  <span className="text-[var(--ink)]">
                    {new Date(sub.current_period_end).toLocaleDateString("en-IN")}
                  </span>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              You&apos;re on Free with daily tool limits.{" "}
              <Link href="/pricing" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
                Upgrade to Pro
              </Link>
            </p>
          )}
        </div>
      </div>

      <AccountProPanel paid={paid} />

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="inline-flex rounded-full border border-[var(--stroke)] bg-white/70 px-4 py-2 text-sm font-medium hover:border-[var(--stroke-strong)]"
        >
          View pricing
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
}

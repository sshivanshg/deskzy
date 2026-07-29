"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Check,
  Crown,
  Gift,
  Minus,
  Plus,
  XLogo,
} from "@phosphor-icons/react";
import { ProCheckoutButton } from "@/components/ProCheckoutButton";
import {
  BUSINESS_FEATURES,
  BillingCycle,
  FREE_FEATURES,
  PRICING_FAQS,
  PRO_FEATURES,
  PRO_SEAT_MAX,
  PRO_SEAT_MIN,
  YEARLY_DISCOUNT_PCT,
  clampSeats,
  formatInr,
  proEffectiveMonthlyInr,
  proTotalInr,
  proUnitInr,
} from "@/lib/pricing";
import { CONTACT_X_URL } from "@/lib/seo/site";

export function PricingPlans({
  loggedIn = false,
  initialCycle = "yearly",
  initialSeats = 1,
}: {
  loggedIn?: boolean;
  initialCycle?: BillingCycle;
  initialSeats?: number;
}) {
  const [cycle, setCycle] = useState<BillingCycle>(initialCycle);
  const [seats, setSeats] = useState(clampSeats(initialSeats));
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const unit = proUnitInr(cycle);
  const total = proTotalInr(seats, cycle);
  const effectiveMonthly = proEffectiveMonthlyInr();

  const proPriceLabel = useMemo(() => {
    if (cycle === "yearly") {
      return {
        primary: `${formatInr(effectiveMonthly)} / month`,
        secondary:
          seats === 1
            ? `${formatInr(total)} billed annually`
            : `${formatInr(unit)} × ${seats} = ${formatInr(total)} billed annually`,
      };
    }
    return {
      primary: formatInr(unit),
      secondary:
        seats === 1
          ? "Billed monthly"
          : `${formatInr(total)} for ${seats} users · billed monthly`,
    };
  }, [cycle, effectiveMonthly, seats, total, unit]);

  const setSeatCount = (next: number) => setSeats(clampSeats(next));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Pricing
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Choose the plan that suits you
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
          Free tools with daily limits — like the PDF tools you already know.
          Pro is slightly cheaper, private by default, and built for Deskzy.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <div
          className="relative inline-flex rounded-full border border-[var(--stroke)] bg-white/60 p-1"
          role="group"
          aria-label="Billing cycle"
        >
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              cycle === "monthly"
                ? "bg-[var(--ink)] text-white"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
            aria-pressed={cycle === "monthly"}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setCycle("yearly")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              cycle === "yearly"
                ? "bg-[var(--ink)] text-white"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
            aria-pressed={cycle === "yearly"}
          >
            Yearly Billing
          </button>
        </div>
        {cycle === "yearly" ? (
          <span className="rounded-full bg-[var(--ok-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--ok-ink)]">
            −{YEARLY_DISCOUNT_PCT}%
          </span>
        ) : (
          <span className="h-5" aria-hidden />
        )}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:items-stretch">
        {/* Free */}
        <article className="shell flex h-full flex-col">
          <div className="shell-core flex h-full flex-col p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--ink)]">
                  <Gift size={22} weight="duotone" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-tight">
                    Free
                  </h2>
                  <p className="text-xs text-[var(--muted)]">1 user</p>
                </div>
              </div>
            </div>

            <p className="mt-6 font-display text-4xl font-semibold tracking-tight">
              Free
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-[var(--accent)] bg-transparent px-4 py-2.5 text-sm font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
            >
              Start for free
            </Link>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Free features include
            </p>
            <ul className="mt-3 space-y-2.5">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex gap-2 text-sm leading-snug text-[var(--ink)]">
                  <span className="mt-0.5 shrink-0 text-[var(--ok-ink)]">
                    <Check size={18} weight="bold" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* Pro */}
        <article className="shell flex h-full flex-col ring-1 ring-[var(--accent)]/25">
          <div className="shell-core flex h-full flex-col bg-[color-mix(in_srgb,var(--accent-soft)_55%,var(--bg-elevated))] p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent)] text-white">
                  <Crown size={22} weight="fill" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-tight">
                    Pro
                  </h2>
                  <p className="text-xs text-[var(--muted)]">1 – 25 users</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                {cycle === "yearly"
                  ? proPriceLabel.primary
                  : seats === 1
                    ? formatInr(unit)
                    : `${formatInr(unit)} × ${seats}`}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {proPriceLabel.secondary}
              </p>
            </div>

            <div className="mt-5">
              <ProCheckoutButton
                cycle={cycle}
                seats={seats}
                loggedIn={loggedIn}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-[var(--stroke)] bg-white/50 px-3 py-3">
              <p className="text-xs font-medium text-[var(--muted)]">
                How many users do you need? (Up to {PRO_SEAT_MAX})
              </p>
              <div className="mt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--stroke)] bg-white text-[var(--ink)] disabled:opacity-40"
                  onClick={() => setSeatCount(seats - 1)}
                  disabled={seats <= PRO_SEAT_MIN}
                  aria-label="Decrease seats"
                >
                  <Minus size={16} weight="bold" />
                </button>
                <input
                  type="number"
                  min={PRO_SEAT_MIN}
                  max={PRO_SEAT_MAX}
                  value={seats}
                  onChange={(e) => setSeatCount(Number(e.target.value))}
                  className="field !w-16 !rounded-xl !py-2 !text-center !text-base font-semibold"
                  aria-label="Number of Pro seats"
                />
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--stroke)] bg-white text-[var(--ink)] disabled:opacity-40"
                  onClick={() => setSeatCount(seats + 1)}
                  disabled={seats >= PRO_SEAT_MAX}
                  aria-label="Increase seats"
                >
                  <Plus size={16} weight="bold" />
                </button>
              </div>
            </div>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Pro features include
            </p>
            <ul className="mt-3 space-y-2.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex gap-2 text-sm leading-snug text-[var(--ink)]">
                  <span className="mt-0.5 shrink-0 text-[var(--ok-ink)]">
                    <Check size={18} weight="bold" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* Business */}
        <article className="shell flex h-full flex-col">
          <div className="shell-core flex h-full flex-col p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--ink)] text-white">
                  <Briefcase size={22} weight="fill" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-tight">
                    Business
                  </h2>
                  <p className="text-xs text-[var(--muted)]">25+ users</p>
                </div>
              </div>
            </div>

            <p className="mt-6 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Let&apos;s talk
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Scalable solutions for your business with customized pricing.
            </p>

            <a
              href={CONTACT_X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--stroke-strong)] bg-white/70 px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
            >
              <XLogo size={16} weight="bold" />
              Contact sales
            </a>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              What&apos;s included
            </p>
            <ul className="mt-3 space-y-2.5">
              {BUSINESS_FEATURES.map((f) => (
                <li key={f} className="flex gap-2 text-sm leading-snug text-[var(--ink)]">
                  <span className="mt-0.5 shrink-0 text-[var(--ok-ink)]">
                    <Check size={18} weight="bold" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      {/* Compare */}
      <section className="mt-14" aria-labelledby="compare-heading">
        <h2
          id="compare-heading"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          Compare the plans
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--stroke)] bg-white/40">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--stroke)] bg-[var(--surface)]/60">
                <th className="px-4 py-3 font-medium text-[var(--muted)]">
                  Feature
                </th>
                <th className="px-4 py-3 font-medium">Free</th>
                <th className="px-4 py-3 font-medium text-[var(--accent)]">Pro</th>
                <th className="px-4 py-3 font-medium">Business</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Best for", "Simple use", "Advanced use", "Growing teams"],
                ["Tools", "Essential", "All tools", "All tools"],
                ["Daily PDF & image", "Limited", "Unlimited", "Unlimited"],
                ["Short links", "Unlimited", "Unlimited", "Unlimited"],
                ["Files leave device", "Never*", "Never*", "Never*"],
                ["Link analytics", "—", "Yes", "Yes"],
                ["Custom short slugs", "—", "Yes", "Yes"],
                ["Saved presets", "—", "Yes", "Yes"],
                ["Team seats", "1", "1–25", "25+"],
                ["SSO", "—", "—", "Yes"],
                ["API access", "—", "—", "Yes"],
              ].map(([feature, free, pro, biz]) => (
                <tr
                  key={feature}
                  className="border-b border-[var(--stroke)] last:border-b-0"
                >
                  <td className="px-4 py-3 text-[var(--muted)]">{feature}</td>
                  <td className="px-4 py-3">{free}</td>
                  <td className="px-4 py-3 font-medium">{pro}</td>
                  <td className="px-4 py-3">{biz}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          * Browser PDF &amp; image tools process locally. The URL shortener only
          sends the URL string.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-14 max-w-3xl" aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          Frequently asked questions
        </h2>
        <div className="mt-4 space-y-2">
          {PRICING_FAQS.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.q} className="shell">
                <div className="shell-core overflow-hidden">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium md:text-[15px]"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    {item.q}
                    <span className="text-[var(--muted)]">{open ? "−" : "+"}</span>
                  </button>
                  {open ? (
                    <p className="border-t border-[var(--stroke)] px-4 py-3 text-sm leading-relaxed text-[var(--muted)]">
                      {item.a}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChartLineUp,
  Check,
  CursorClick,
  GlobeHemisphereWest,
  LockSimple,
  MapPin,
  Devices,
  ShareNetwork,
} from "@phosphor-icons/react";
import { ClippedAreaChart } from "@/components/ui/advanced-stats-utils/charts";
import { GlobeAnalytics } from "@/components/ui/cobe-globe-analytics";
import { ProCheckoutButton } from "@/components/ProCheckoutButton";
import {
  formatInr,
  PRO_FEATURES,
  PRO_MONTHLY_INR,
  proEffectiveMonthlyInr,
} from "@/lib/pricing";

const LANDING_GEO_MARKERS = [
  { id: "in", location: [19.08, 72.88] as [number, number], visitors: 1596, trend: 12 },
  { id: "us", location: [40.71, -74.01] as [number, number], visitors: 924, trend: 8 },
  { id: "gb", location: [51.51, -0.13] as [number, number], visitors: 378, trend: -2 },
  { id: "de", location: [52.52, 13.41] as [number, number], visitors: 294, trend: 5 },
  { id: "sg", location: [1.35, 103.82] as [number, number], visitors: 252, trend: 15 },
  { id: "ae", location: [25.2, 55.27] as [number, number], visitors: 210, trend: 4 },
];

const FEATURES = [
  {
    icon: ChartLineUp,
    title: "Daily click charts",
    body: "See which days your campaigns actually move — not just a raw hit counter.",
  },
  {
    icon: ShareNetwork,
    title: "Referrer breakdown",
    body: "Know whether Instagram, WhatsApp, email, or direct traffic is doing the work.",
  },
  {
    icon: GlobeHemisphereWest,
    title: "Click geography",
    body: "Watch opens land on a live globe — cities, countries, and trends as campaigns heat up.",
  },
  {
    icon: Devices,
    title: "Custom branded slugs",
    body: "deskzy.xyz/your-brand instead of random codes — trust that converts.",
  },
];

export function LinkAnalyticsLanding({ loggedIn = false }: { loggedIn?: boolean }) {
  const [visible, setVisible] = useState(false);
  const monthly = formatInr(proEffectiveMonthlyInr());

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 md:pt-14">
      {/* Hero — brand + one job */}
      <section
        className={`relative overflow-hidden rounded-[var(--radius-shell)] border border-[var(--shell-outer-border)] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(145deg, color-mix(in srgb, var(--accent-soft) 55%, var(--bg-elevated)) 0%, var(--bg-elevated) 45%, var(--body-bottom) 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 42%), radial-gradient(circle at 88% 10%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 36%)",
          }}
          aria-hidden
        />
        <div className="relative grid items-center gap-10 px-6 py-12 md:grid-cols-2 md:gap-12 md:px-12 md:py-16">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-ink)]">
              Deskzy Pro · Link analytics
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
              Know who&apos;s clicking — then charge for the outcome
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--muted)] md:text-lg">
              Free published links are unlimited. Pro adds the dashboard that
              turns every click into geography, referrers, and live proof your
              campaign worked.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#upgrade"
                className="btn-primary !rounded-full !px-6 !py-3.5 text-sm"
              >
                Unlock analytics
                <span className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                  <ArrowRight size={14} weight="bold" />
                </span>
              </Link>
              <Link
                href="/tools/url-shortener"
                className="btn-secondary !rounded-full !px-5 !py-3.5 text-sm"
              >
                Publish a link free
              </Link>
            </div>
            <p className="mt-4 text-xs text-[var(--muted)]">
              From {monthly}/mo billed yearly · cancel anytime
            </p>
          </div>

          <div className="shell">
            <div className="shell-core p-4 md:p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Sample · last 30 days
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold tabular-nums tracking-tight">
                    4,286 clicks
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                  <CursorClick size={12} weight="bold" />
                  Live
                </span>
              </div>
              <div className="mt-4">
                <ClippedAreaChart compact showAxes={false} className="min-h-[120px]" />
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-[var(--stroke)]/80 bg-[var(--surface)]/40 px-2 py-2">
                <GlobeAnalytics
                  markers={LANDING_GEO_MARKERS}
                  className="w-[72px] shrink-0"
                  speed={0.004}
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Click geography
                  </p>
                  <p className="mt-0.5 text-sm font-semibold tracking-tight text-[var(--ink)]">
                    Live from 6 countries
                  </p>
                </div>
              </div>
              <ul className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--stroke)] pt-4 text-center">
                {[
                  { label: "Instagram", value: "28%" },
                  { label: "WhatsApp", value: "21%" },
                  { label: "Direct", value: "18%" },
                ].map((r) => (
                  <li key={r.label}>
                    <p className="font-display text-lg font-semibold tabular-nums tracking-tight text-[var(--ink)]">
                      {r.value}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      {r.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* One job: features */}
      <section className="mt-20 md:mt-28">
        <div className="max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            What you unlock
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Analytics built for people who ship links
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
            Not a vanity counter. A calm Pro surface so founders, creators, and
            teams know what actually performed.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="shell transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <div className="shell-core flex gap-4 p-5 md:p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon size={22} weight="duotone" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
                      {f.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Region showoff */}
      <section className="mt-20 md:mt-28">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Click geography
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              See where your audience actually is
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-[var(--muted)]">
              Pro maps every redirect to cities and countries so you know which
              markets are warming up — drag the globe, watch live visitor chips.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm sm:max-w-sm">
              {[
                { name: "India", share: "38%" },
                { name: "United States", share: "22%" },
                { name: "United Kingdom", share: "9%" },
                { name: "Germany", share: "7%" },
              ].map((c) => (
                <li
                  key={c.name}
                  className="rounded-xl border border-[var(--stroke)] bg-[var(--panel-soft)] px-3 py-2.5"
                >
                  <span className="font-semibold text-[var(--ink)]">{c.name}</span>
                  <span className="ml-1.5 tabular-nums text-[var(--muted)]">
                    {c.share}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="shell">
            <div className="shell-core flex justify-center p-4 md:p-6">
              <GlobeAnalytics
                markers={LANDING_GEO_MARKERS}
                className="w-full max-w-[320px] md:max-w-[380px]"
                speed={0.0025}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="mt-20 md:mt-28">
        <div className="shell">
          <div className="shell-core grid gap-0 md:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "Campaign clarity",
                body: "Stop guessing which bio link, QR, or DM drove the spike.",
              },
              {
                icon: LockSimple,
                title: "Private by default",
                body: "Browser tools stay local. Only URL strings and click events touch the server.",
              },
              {
                icon: Check,
                title: "Same Pro you already need",
                body: "Analytics ships with unlimited PDF tools, custom slugs, presets, and seats.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`p-6 md:p-8 ${
                    idx > 0 ? "border-t border-[var(--stroke)] md:border-l md:border-t-0" : ""
                  }`}
                >
                  <span className="text-[var(--accent)]">
                    <Icon size={22} weight="duotone" />
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upgrade CTA */}
      <section id="upgrade" className="mt-20 scroll-mt-24 md:mt-28">
        <div className="shell">
          <div className="shell-core grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Pro membership
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                One plan. Full click story.
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-[var(--muted)]">
                Upgrade once — unlock link analytics plus the rest of Deskzy Pro.
                Yearly works out to {monthly}/month.
              </p>
              <ul className="mt-6 space-y-2.5">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--ink)]">
                    <span className="mt-0.5 shrink-0 text-[var(--accent)]">
                      <Check size={16} weight="bold" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-center rounded-[1.2rem] border border-[var(--stroke)] bg-[var(--panel-soft)] p-6 md:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Starting at
              </p>
              <p className="mt-2 font-display text-4xl font-semibold tracking-tight">
                {monthly}
                <span className="text-lg font-medium text-[var(--muted)]"> / mo</span>
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Billed yearly · or {formatInr(PRO_MONTHLY_INR)} monthly
              </p>
              <div className="mt-6">
                <ProCheckoutButton
                  cycle="yearly"
                  seats={1}
                  loggedIn={loggedIn}
                />
              </div>
              <Link
                href="/pricing"
                className="mt-3 text-center text-sm font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                Compare Free, Pro & Business
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ChartLineUp,
  Desktop,
  DeviceMobile,
  DeviceTablet,
  GlobeHemisphereWest,
  LockSimple,
  MapPin,
  QrCode,
  Sparkle,
} from "@phosphor-icons/react";
import { ClippedAreaChart } from "@/components/ui/advanced-stats-utils/charts";
import { Badge } from "@/components/ui/badge";
import {
  GlobeAnalytics,
  type AnalyticsMarker,
} from "@/components/ui/cobe-globe-analytics";
import {
  formatInr,
  PRO_MONTHLY_INR,
  PRO_YEARLY_INR,
  proEffectiveMonthlyInr,
} from "@/lib/pricing";

type ProAnalyticsPreviewProps = {
  /** When false, frost overlay + upgrade CTAs. When true, full aspirational preview. */
  locked?: boolean;
  /** Optional live totals from the account (plugged into demo hero when present). */
  liveClicks?: number;
  liveLinks?: number;
};

const COUNTRIES: {
  code: string;
  name: string;
  share: number;
  location: [number, number];
  trend: number;
}[] = [
  { code: "IN", name: "India", share: 38, location: [19.08, 72.88], trend: 12 },
  { code: "US", name: "United States", share: 22, location: [40.71, -74.01], trend: 8 },
  { code: "GB", name: "United Kingdom", share: 9, location: [51.51, -0.13], trend: -2 },
  { code: "DE", name: "Germany", share: 7, location: [52.52, 13.41], trend: 5 },
  { code: "SG", name: "Singapore", share: 6, location: [1.35, 103.82], trend: 15 },
  { code: "AE", name: "UAE", share: 5, location: [25.2, 55.27], trend: 4 },
  { code: "BR", name: "Brazil", share: 4, location: [-23.55, -46.63], trend: -1 },
  { code: "CA", name: "Canada", share: 3, location: [43.65, -79.38], trend: 3 },
];

const GEO_MARKERS: AnalyticsMarker[] = COUNTRIES.map((c) => ({
  id: c.code.toLowerCase(),
  location: c.location,
  visitors: Math.round(c.share * 42),
  trend: c.trend,
}));

const DEVICES = [
  { label: "Mobile", value: 58, color: "var(--accent)" },
  { label: "Desktop", value: 34, color: "color-mix(in srgb, var(--accent) 55%, var(--ink))" },
  { label: "Tablet", value: 8, color: "var(--stroke-strong)" },
];

const REFERRERS = [
  { source: "Instagram", clicks: 1842, share: 28 },
  { source: "WhatsApp", clicks: 1365, share: 21 },
  { source: "Direct", clicks: 1180, share: 18 },
  { source: "X / Twitter", clicks: 892, share: 14 },
  { source: "Google", clicks: 640, share: 10 },
  { source: "LinkedIn", clicks: 410, share: 6 },
  { source: "Other", clicks: 214, share: 3 },
];

const TIMELINE = [
  { city: "Mumbai", country: "IN", ago: "2 min ago", path: "/r/launch" },
  { city: "Bengaluru", country: "IN", ago: "5 min ago", path: "/r/deck" },
  { city: "Austin", country: "US", ago: "8 min ago", path: "/r/launch" },
  { city: "London", country: "GB", ago: "12 min ago", path: "/r/bio" },
  { city: "Delhi", country: "IN", ago: "14 min ago", path: "/r/qr-camp" },
  { city: "Singapore", country: "SG", ago: "19 min ago", path: "/r/launch" },
  { city: "Berlin", country: "DE", ago: "23 min ago", path: "/r/newsletter" },
  { city: "Dubai", country: "AE", ago: "28 min ago", path: "/r/deck" },
];

function ProBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--ink)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
      <LockSimple size={10} weight="bold" />
      Pro
    </span>
  );
}

function DonutChart() {
  const size = 128;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto h-auto w-[7.5rem] shrink-0 -rotate-90 sm:mx-0 sm:w-[9.25rem]"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface)"
          strokeWidth={stroke}
        />
        {DEVICES.map((d) => {
          const len = (d.value / 100) * c;
          const el = (
            <circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <ul className="w-full min-w-0 space-y-2.5">
        {DEVICES.map((d) => {
          const Icon =
            d.label === "Mobile"
              ? DeviceMobile
              : d.label === "Desktop"
                ? Desktop
                : DeviceTablet;
          return (
            <li key={d.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex min-w-0 items-center gap-2 text-[var(--ink)]">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: d.color }}
                  aria-hidden
                />
                <Icon size={15} weight="duotone" className="shrink-0" />
                {d.label}
              </span>
              <span className="font-semibold tabular-nums text-[var(--ink)]">{d.value}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function WorldHeatmap() {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--surface)]/40 p-2.5 sm:p-4">
      <div className="mx-auto w-full max-w-[200px] sm:max-w-[280px]">
        <GlobeAnalytics markers={GEO_MARKERS} className="w-full" speed={0.0025} />
      </div>
      <ul className="mt-3 space-y-1.5 sm:mt-3 sm:grid sm:grid-cols-2 sm:gap-1.5 sm:space-y-0 lg:grid-cols-4">
        {COUNTRIES.slice(0, 4).map((c) => (
          <li
            key={c.code}
            className="flex items-center justify-between gap-2 rounded-lg bg-white/80 px-2.5 py-2 text-xs text-[var(--muted)] sm:block sm:px-2 sm:py-1.5 sm:text-[11px]"
          >
            <span className="min-w-0 truncate font-semibold text-[var(--ink)]">
              {c.name}
            </span>
            <span className="shrink-0 tabular-nums sm:ml-1">{c.share}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QrPreview() {
  // Decorative QR-like grid — not a real code
  const cells = useMemo(() => {
    const out: boolean[] = [];
    for (let i = 0; i < 121; i++) {
      const row = Math.floor(i / 11);
      const col = i % 11;
      const corner =
        (row < 3 && col < 3) ||
        (row < 3 && col > 7) ||
        (row > 7 && col < 3);
      out.push(corner || ((i * 7 + 3) % 11 > 4 && (i * 3) % 5 !== 0));
    }
    return out;
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div
        className="grid shrink-0 grid-cols-11 gap-0.5 rounded-2xl border border-[var(--stroke)] bg-white p-3"
        aria-hidden
      >
        {cells.map((on, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-[1px] sm:h-2.5 sm:w-2.5 ${
              on ? "bg-[var(--ink)]" : "bg-transparent"
            }`}
          />
        ))}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Custom short link
        </p>
        <p className="mt-1 break-all font-mono text-base font-semibold tracking-tight text-[var(--accent-ink)] sm:text-lg">
          deskzy.xyz/yourbrand
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Branded slugs + printable QR for bios, decks, and packaging — included
          with Pro.
        </p>
      </div>
    </div>
  );
}

export function ProAnalyticsPreview({
  locked = true,
  liveClicks,
  liveLinks,
}: ProAnalyticsPreviewProps) {
  const totalClicks =
    liveClicks && liveClicks > 0 ? liveClicks : 6543;
  const uniqueVisitors = Math.round(totalClicks * 0.62);
  const conversion = "4.8%";
  const topCountry = "India";

  const pricingHint = `${formatInr(PRO_MONTHLY_INR)}/mo · or ${formatInr(PRO_YEARLY_INR)}/yr (~${formatInr(proEffectiveMonthlyInr())}/mo)`;

  return (
    <div className="relative min-w-0 overflow-x-clip rounded-[var(--radius-shell)] border border-[var(--stroke)] bg-[var(--bg-elevated)] shadow-[var(--shadow)]">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[var(--stroke)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-5 md:px-7">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Deskzy Links
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-[var(--ink)] sm:text-2xl md:text-3xl">
            {locked ? "Unlock Advanced Link Analytics" : "Link Analytics"}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            See who clicks, from where, and which channels convert — built for
            short links on deskzy.xyz.
          </p>
        </div>
        {locked ? (
          <Link
            href="/link-analytics#upgrade"
            className="btn-primary w-full shrink-0 !rounded-full !px-5 shadow-[0_0_0_4px_var(--accent-soft)] transition-transform active:scale-[0.98] sm:w-auto"
          >
            <Sparkle size={16} weight="fill" />
            Upgrade to Pro
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)]">
            <ChartLineUp size={14} weight="bold" />
            Pro active
          </span>
        )}
      </div>

      <div className="relative min-w-0 px-3 py-4 sm:px-4 sm:py-5 md:px-7 md:py-6">
        {/* Stat row — always readable */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {[
            { label: "Total clicks", value: totalClicks.toLocaleString("en-IN"), hint: "Last 30 days" },
            { label: "Unique visitors", value: uniqueVisitors.toLocaleString("en-IN"), hint: "Estimated" },
            { label: "Top country", value: topCountry, hint: "By click share" },
            { label: "Conversion rate", value: conversion, hint: "Clicks → goals" },
          ].map((s) => (
            <div
              key={s.label}
              className="min-w-0 rounded-2xl border border-[var(--stroke)] bg-white/70 p-3 sm:p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] sm:text-[11px]">
                {s.label}
              </p>
              <p className="mt-1 font-display text-xl font-semibold tracking-tight tabular-nums text-[var(--ink)] sm:mt-1.5 sm:text-2xl md:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-[10px] text-[var(--muted)] sm:text-[11px]">{s.hint}</p>
            </div>
          ))}
        </div>

        {/* Main chart — AdvancedStats clipped area */}
        <section className="mt-3 min-w-0 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-white/70 p-3 sm:mt-4 sm:p-4 md:p-5">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold tracking-tight text-[var(--ink)] sm:text-lg">
                Clicks over time
              </h3>
              <p className="text-xs text-[var(--muted)]">Last 30 days · sample campaign</p>
            </div>
            <Badge
              variant="secondary"
              className="rounded-full border-0 bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent)]"
            >
              +18% vs prior period
            </Badge>
          </div>
          <ClippedAreaChart className="min-h-[140px] sm:min-h-[180px]" />
        </section>

        {/* Premium widgets grid — partially locked when free */}
        <div className="relative mt-3 min-w-0 sm:mt-4">
          <div
            className={`grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-2 ${
              locked ? "pointer-events-none select-none" : ""
            }`}
          >
            <section
              className={`min-w-0 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-white/70 p-3 sm:p-4 md:p-5 ${
                locked ? "blur-[2.5px]" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="inline-flex min-w-0 items-center gap-2 font-display text-base font-semibold tracking-tight">
                  <GlobeHemisphereWest size={18} weight="duotone" className="shrink-0" />
                  <span className="truncate">Click geography</span>
                </h3>
                {locked ? <ProBadge /> : null}
              </div>
              <WorldHeatmap />
            </section>

            <section
              className={`min-w-0 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-white/70 p-3 sm:p-4 md:p-5 ${
                locked ? "blur-[2.5px]" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold tracking-tight">
                  Devices
                </h3>
                {locked ? <ProBadge /> : null}
              </div>
              <DonutChart />
            </section>

            <section
              className={`min-w-0 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-white/70 p-3 sm:p-4 md:p-5 lg:col-span-2 ${
                locked ? "blur-[3px]" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold tracking-tight">
                  Referrer insights
                </h3>
                {locked ? <ProBadge /> : null}
              </div>
              {/* Mobile: stacked rows — Desktop: table */}
              <ul className="space-y-2 sm:hidden">
                {REFERRERS.map((r) => (
                  <li
                    key={r.source}
                    className="rounded-xl border border-[var(--stroke)]/80 bg-[var(--surface)]/40 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-[var(--ink)]">
                        {r.source}
                      </span>
                      <span className="text-xs tabular-nums text-[var(--muted)]">
                        {r.clicks.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--surface)]">
                        <span
                          className="block h-full rounded-full bg-[var(--accent)]"
                          style={{ width: `${Math.min(100, r.share * 3)}%` }}
                        />
                      </span>
                      <span className="w-8 shrink-0 text-right text-xs tabular-nums text-[var(--muted)]">
                        {r.share}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--stroke)] text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
                      <th className="pb-2 font-semibold">Source</th>
                      <th className="pb-2 font-semibold">Clicks</th>
                      <th className="pb-2 font-semibold">Share</th>
                      <th className="pb-2 font-semibold">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REFERRERS.map((r) => (
                      <tr key={r.source} className="border-b border-[var(--stroke)]/70 last:border-0">
                        <td className="py-2.5 font-medium text-[var(--ink)]">{r.source}</td>
                        <td className="py-2.5 tabular-nums text-[var(--muted)]">
                          {r.clicks.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--surface)]">
                              <span
                                className="block h-full rounded-full bg-[var(--accent)]"
                                style={{ width: `${r.share * 3}%` }}
                              />
                            </span>
                            <span className="tabular-nums text-[var(--muted)]">{r.share}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-[var(--accent)]">↑</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section
              className={`min-w-0 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-white/70 p-3 sm:p-4 md:p-5 ${
                locked ? "blur-[2px]" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold tracking-tight">
                  Live click timeline
                </h3>
                {locked ? <ProBadge /> : null}
              </div>
              <ul className="space-y-2.5">
                {TIMELINE.map((ev) => (
                  <li
                    key={`${ev.city}-${ev.ago}`}
                    className="flex items-start gap-2.5 rounded-xl border border-[var(--stroke)]/80 bg-[var(--surface)]/40 px-3 py-2.5"
                  >
                    <span className="mt-0.5 shrink-0 text-[var(--accent)]">
                      <MapPin size={16} weight="fill" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-[var(--ink)]">
                        New click from{" "}
                        <span className="font-semibold">{ev.city}</span>
                        <span className="text-[var(--muted)]"> · {ev.country}</span>
                      </span>
                      <span className="mt-0.5 block truncate font-mono text-[11px] text-[var(--muted)]">
                        {ev.path} · {ev.ago}
                      </span>
                    </span>
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                  </li>
                ))}
              </ul>
            </section>

            <section
              className={`min-w-0 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-white/70 p-3 sm:p-4 md:p-5 ${
                locked ? "blur-[2px]" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold tracking-tight">
                  <QrCode size={18} weight="duotone" />
                  Brand + QR
                </h3>
                {locked ? <ProBadge /> : null}
              </div>
              <QrPreview />
              {liveLinks != null && liveLinks > 0 ? (
                <p className="mt-3 text-xs text-[var(--muted)]">
                  You have {liveLinks} owned link{liveLinks === 1 ? "" : "s"} ready
                  for branded analytics.
                </p>
              ) : null}
            </section>
          </div>

          {locked ? (
            <>
              {/* Frost veil over premium zone (~60%) */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl backdrop-blur-[1px]"
                style={{
                  background:
                    "color-mix(in srgb, var(--bg-elevated) 40%, transparent)",
                }}
                aria-hidden
              />
              <div className="absolute inset-x-3 top-1/3 z-10 mx-auto max-w-md -translate-y-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 md:top-[38%]">
                <div
                  className="rounded-[1.35rem] border border-white/70 p-4 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6"
                  style={{
                    background:
                      "color-mix(in srgb, var(--bg-elevated) 90%, white)",
                  }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
                    <LockSimple size={18} weight="bold" />
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-[var(--ink)] sm:text-xl">
                    See exactly who&apos;s clicking your links
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    Unlock geography, referrers, devices, live timeline, and
                    branded deskzy.xyz slugs. Upgrade to Pro for full access.
                  </p>
                  <p className="mt-3 text-xs font-medium text-[var(--accent-ink)]">
                    Starting at {pricingHint}
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Link href="/link-analytics#upgrade" className="btn-primary w-full !rounded-full sm:w-auto sm:flex-none">
                      Upgrade to Pro
                    </Link>
                    <Link
                      href="/link-analytics"
                      className="btn-secondary w-full !rounded-full sm:w-auto sm:flex-none"
                    >
                      See analytics page
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

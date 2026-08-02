"use client";

import Link from "next/link";
import { useId, useMemo } from "react";
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

const CLICKS_30D = [
  42, 55, 48, 71, 63, 88, 92, 76, 105, 98, 112, 124, 118, 140, 132, 155, 148,
  162, 171, 158, 180, 175, 192, 188, 205, 198, 220, 214, 238, 246,
];

const COUNTRIES: { code: string; name: string; share: number; x: number; y: number }[] = [
  { code: "IN", name: "India", share: 38, x: 68, y: 48 },
  { code: "US", name: "United States", share: 22, x: 22, y: 38 },
  { code: "GB", name: "United Kingdom", share: 9, x: 48, y: 32 },
  { code: "DE", name: "Germany", share: 7, x: 51, y: 34 },
  { code: "SG", name: "Singapore", share: 6, x: 74, y: 58 },
  { code: "AE", name: "UAE", share: 5, x: 60, y: 46 },
  { code: "BR", name: "Brazil", share: 4, x: 32, y: 62 },
  { code: "CA", name: "Canada", share: 3, x: 20, y: 28 },
];

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

function AreaChart({ values }: { values: number[] }) {
  const gradId = useId();
  const w = 640;
  const h = 220;
  const padX = 8;
  const padY = 16;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);

  const points = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * (w - padX * 2);
    const y = h - padY - ((v - min) / range) * (h - padY * 2);
    return [x, y] as const;
  });

  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L${points[points.length - 1][0]},${h - padY} L${points[0][0]},${h - padY} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Clicks over the last 30 days">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={padX}
          x2={w - padX}
          y1={padY + t * (h - padY * 2)}
          y2={padY + t * (h - padY * 2)}
          stroke="var(--stroke)"
          strokeDasharray="4 6"
          strokeWidth="1"
        />
      ))}
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={line}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="5"
        fill="var(--accent)"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}

function DonutChart() {
  const size = 148;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
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
      <ul className="w-full space-y-2.5">
        {DEVICES.map((d) => {
          const Icon =
            d.label === "Mobile"
              ? DeviceMobile
              : d.label === "Desktop"
                ? Desktop
                : DeviceTablet;
          return (
            <li key={d.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2 text-[var(--ink)]">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: d.color }}
                  aria-hidden
                />
                <Icon size={15} weight="duotone" />
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
    <div className="relative overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--surface)]/50 p-3">
      <svg viewBox="0 0 100 70" className="h-auto w-full opacity-90" aria-hidden>
        <rect width="100" height="70" fill="transparent" />
        {/* Simplified land silhouettes */}
        <ellipse cx="22" cy="36" rx="14" ry="12" fill="color-mix(in srgb, var(--ink) 8%, transparent)" />
        <ellipse cx="32" cy="58" rx="8" ry="10" fill="color-mix(in srgb, var(--ink) 7%, transparent)" />
        <ellipse cx="52" cy="34" rx="10" ry="9" fill="color-mix(in srgb, var(--ink) 8%, transparent)" />
        <ellipse cx="68" cy="42" rx="16" ry="14" fill="color-mix(in srgb, var(--ink) 9%, transparent)" />
        <ellipse cx="78" cy="58" rx="7" ry="6" fill="color-mix(in srgb, var(--ink) 6%, transparent)" />
        {COUNTRIES.map((c) => {
          const r = 2.2 + (c.share / 38) * 4.5;
          return (
            <g key={c.code}>
              <circle
                cx={c.x}
                cy={c.y}
                r={r * 1.8}
                fill="var(--accent)"
                opacity={0.12 + c.share / 120}
              />
              <circle cx={c.x} cy={c.y} r={r * 0.55} fill="var(--accent)" />
            </g>
          );
        })}
      </svg>
      <ul className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {COUNTRIES.slice(0, 4).map((c) => (
          <li
            key={c.code}
            className="rounded-lg bg-white/70 px-2 py-1.5 text-[11px] text-[var(--muted)]"
          >
            <span className="font-semibold text-[var(--ink)]">{c.name}</span>
            <span className="ml-1 tabular-nums">{c.share}%</span>
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
        <p className="mt-1 font-mono text-lg font-semibold tracking-tight text-[var(--accent-ink)]">
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
    <div className="relative overflow-hidden rounded-[var(--radius-shell)] border border-[var(--stroke)] bg-[var(--bg-elevated)] shadow-[var(--shadow)]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--stroke)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Deskzy Links
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
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
            className="btn-primary shrink-0 !rounded-full !px-5 shadow-[0_0_0_4px_var(--accent-soft)] transition-transform active:scale-[0.98]"
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

      <div className="relative px-4 py-5 md:px-7 md:py-6">
        {/* Stat row — always readable */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Total clicks", value: totalClicks.toLocaleString("en-IN"), hint: "Last 30 days" },
            { label: "Unique visitors", value: uniqueVisitors.toLocaleString("en-IN"), hint: "Estimated" },
            { label: "Top country", value: topCountry, hint: "By click share" },
            { label: "Conversion rate", value: conversion, hint: "Clicks → goals" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-[var(--stroke)] bg-white/70 p-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                {s.label}
              </p>
              <p className="mt-1.5 font-display text-2xl font-semibold tracking-tight tabular-nums text-[var(--ink)] md:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-[11px] text-[var(--muted)]">{s.hint}</p>
            </div>
          ))}
        </div>

        {/* Main chart — visible */}
        <section className="mt-4 rounded-2xl border border-[var(--stroke)] bg-white/70 p-4 md:p-5">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                Clicks over time
              </h3>
              <p className="text-xs text-[var(--muted)]">Last 30 days · sample campaign</p>
            </div>
            <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent)]">
              +18% vs prior period
            </span>
          </div>
          <AreaChart values={CLICKS_30D} />
        </section>

        {/* Premium widgets grid — partially locked when free */}
        <div className="relative mt-4">
          <div
            className={`grid gap-4 lg:grid-cols-2 ${
              locked ? "pointer-events-none select-none" : ""
            }`}
          >
            <section
              className={`rounded-2xl border border-[var(--stroke)] bg-white/70 p-4 md:p-5 ${
                locked ? "blur-[2.5px]" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold tracking-tight">
                  <GlobeHemisphereWest size={18} weight="duotone" />
                  Click geography
                </h3>
                {locked ? <ProBadge /> : null}
              </div>
              <WorldHeatmap />
            </section>

            <section
              className={`rounded-2xl border border-[var(--stroke)] bg-white/70 p-4 md:p-5 ${
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
              className={`rounded-2xl border border-[var(--stroke)] bg-white/70 p-4 md:p-5 lg:col-span-2 ${
                locked ? "blur-[3px]" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold tracking-tight">
                  Referrer insights
                </h3>
                {locked ? <ProBadge /> : null}
              </div>
              <div className="overflow-x-auto">
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
              className={`rounded-2xl border border-[var(--stroke)] bg-white/70 p-4 md:p-5 ${
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
                    <span className="mt-0.5 text-[var(--accent)]">
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
              className={`rounded-2xl border border-[var(--stroke)] bg-white/70 p-4 md:p-5 ${
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
              <div className="absolute inset-x-4 top-1/3 z-10 mx-auto max-w-md -translate-y-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 md:top-[38%]">
                <div
                  className="rounded-[1.35rem] border border-white/70 p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-6"
                  style={{
                    background:
                      "color-mix(in srgb, var(--bg-elevated) 90%, white)",
                  }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
                    <LockSimple size={18} weight="bold" />
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
                    See exactly who&apos;s clicking your links
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    Unlock geography, referrers, devices, live timeline, and
                    branded deskzy.xyz slugs. Upgrade to Pro for full access.
                  </p>
                  <p className="mt-3 text-xs font-medium text-[var(--accent-ink)]">
                    Starting at {pricingHint}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href="/link-analytics#upgrade" className="btn-primary flex-1 !rounded-full sm:flex-none">
                      Upgrade to Pro
                    </Link>
                    <Link
                      href="/link-analytics"
                      className="btn-secondary flex-1 !rounded-full sm:flex-none"
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

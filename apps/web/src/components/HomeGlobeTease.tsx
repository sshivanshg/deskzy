"use client";

import Link from "next/link";
import { ArrowRight, ChartLineUp } from "@phosphor-icons/react";
import {
  GlobeAnalytics,
  type AnalyticsMarker,
} from "@/components/ui/cobe-globe-analytics";
import { formatInr, PRO_MONTHLY_INR } from "@/lib/pricing";

const HERO_MARKERS: AnalyticsMarker[] = [
  { id: "in", location: [19.08, 72.88], visitors: 1284, trend: 12 },
  { id: "us", location: [40.71, -74.01], visitors: 742, trend: 8 },
  { id: "gb", location: [51.51, -0.13], visitors: 318, trend: -2 },
  { id: "de", location: [52.52, 13.41], visitors: 256, trend: 5 },
  { id: "sg", location: [1.35, 103.82], visitors: 198, trend: 15 },
  { id: "ae", location: [25.2, 55.27], visitors: 164, trend: 4 },
];

type HomeGlobeTeaseProps = {
  /** compact = mobile strip; hero = desktop visual */
  size?: "compact" | "hero";
};

export function HomeGlobeTease({ size = "compact" }: HomeGlobeTeaseProps) {
  if (size === "compact") {
    return (
      <Link
        href="/link-analytics"
        className="group flex items-center gap-3 rounded-2xl border border-[var(--stroke)] bg-white/70 p-2.5 pr-3.5 transition-colors hover:border-[var(--accent)]/35 hover:bg-[var(--accent-soft)]/40"
      >
        <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-[var(--accent-soft)]/50">
          <GlobeAnalytics
            markers={HERO_MARKERS}
            className="h-full w-full"
            speed={0.004}
            showLabels={false}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Pro analytics
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-snug text-[var(--ink)]">
            See where clicks land
          </p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Live geography · from {formatInr(PRO_MONTHLY_INR)}/mo
          </p>
        </div>
        <ArrowRight
          size={16}
          className="shrink-0 text-[var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
        />
      </Link>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[340px] lg:max-w-[400px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent), transparent 68%)",
        }}
        aria-hidden
      />
      <GlobeAnalytics
        markers={HERO_MARKERS}
        className="w-full"
        speed={0.0028}
      />
      <div className="mt-5 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Click geography
        </p>
        <p className="mt-1.5 font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
          Watch where your short links travel
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/link-analytics"
            className="btn-primary !rounded-full !px-4 !py-2.5 text-xs"
          >
            <ChartLineUp size={14} weight="bold" />
            Preview analytics
          </Link>
          <Link
            href="/pricing"
            className="btn-secondary !rounded-full !px-4 !py-2.5 text-xs"
          >
            From {formatInr(PRO_MONTHLY_INR)}/mo
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ArrowRight, ChartLineUp, MapPin } from "@phosphor-icons/react";
import { GlobeCdn } from "@/components/ui/cobe-globe-cdn";
import {
  EDGE_TRAFFIC_FALLBACK,
  type EdgeArc,
  type EdgeMarker,
} from "@/lib/edge-traffic";
import { formatInr, PRO_MONTHLY_INR } from "@/lib/pricing";

type EdgePayload = {
  markers: EdgeMarker[];
  arcs: EdgeArc[];
  totalRequests: number;
  source: "clicks" | "fallback";
};

const LIVE_CITIES = [
  { city: "Mumbai", visitors: "BOM", x: 68, y: 48 },
  { city: "Virginia", visitors: "IAD", x: 24, y: 36 },
  { city: "Frankfurt", visitors: "FRA", x: 48, y: 28 },
  { city: "Singapore", visitors: "SIN", x: 74, y: 58 },
] as const;

type HomeGlobeTeaseProps = {
  size?: "compact" | "hero";
};

function MobileGeoTease() {
  return (
    <div
      className="relative h-[4.75rem] w-[5.25rem] shrink-0 overflow-hidden rounded-xl"
      style={{
        background:
          "radial-gradient(ellipse at 40% 45%, color-mix(in srgb, var(--accent) 22%, var(--accent-soft)), color-mix(in srgb, var(--accent-soft) 70%, transparent) 70%)",
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 84 76"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <ellipse
          cx="42"
          cy="38"
          rx="34"
          ry="30"
          stroke="var(--accent)"
          strokeOpacity="0.22"
          strokeWidth="1"
        />
        <ellipse
          cx="42"
          cy="38"
          rx="22"
          ry="30"
          stroke="var(--accent)"
          strokeOpacity="0.14"
          strokeWidth="1"
        />
        <path
          d="M8 38h68M14 22h56M14 54h56"
          stroke="var(--accent)"
          strokeOpacity="0.12"
          strokeWidth="0.75"
        />
        <path
          d="M20 36 C 36 18, 52 18, 62 46"
          stroke="var(--accent)"
          strokeOpacity="0.45"
          strokeWidth="1.25"
          strokeDasharray="3 3"
          className="motion-safe:[animation:geo-dash_4s_linear_infinite]"
        />
        {LIVE_CITIES.map((c, i) => (
          <g key={c.city}>
            <circle
              cx={c.x}
              cy={c.y}
              r="4"
              fill="var(--accent)"
              className="origin-center motion-safe:[animation:geo-ping_2.4s_ease-out_infinite]"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animationDelay: `${i * 0.45}s`,
              }}
            />
            <circle cx={c.x} cy={c.y} r="2.25" fill="var(--accent)" />
          </g>
        ))}
      </svg>
      <div className="absolute bottom-1 left-1 right-1 flex items-center gap-1 rounded-md bg-[var(--ink)]/80 px-1.5 py-0.5 backdrop-blur-[2px]">
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <span className="truncate font-mono text-[8px] font-medium tracking-tight text-white">
          CF edge · BOM
        </span>
      </div>
    </div>
  );
}

function useEdgeTraffic() {
  const [data, setData] = useState<EdgePayload>(EDGE_TRAFFIC_FALLBACK);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/edge-traffic", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as EdgePayload;
        if (!cancelled && json.markers?.length) setData(json);
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

export function HomeGlobeTease({ size = "compact" }: HomeGlobeTeaseProps) {
  const edge = useEdgeTraffic();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";

  if (size === "compact") {
    return (
      <Link
        href="/link-analytics"
        className="group flex items-center gap-3 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-soft)] p-2.5 pr-3.5 transition-colors hover:border-[var(--accent)]/35 hover:bg-[var(--accent-soft)]/40"
      >
        <MobileGeoTease />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Pro analytics
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-snug text-[var(--ink)]">
            See where clicks land
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--muted)]">
            <span className="shrink-0 text-[var(--accent)]">
              <MapPin size={11} weight="fill" />
            </span>
            Cloudflare edge · from {formatInr(PRO_MONTHLY_INR)}/mo
          </p>
        </div>
        <span className="shrink-0 text-[var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]">
          <ArrowRight size={16} />
        </span>
      </Link>
    );
  }

  const markers = edge.markers.map((m) => ({
    id: m.id,
    location: m.location,
    region: m.region,
  }));
  const arcs = edge.arcs.map((a) => ({
    id: a.id,
    from: a.from,
    to: a.to,
  }));
  const arcTraffic = Object.fromEntries(
    edge.arcs.map((a) => [a.id, a.requests]),
  );

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
      <GlobeCdn
        markers={markers}
        arcs={arcs}
        arcTraffic={arcTraffic}
        className="w-full"
        speed={0.0028}
        dark={dark}
      />
      <div className="mt-5 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Cloudflare edge
        </p>
        <p className="mt-1.5 font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
          Live colo traffic on deskzy.xyz
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {edge.totalRequests.toLocaleString("en-IN")} req ·{" "}
          {edge.source === "clicks" ? "from your click geo" : "Worker colo map"}
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

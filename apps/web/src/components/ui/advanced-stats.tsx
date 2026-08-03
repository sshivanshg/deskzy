"use client";

import { ArrowDown, ArrowUp } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import {
  ClippedAreaChart,
  CLICKS_30D,
  buildClicksSeries,
} from "@/components/ui/advanced-stats-utils/charts";
import { TimelineAnimation } from "@/components/ui/advanced-stats-utils/timeline-animation";
import { cn } from "@/lib/utils";

type Kpi = {
  label: string;
  value: string;
  hint: string;
  delta: string;
  positive: boolean;
};

const DEFAULT_KPIS: Kpi[] = [
  {
    label: "Total clicks",
    value: "6,543",
    hint: "Last 30 days",
    delta: "+18%",
    positive: true,
  },
  {
    label: "Unique visitors",
    value: "4,056",
    hint: "Estimated",
    delta: "+12%",
    positive: true,
  },
  {
    label: "Avg. clicks/day",
    value: "218",
    hint: "Rolling 30d",
    delta: "+9%",
    positive: true,
  },
  {
    label: "Top referrer share",
    value: "28%",
    hint: "Instagram",
    delta: "+3 pts",
    positive: true,
  },
];

type AdvancedStatsProps = {
  className?: string;
  /** Override KPI row */
  kpis?: Kpi[];
  /** Hide KPI grid (chart-only embed) */
  chartOnly?: boolean;
  compact?: boolean;
  title?: string;
  subtitle?: string;
};

export function AdvancedStats({
  className,
  kpis = DEFAULT_KPIS,
  chartOnly = false,
  compact = false,
  title = "Clicks over time",
  subtitle = "Last 30 days · sample campaign",
}: AdvancedStatsProps) {
  const series = buildClicksSeries(CLICKS_30D);

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--stroke)] bg-[var(--panel-soft)]",
        compact ? "p-3 md:p-4" : "p-4 md:p-5",
        className,
      )}
    >
      {!chartOnly ? (
        <TimelineAnimation className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((kpi, i) => (
            <TimelineAnimation
              key={kpi.label}
              delay={0.04 * i}
              className="rounded-2xl border border-[var(--stroke)] bg-[var(--bg-elevated)]/80 p-3.5 md:p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                {kpi.label}
              </p>
              <p className="mt-1.5 font-display text-2xl font-semibold tracking-tight tabular-nums text-[var(--ink)] md:text-[1.65rem]">
                {kpi.value}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="gap-1 rounded-full border-0 bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]"
                >
                  {kpi.positive ? (
                    <ArrowUp size={11} weight="bold" />
                  ) : (
                    <ArrowDown size={11} weight="bold" />
                  )}
                  {kpi.delta}
                </Badge>
                <span className="text-[11px] text-[var(--muted)]">{kpi.hint}</span>
              </div>
            </TimelineAnimation>
          ))}
        </TimelineAnimation>
      ) : null}

      <TimelineAnimation delay={chartOnly ? 0 : 0.12}>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
              {title}
            </h3>
            <p className="text-xs text-[var(--muted)]">{subtitle}</p>
          </div>
          <Badge
            variant="secondary"
            className="rounded-full border-0 bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent)]"
          >
            +18% vs prior period
          </Badge>
        </div>
        <ClippedAreaChart data={series} compact={compact} />
      </TimelineAnimation>
    </div>
  );
}

export default AdvancedStats;

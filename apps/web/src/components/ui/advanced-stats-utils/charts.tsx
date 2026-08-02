"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

/** Sample 30-day click series (matches ProAnalyticsPreview CLICKS_30D). */
export const CLICKS_30D = [
  42, 55, 48, 71, 63, 88, 92, 76, 105, 98, 112, 124, 118, 140, 132, 155, 148,
  162, 171, 158, 180, 175, 192, 188, 205, 198, 220, 214, 238, 246,
] as const;

export type ClickPoint = {
  day: string;
  clicks: number;
};

export function buildClicksSeries(
  values: readonly number[] = CLICKS_30D,
): ClickPoint[] {
  return values.map((clicks, i) => ({
    day: `D${i + 1}`,
    clicks,
  }));
}

const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "var(--accent)",
  },
} satisfies ChartConfig;

type ClippedAreaChartProps = {
  data?: ClickPoint[];
  className?: string;
  /** Compact height for teases / hero cards */
  compact?: boolean;
  showAxes?: boolean;
};

export function ClippedAreaChart({
  data = buildClicksSeries(),
  className,
  compact = false,
  showAxes = !compact,
}: ClippedAreaChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        "w-full",
        compact ? "aspect-[2.4/1] min-h-[88px]" : "aspect-[2.2/1] min-h-[180px]",
        className,
      )}
    >
      <AreaChart
        data={data}
        margin={
          compact
            ? { top: 4, right: 4, left: 0, bottom: 0 }
            : { top: 8, right: 8, left: 0, bottom: 0 }
        }
      >
        <defs>
          <linearGradient id="deskzyClicksFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
          </linearGradient>
          <clipPath id="deskzyChartClip">
            <rect x="0" y="0" width="100%" height="100%" rx="8" />
          </clipPath>
        </defs>
        {showAxes ? (
          <CartesianGrid
            vertical={false}
            stroke="var(--stroke)"
            strokeDasharray="4 6"
          />
        ) : null}
        {showAxes ? (
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
            minTickGap={28}
            tick={{ fill: "var(--muted)", fontSize: 10 }}
          />
        ) : null}
        {showAxes ? (
          <YAxis
            tickLine={false}
            axisLine={false}
            width={36}
            tickMargin={4}
            tick={{ fill: "var(--muted)", fontSize: 10 }}
          />
        ) : null}
        <ChartTooltip
          cursor={{ stroke: "var(--stroke-strong)", strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(_, payload) => {
                const point = payload?.[0] as { payload?: ClickPoint } | undefined;
                const day = point?.payload?.day;
                return day ? `Day ${String(day).replace(/^D/, "")}` : "Clicks";
              }}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="clicks"
          stroke="var(--accent)"
          strokeWidth={compact ? 2 : 2.5}
          fill="url(#deskzyClicksFill)"
          clipPath="url(#deskzyChartClip)"
          activeDot={{
            r: compact ? 3 : 4,
            fill: "var(--accent)",
            stroke: "var(--bg-elevated)",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

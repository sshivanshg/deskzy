"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChartLineUp,
  CopySimple,
  GlobeHemisphereWest,
  LockSimple,
  MapPin,
  ShareNetwork,
} from "@phosphor-icons/react";
import {
  formatInr,
  PRO_MONTHLY_INR,
  proEffectiveMonthlyInr,
} from "@/lib/pricing";
import { publicLinkUrl } from "@/lib/link-path";

type LinkMeta = {
  code: string;
  dest: string;
  hits: number;
  is_custom: boolean;
  created_at: string;
};

type RecentClick = {
  clicked_at: string;
  referrer: string | null;
};

type StatsPayload = {
  link: LinkMeta;
  last7: { day: string; clicks: number }[];
  clicks30: number;
  recent: RecentClick[];
};

function hostFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function referrerLabel(ref: string | null) {
  if (!ref) return "Direct";
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return ref.slice(0, 40);
  }
}

export function LinkStatsView({
  code,
  paid,
}: {
  code: string;
  paid: boolean;
}) {
  const [data, setData] = useState<StatsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/links/${encodeURIComponent(code)}/stats`);
      const json = (await res.json()) as StatsPayload & { error?: string };
      if (!res.ok) throw new Error(json.error || "Could not load stats");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load stats");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    void load();
  }, [load]);

  const maxDay = useMemo(
    () => Math.max(1, ...(data?.last7.map((d) => d.clicks) ?? [1])),
    [data],
  );

  const shortUrl = publicLinkUrl(code);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  if (!paid) {
    return <StatsPaywall code={code} />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
      >
        <ArrowLeft size={16} weight="bold" />
        Back to links
      </Link>

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Link analytics
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            /p/{code}
          </h1>
          {data ? (
            <p className="mt-2 truncate text-sm text-[var(--muted)]">
              {hostFromUrl(data.link.dest)} · {data.link.hits} all-time clicks
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copyLink()}
            className="btn-secondary !rounded-full !px-4 !py-2.5 text-sm"
          >
            <CopySimple size={16} weight="bold" />
            {copied ? "Copied" : "Copy link"}
          </button>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary !rounded-full !px-4 !py-2.5 text-sm"
          >
            Open link
          </a>
        </div>
      </header>

      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shell">
              <div className="shell-core h-28 animate-pulse bg-[var(--surface)]/60" />
            </div>
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-2xl border border-[var(--stroke)] bg-[var(--warn-bg)] px-4 py-4 text-sm text-[var(--warn-ink)]">
          {error}
          <button
            type="button"
            onClick={() => void load()}
            className="ml-3 font-semibold underline-offset-2 hover:underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {data && !loading ? (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Last 30 days",
                value: data.clicks30.toLocaleString("en-IN"),
                hint: "Recorded clicks",
              },
              {
                label: "All time",
                value: data.link.hits.toLocaleString("en-IN"),
                hint: "Total redirects",
              },
              {
                label: "Best day (7d)",
                value: Math.max(...data.last7.map((d) => d.clicks)).toLocaleString(
                  "en-IN",
                ),
                hint: "Peak in last week",
              },
            ].map((m) => (
              <div key={m.label} className="shell">
                <div className="shell-core p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    {m.label}
                  </p>
                  <p className="mt-2 font-display text-3xl font-semibold tabular-nums tracking-tight">
                    {m.value}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{m.hint}</p>
                </div>
              </div>
            ))}
          </div>

          <section className="shell mt-4">
            <div className="shell-core p-5 md:p-6">
              <div className="flex items-center gap-2">
                <span className="text-[var(--accent)]">
                  <ChartLineUp size={18} weight="duotone" />
                </span>
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  Clicks · last 7 days
                </h2>
              </div>
              <div className="mt-6 flex h-40 items-end gap-2 sm:gap-3">
                {data.last7.map((d) => {
                  const h = Math.round((d.clicks / maxDay) * 120) + 8;
                  const label = new Date(d.day + "T12:00:00").toLocaleDateString(
                    "en-IN",
                    { weekday: "short" },
                  );
                  return (
                    <div
                      key={d.day}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-[11px] font-medium tabular-nums text-[var(--ink)]">
                        {d.clicks}
                      </span>
                      <div
                        className="w-full max-w-[3rem] rounded-t-lg bg-[var(--accent)] transition-[height] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                        style={{ height: h }}
                        title={`${d.day}: ${d.clicks}`}
                      />
                      <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <section className="shell">
              <div className="shell-core p-5 md:p-6">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--accent)]">
                    <ShareNetwork size={18} weight="duotone" />
                  </span>
                  <h2 className="font-display text-lg font-semibold tracking-tight">
                    Recent referrers
                  </h2>
                </div>
                {data.recent.length === 0 ? (
                  <p className="mt-4 text-sm text-[var(--muted)]">
                    No clicks in the last 30 days yet. Share the link to start
                    collecting data.
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-[var(--stroke)]">
                    {Object.entries(
                      data.recent.reduce<Record<string, number>>((acc, c) => {
                        const key = referrerLabel(c.referrer);
                        acc[key] = (acc[key] || 0) + 1;
                        return acc;
                      }, {}),
                    )
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 8)
                      .map(([source, count]) => (
                        <li
                          key={source}
                          className="flex items-center justify-between gap-3 py-2.5 text-sm"
                        >
                          <span className="truncate font-medium">{source}</span>
                          <span className="tabular-nums text-[var(--muted)]">
                            {count}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="shell">
              <div className="shell-core p-5 md:p-6">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--accent)]">
                    <MapPin size={18} weight="duotone" />
                  </span>
                  <h2 className="font-display text-lg font-semibold tracking-tight">
                    Live click feed
                  </h2>
                </div>
                {data.recent.length === 0 ? (
                  <p className="mt-4 text-sm text-[var(--muted)]">
                    Clicks will appear here as people open your short link.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {data.recent.slice(0, 10).map((c, i) => (
                      <li
                        key={`${c.clicked_at}-${i}`}
                        className="flex items-start gap-2.5 rounded-xl border border-[var(--stroke)]/80 bg-[var(--surface)]/40 px-3 py-2.5"
                      >
                        <span className="mt-0.5 text-[var(--accent)]">
                          <GlobeHemisphereWest size={16} weight="fill" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm text-[var(--ink)]">
                            Click via{" "}
                            <span className="font-semibold">
                              {referrerLabel(c.referrer)}
                            </span>
                          </span>
                          <span className="mt-0.5 block text-[11px] text-[var(--muted)]">
                            {formatWhen(c.clicked_at)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>

          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            Destination:{" "}
            <a
              href={data.link.dest}
              target="_blank"
              rel="noreferrer"
              className="break-all text-[var(--accent-ink)] underline-offset-2 hover:underline"
            >
              {data.link.dest}
            </a>
          </p>
        </>
      ) : null}
    </div>
  );
}

function StatsPaywall({ code }: { code: string }) {
  const price = formatInr(proEffectiveMonthlyInr());
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
      >
        <ArrowLeft size={16} weight="bold" />
        Back to links
      </Link>

      <div className="shell mt-8">
        <div className="shell-core relative overflow-hidden p-6 md:p-10">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              <LockSimple size={11} weight="bold" />
              Pro
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Unlock stats for /p/{code}
            </h1>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-[var(--muted)]">
              See daily clicks, referrers, and a live feed for every short link.
              Pro turns bare redirects into decisions you can act on.
            </p>
            <p className="mt-4 text-sm font-medium text-[var(--accent-ink)]">
              From {price}/month · or {formatInr(PRO_MONTHLY_INR)} billed monthly
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/link-analytics"
                className="btn-primary !rounded-full !px-6 !py-3"
              >
                See what Pro unlocks
              </Link>
              <Link
                href="/pricing"
                className="btn-secondary !rounded-full !px-6 !py-3"
              >
                Go to pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

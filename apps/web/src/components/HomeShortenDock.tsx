"use client";

import Link from "next/link";
import { useId, useState } from "react";
import {
  ArrowSquareOut,
  ChartLineUp,
  LinkSimple,
  ListBullets,
  LockSimple,
  PencilSimple,
  Sparkle,
} from "@phosphor-icons/react";
import { MultiLinkBuilder } from "@/components/MultiLinkBuilder";
import { ShareResultPanel } from "@/components/ShareResultPanel";
import { ClippedAreaChart } from "@/components/ui/advanced-stats-utils/charts";
import { looksLikeUrl } from "@/lib/normalize-url";
import { formatInr, PRO_MONTHLY_INR } from "@/lib/pricing";
import { shortenUrl, shortenUrlList } from "@/lib/tools/text";

/** Compact mobile tease — light, one CTA, no dark slab */
function AnalyticsTeaseMobile() {
  return (
    <div className="mt-3 rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-3.5">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-xl border border-[var(--stroke)] bg-[var(--accent-soft)]/60">
          <ClippedAreaChart
            compact
            showAxes={false}
            className="!aspect-auto h-full min-h-0 w-full [&_.recharts-wrapper]:!h-full"
          />
          <span className="absolute inset-x-0 bottom-1 flex justify-center">
            <span className="rounded-full bg-[var(--accent)] px-1.5 py-px text-[8px] font-semibold uppercase tracking-wide text-white">
              Pro
            </span>
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Pro analytics · {formatInr(PRO_MONTHLY_INR)}/mo
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-snug text-[var(--ink)]">
            See who clicks this link
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
            Cities, devices &amp; sources
          </p>
        </div>
      </div>
      <Link
        href="/link-analytics"
        className="btn-primary mt-3 w-full !rounded-full !py-2.5 text-sm"
      >
        <ChartLineUp size={16} weight="bold" />
        Preview dashboard
      </Link>
      <Link
        href="/pricing"
        className="mt-2 block text-center text-xs font-medium text-[var(--muted)] underline-offset-2 hover:text-[var(--accent)] hover:underline"
      >
        Or upgrade to Pro — from {formatInr(PRO_MONTHLY_INR)}/mo
      </Link>
    </div>
  );
}

/** Desktop hero tease — light card with chart preview */
function AnalyticsTeaseDesktop() {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          <LockSimple size={11} weight="bold" />
          Pro analytics
        </span>
        <span className="text-[11px] font-medium text-[var(--muted)]">
          From {formatInr(PRO_MONTHLY_INR)}/mo
        </span>
      </div>

      <div className="mt-3 grid gap-4 sm:grid-cols-[1.2fr_0.8fr] sm:items-center">
        <div className="min-w-0">
          <p className="font-display text-xl font-semibold leading-snug tracking-tight text-[var(--ink)]">
            See who clicks this link
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
            Cities, devices, Instagram vs WhatsApp — know what converts.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/link-analytics"
              className="btn-primary !rounded-full !px-4 !py-2.5 text-xs"
            >
              <ChartLineUp size={14} weight="bold" />
              Preview dashboard
            </Link>
            <Link
              href="/pricing"
              className="btn-secondary !rounded-full !px-4 !py-2.5 text-xs"
            >
              <Sparkle size={14} weight="fill" />
              Upgrade to Pro
            </Link>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-xl border border-[var(--stroke)] bg-[var(--accent-soft)]/50 p-3"
          aria-hidden
        >
          <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            <span>Clicks · 30d</span>
            <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 font-semibold normal-case tracking-normal text-white">
              +18%
            </span>
          </div>
          <ClippedAreaChart
            compact
            showAxes={false}
            className="min-h-[56px] !aspect-[2.6/1]"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[var(--panel-faint)] backdrop-blur-[1.5px]">
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--stroke)] bg-[var(--panel)] px-2.5 py-1 text-[10px] font-semibold text-[var(--ink)] shadow-sm">
              <LockSimple size={10} weight="bold" />
              Locked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTease({ hero }: { hero: boolean }) {
  return hero ? <AnalyticsTeaseDesktop /> : <AnalyticsTeaseMobile />;
}

function hostPreview(raw: string): string {
  try {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withScheme);
    return u.host;
  } catch {
    return raw;
  }
}

type HomeShortenDockProps = {
  /** compact = mobile dock; hero = larger desktop primary CTA */
  size?: "compact" | "hero";
};

export function HomeShortenDock({ size = "compact" }: HomeShortenDockProps) {
  const errorId = useId();
  const isHero = size === "hero";
  const [mode, setMode] = useState<"single" | "multi">("single");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [resultKind, setResultKind] = useState<"single" | "list">("single");
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canShorten =
    mode === "single" ? looksLikeUrl(url) : links.length >= 2;

  const reset = () => {
    setShortUrl(null);
    setResultKind("single");
    setResultUrls([]);
    setError(null);
    setUrl("");
    setLinks([]);
    setMode("single");
  };

  const editResultList = () => {
    setShortUrl(null);
    setError(null);
    setMode("multi");
    setLinks(resultUrls.length >= 2 ? resultUrls : links);
    setResultUrls([]);
  };

  const enterMulti = () => {
    setMode("multi");
    setError(null);
    const seed = looksLikeUrl(url) ? [url.trim()] : [];
    setLinks(seed);
    setUrl("");
  };

  const exitMulti = () => {
    setMode("single");
    setError(null);
    setUrl(links[0] || "");
    setLinks([]);
  };

  const onShorten = async () => {
    if (busy || !canShorten) return;
    setBusy(true);
    setError(null);
    try {
      if (mode === "multi") {
        const result = await shortenUrlList(links, "/api");
        setShortUrl(result.text);
        setResultKind("list");
        setResultUrls(links);
      } else {
        const raw = url.trim();
        const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
        const result = await shortenUrl(normalized, "/api");
        setShortUrl(result.text);
        setResultKind("single");
        setResultUrls([normalized]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to publish link");
    } finally {
      setBusy(false);
    }
  };

  const shellClass = isHero
    ? "rounded-[var(--radius-shell)] border border-[var(--accent)]/28 bg-[var(--accent-soft)] p-5 md:p-6"
    : "rounded-2xl border border-[var(--accent)]/28 bg-[var(--accent-soft)] p-3";

  if (shortUrl) {
    const isList = resultKind === "list";
    return (
      <div className={shellClass}>
        <div
          className={`mb-2 flex items-center gap-2 font-semibold text-[var(--accent-ink)] ${
            isHero ? "text-base" : "text-sm"
          }`}
        >
          {isList ? (
            <ListBullets size={isHero ? 20 : 18} weight="bold" />
          ) : (
            <LinkSimple size={isHero ? 20 : 18} weight="bold" />
          )}
          {isList ? "Link list ready" : "Link ready"}
        </div>

        <ShareResultPanel
          shareUrlOrCode={shortUrl}
          density={isHero ? "roomy" : "compact"}
        />

        <div className={`mt-3 flex gap-2 ${isHero ? "sm:max-w-md" : ""}`}>
          {isList ? (
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-secondary flex-1 ${isHero ? "!py-3" : "!py-2.5"}`}
            >
              Open list
              <ArrowSquareOut size={14} weight="bold" />
            </a>
          ) : null}
          <button
            type="button"
            className={`${isList ? "btn-secondary" : "btn-primary"} flex-1 ${isHero ? "!py-3" : "!py-2.5"}`}
            onClick={reset}
          >
            Publish another
          </button>
        </div>

        {isList && resultUrls.length > 0 ? (
          <div className="mt-3 rounded-xl border border-[var(--stroke)] bg-[var(--panel-soft)] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              {resultUrls.length} links in this list
            </p>
            <ol className="mt-2 space-y-1.5">
              {resultUrls.map((dest, i) => (
                <li
                  key={`${i}-${dest}`}
                  className="flex items-baseline gap-2 text-sm text-[var(--ink)]"
                >
                  <span className="shrink-0 text-xs font-medium text-[var(--muted)]">
                    {i + 1}.
                  </span>
                  <span className="min-w-0 truncate">{hostPreview(dest)}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-secondary !py-2 !text-xs"
                onClick={editResultList}
              >
                <PencilSimple size={14} weight="bold" />
                Edit links
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-[var(--muted)]">
              Edit creates a new published page with your changes.
            </p>
          </div>
        ) : null}

        {error ? (
          <p id={errorId} className="mt-2 text-sm text-[var(--warn-ink)]" role="alert">
            {error}
          </p>
        ) : null}

        <AnalyticsTease hero={isHero} />
      </div>
    );
  }

  return (
    <div className={shellClass}>
      {isHero ? (
        <div className="mb-3 flex items-center gap-2 text-base font-semibold text-[var(--accent-ink)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
            {mode === "multi" ? (
              <ListBullets size={18} weight="bold" />
            ) : (
              <LinkSimple size={18} weight="bold" />
            )}
          </span>
          {mode === "multi" ? "Share multiple links" : "Share a link"}
        </div>
      ) : (
        <label
          htmlFor="home-shorten-url"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-ink)]"
        >
          {mode === "multi" ? "Share multiple links" : "Share a link"}
        </label>
      )}

      {mode === "single" ? (
        <>
          <div className={`flex gap-2 ${isHero ? "flex-col sm:flex-row" : ""}`}>
            {isHero ? (
              <label className="sr-only" htmlFor="home-shorten-url">
                URL to publish
              </label>
            ) : null}
            <input
              id={isHero ? undefined : "home-shorten-url"}
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void onShorten();
                }
              }}
              placeholder="Paste a long URL…"
              disabled={busy}
              className={`field min-w-0 flex-1 !rounded-xl !text-base ${
                isHero ? "!py-3.5" : "!py-3"
              }`}
              autoComplete="url"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
            <button
              type="button"
              className={`btn-primary shrink-0 ${
                isHero ? "!px-6 !py-3.5 sm:min-w-[8.5rem]" : "!px-4 !py-3"
              }`}
              disabled={busy || !canShorten}
              onClick={() => void onShorten()}
            >
              {busy ? "…" : "Publish"}
            </button>
          </div>
          <button
            type="button"
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            onClick={enterMulti}
            disabled={busy}
          >
            <ListBullets size={14} weight="bold" />
            Add more links on one page
          </button>
        </>
      ) : (
        <>
          <MultiLinkBuilder
            links={links}
            onChange={setLinks}
            disabled={busy}
            density="compact"
            draftPlaceholder="Next link…"
          />
          <div className={`mt-3 flex gap-2 ${isHero ? "sm:max-w-md" : ""}`}>
            <button
              type="button"
              className={`btn-primary flex-1 ${isHero ? "!py-3" : "!py-2.5"}`}
              disabled={busy || !canShorten}
              onClick={() => void onShorten()}
            >
              {busy ? "…" : "Publish list"}
            </button>
            <button
              type="button"
              className={`btn-secondary ${isHero ? "!py-3 !px-4" : "!py-2.5 !px-3"}`}
              disabled={busy}
              onClick={exitMulti}
            >
              One link
            </button>
          </div>
          {links.length === 1 ? (
            <p className="mt-2 text-xs text-[var(--muted)]">
              Add at least one more link to create a list.
            </p>
          ) : null}
        </>
      )}

      {error ? (
        <p id={errorId} className="mt-2 text-sm text-[var(--warn-ink)]" role="alert">
          {error}
        </p>
      ) : null}
      {isHero && mode === "single" ? (
        <p className="mt-3 text-xs leading-relaxed text-[var(--accent-ink)]/75">
          Free deskzy.xyz share pages. No signup. Only the URL string is sent —
          never your files.
        </p>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  ChartLineUp,
  LinkSimple,
  LockSimple,
  Sparkle,
} from "@phosphor-icons/react";
import { formatInr, PRO_MONTHLY_INR } from "@/lib/pricing";
import { shortenUrl } from "@/lib/tools/text";

function looksLikeUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  try {
    const withProtocol = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    const u = new URL(withProtocol);
    return u.hostname.includes(".");
  } catch {
    return false;
  }
}

const SPARK = [4, 7, 6, 10, 9, 14, 12, 18, 16, 22, 20, 26];

const TEASE_STATS = [
  { label: "Clicks", value: "1.2k" },
  { label: "Countries", value: "18" },
  { label: "Top src", value: "IG" },
] as const;

function MiniSparkline({ className }: { className?: string }) {
  const w = 160;
  const h = 48;
  const max = Math.max(...SPARK);
  const points = SPARK.map((v, i) => {
    const x = (i / (SPARK.length - 1)) * w;
    const y = h - 4 - (v / max) * (h - 8);
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${h} ${points} ${w},${h}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      aria-hidden
      preserveAspectRatio="none"
    >
      <polygon points={area} fill="var(--accent)" opacity="0.2" />
      <polyline
        points={points}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnalyticsTease({ hero }: { hero: boolean }) {
  return (
    <div
      className={`mt-3 overflow-hidden rounded-2xl border border-[var(--ink)]/10 bg-[var(--ink)] text-white ${
        hero ? "p-4 sm:p-5" : "p-3.5"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
          <LockSimple size={11} weight="bold" />
          Pro analytics
        </span>
        <span className="text-[11px] font-medium text-white/65">
          From {formatInr(PRO_MONTHLY_INR)}/mo
        </span>
      </div>

      <div className={`mt-3 grid gap-3 ${hero ? "sm:grid-cols-[1.15fr_0.85fr] sm:items-end" : ""}`}>
        <div className="min-w-0">
          <p
            className={`font-display font-semibold tracking-tight text-white ${
              hero ? "text-xl leading-snug" : "text-base"
            }`}
          >
            See who clicks this link
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/70 sm:text-sm">
            Cities, devices, Instagram vs WhatsApp — know what converts.
          </p>

          <div className={`mt-3 grid grid-cols-3 gap-2 ${hero ? "max-w-sm" : ""}`}>
            {TEASE_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2"
              >
                <p className="text-[10px] uppercase tracking-[0.12em] text-white/55">
                  {s.label}
                </p>
                <p className="mt-0.5 font-display text-lg font-semibold tabular-nums tracking-tight">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div className={`mt-3.5 flex flex-wrap gap-2 ${hero ? "" : ""}`}>
            <Link
              href="/link-analytics"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[var(--ink)] transition hover:bg-white/90 active:scale-[0.98]"
            >
              <ChartLineUp size={14} weight="bold" />
              Preview dashboard
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
            >
              <Sparkle size={14} weight="fill" />
              Upgrade
            </Link>
          </div>
        </div>

        {hero ? (
          <div
            className="relative hidden overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 sm:block"
            aria-hidden
          >
            <div className="mb-2 flex items-center justify-between text-[10px] text-white/55">
              <span>Clicks · 30d</span>
              <span className="rounded-full bg-[var(--accent)]/90 px-1.5 py-0.5 font-semibold text-white">
                +18%
              </span>
            </div>
            <MiniSparkline className="h-12 w-full opacity-95" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[var(--ink)]/25 backdrop-blur-[1px]">
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--ink)]">
                Locked preview
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type HomeShortenDockProps = {
  /** compact = mobile dock; hero = larger desktop primary CTA */
  size?: "compact" | "hero";
};

export function HomeShortenDock({ size = "compact" }: HomeShortenDockProps) {
  const inputId = useId();
  const errorId = useId();
  const isHero = size === "hero";
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<number | null>(null);

  const clearCopiedTimeout = () => {
    if (copiedTimeoutRef.current !== null) {
      window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = null;
    }
  };

  useEffect(() => () => clearCopiedTimeout(), []);

  const reset = () => {
    clearCopiedTimeout();
    setShortUrl(null);
    setError(null);
    setCopied(false);
    setUrl("");
  };

  const onShorten = async () => {
    if (!looksLikeUrl(url) || busy) return;
    setBusy(true);
    setError(null);
    try {
      const raw = url.trim();
      const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      const result = await shortenUrl(normalized, "/api");
      setShortUrl(result.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to shorten URL");
    } finally {
      setBusy(false);
    }
  };

  const onCopy = async () => {
    if (!shortUrl) return;
    setError(null);
    try {
      await navigator.clipboard.writeText(shortUrl);
      clearCopiedTimeout();
      setCopied(true);
      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        copiedTimeoutRef.current = null;
      }, 1600);
    } catch {
      setError("Could not copy — select the link and copy manually");
    }
  };

  const shellClass = isHero
    ? "rounded-[var(--radius-shell)] border border-[var(--accent)]/28 bg-[var(--accent-soft)] p-5 md:p-6"
    : "rounded-2xl border border-[var(--accent)]/28 bg-[var(--accent-soft)] p-3.5";

  if (shortUrl) {
    return (
      <div className={shellClass}>
        <div
          className={`mb-2 flex items-center gap-2 font-semibold text-[var(--accent-ink)] ${
            isHero ? "text-base" : "text-sm"
          }`}
        >
          <LinkSimple size={isHero ? 20 : 18} weight="bold" />
          Short link ready
        </div>
        <p
          className={`mb-3 break-all rounded-xl border border-[var(--stroke)] bg-white font-mono text-[var(--ink)] ${
            isHero ? "px-4 py-3 text-base" : "px-3 py-2.5 text-sm"
          }`}
        >
          {shortUrl}
        </p>
        <div className={`flex gap-2 ${isHero ? "sm:max-w-md" : ""}`}>
          <button
            type="button"
            className={`btn-primary flex-1 ${isHero ? "!py-3" : "!py-2.5"}`}
            onClick={onCopy}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            className={`btn-secondary flex-1 ${isHero ? "!py-3" : "!py-2.5"}`}
            onClick={reset}
          >
            Shorten another
          </button>
        </div>
        {error ? (
          <p id={errorId} className="mt-2 text-sm text-[var(--warn-ink)]" role="alert">
            {error}
          </p>
        ) : null}

        <AnalyticsTease hero={isHero} />

        <Link
          href="/tools/url-shortener"
          className="mt-3 inline-block text-xs font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Open full shortener
        </Link>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <div
        className={`mb-2 flex items-center gap-2 font-semibold text-[var(--accent-ink)] ${
          isHero ? "mb-3 text-base" : "text-sm"
        }`}
      >
        <span
          className={`flex items-center justify-center rounded-lg bg-[var(--accent)] text-white ${
            isHero ? "h-9 w-9 rounded-xl" : "h-7 w-7"
          }`}
        >
          <LinkSimple size={isHero ? 18 : 16} weight="bold" />
        </span>
        Shorten a link
      </div>
      <div className={`flex gap-2 ${isHero ? "flex-col sm:flex-row" : ""}`}>
        <label className="sr-only" htmlFor={inputId}>
          URL to shorten
        </label>
        <input
          id={inputId}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void onShorten();
          }}
          placeholder="Paste a long URL…"
          disabled={busy}
          className={`field min-w-0 flex-1 !rounded-xl !text-base ${
            isHero ? "!py-3.5" : "!py-2.5"
          }`}
          autoComplete="url"
          inputMode="url"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        <button
          type="button"
          className={`btn-primary shrink-0 ${
            isHero ? "!px-6 !py-3.5 sm:min-w-[8.5rem]" : "!px-4 !py-2.5"
          }`}
          disabled={busy || !looksLikeUrl(url)}
          onClick={() => void onShorten()}
        >
          {busy ? "…" : "Shorten"}
        </button>
      </div>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-[var(--warn-ink)]" role="alert">
          {error}
        </p>
      ) : null}
      {isHero ? (
        <p className="mt-3 text-xs leading-relaxed text-[var(--accent-ink)]/75">
          Free deskzy.xyz short links. No signup. Only the URL string is sent —
          never your files.
        </p>
      ) : null}
    </div>
  );
}

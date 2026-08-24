"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, CopySimple } from "@phosphor-icons/react";
import {
  AdsterraNativeBanner,
  AdsterraRevenueStack,
  AdsterraSmartlinkCta,
} from "@/components/Adsterra";
import { HopDiscoverFooter } from "@/components/HopDiscoverFooter";
import { HopDiscoverHeader } from "@/components/HopDiscoverHeader";
import { HopPublishCanvas } from "@/components/HopPublishCanvas";
import { HopShareBar } from "@/components/HopShareBar";

type LinkListHopProps = {
  urls: string[];
  code: string;
};

function trackHopClick(code: string) {
  const url = `/api/links/${encodeURIComponent(code)}/click`;
  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(url);
      return;
    }
  } catch {
    /* fall through */
  }
  void fetch(url, { method: "POST", keepalive: true }).catch(() => {});
}

function PasteLinkRow({
  dest,
  index,
}: {
  dest: string;
  index: number;
}) {
  const [copied, setCopied] = useState(false);

  const copyDest = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(dest);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [dest]);

  return (
    <li className="group flex flex-col gap-3 rounded-[1.35rem] border border-white/70 bg-white/75 p-4 shadow-[0_8px_18px_rgba(120,93,139,0.06)] sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <p className="min-w-0 flex-1 text-[1.02rem] leading-relaxed text-[var(--ink)]">
        <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent-ink)]">
          {index + 1}
        </span>
        <a
          href={dest}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-medium text-[var(--accent-ink)] underline decoration-transparent underline-offset-4 hover:decoration-[var(--accent)]"
        >
          {dest}
        </a>
      </p>
      <button
        type="button"
        onClick={() => void copyDest()}
        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-[color-mix(in_srgb,var(--accent)_16%,white)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--muted)] shadow-[0_8px_16px_rgba(120,93,139,0.06)] transition-transform hover:-translate-y-0.5 hover:text-[var(--ink)]"
        aria-label={copied ? `Copied link ${index + 1}` : `Copy link ${index + 1}`}
      >
        {copied ? (
          <>
            <span className="text-[var(--accent)]">
              <Check size={13} weight="bold" />
            </span>
            Copied
          </>
        ) : (
          <>
            <CopySimple size={13} weight="bold" />
            Copy
          </>
        )}
      </button>
    </li>
  );
}

/**
 * Pastelink-style multi-link paste — canvas + reshare + publish tease.
 */
export function LinkListHop({ urls, code }: LinkListHopProps) {
  const tracked = useRef(false);
  const count = urls.length;

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackHopClick(code);
  }, [code]);

  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <HopDiscoverHeader />

      <article className="flex flex-1 flex-col">
        <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(250,244,248,0.9))] p-4 shadow-[0_20px_50px_rgba(120,93,139,0.1)] sm:p-6">
          <header className="rounded-[1.5rem] border border-white/70 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[color-mix(in_srgb,var(--accent)_20%,white)] bg-[color-mix(in_srgb,var(--accent-soft)_65%,white)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-ink)]">
                Published page
              </span>
              <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[10px] font-medium tracking-[0.1em] text-[var(--muted)]">
                Multi-link layout
              </span>
            </div>
            <h1 className="mt-4 font-display text-[2rem] font-semibold tracking-tight text-[var(--ink)] sm:text-[2.35rem]">
              {count} {count === 1 ? "link" : "links"}
            </h1>
            <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-[var(--muted)]">
              Shared content — open any link below or copy them one by one.
            </p>
          </header>

          <ol className="mt-4 space-y-3">
            {urls.map((dest, i) => (
              <PasteLinkRow
                key={`${i}-${dest}`}
                dest={dest}
                index={i}
              />
            ))}
          </ol>
        </div>

        <div className="mt-5 rounded-[1.75rem] border border-white/70 bg-white/55 p-4 shadow-[0_14px_32px_rgba(120,93,139,0.08)] backdrop-blur-xl sm:p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Page link
          </p>
          <HopShareBar code={code} />
        </div>

        <div className="mt-5 sm:hidden">
          <AdsterraNativeBanner />
        </div>

        <div className="mt-5">
          <HopPublishCanvas />
        </div>

        <div className="mt-5">
          <AdsterraSmartlinkCta />
        </div>

        <AdsterraRevenueStack className="mt-5" />

        <HopDiscoverFooter />
      </article>
    </div>
  );
}

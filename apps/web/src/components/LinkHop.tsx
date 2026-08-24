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

type LinkHopProps = {
  dest: string;
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

/**
 * Pastelink-style published page — content canvas + reshare + publish tease.
 */
export function LinkHop({ dest, code }: LinkHopProps) {
  const [copied, setCopied] = useState(false);
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackHopClick(code);
  }, [code]);

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
                PasteLink-inspired layout
              </span>
            </div>
            <h1 className="mt-4 font-display text-[2rem] font-semibold tracking-tight text-[var(--ink)] sm:text-[2.35rem]">
              Shared content
            </h1>
            <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-[var(--muted)]">
              Open the destination, copy it, or share this page with a cleaner preview.
            </p>
          </header>

          <div className="mt-4 rounded-[1.5rem] border border-white/70 bg-white/70 p-4 shadow-[0_12px_28px_rgba(120,93,139,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Destination
              </p>
              <p className="text-[10px] text-[var(--muted)]">One tap away</p>
            </div>
            <div className="mt-3">
              <a
                href={dest}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all rounded-[1.15rem] border border-[rgba(185,162,197,0.32)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(251,247,250,0.92))] px-4 py-3 font-mono text-[14px] font-medium text-[var(--accent-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
              >
                {dest}
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-white/70 bg-white/65 px-4 py-4 shadow-[0_12px_26px_rgba(120,93,139,0.06)]">
            <button
              type="button"
              onClick={() => void copyDest()}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_24%,white)] bg-white px-4 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_18px_rgba(120,93,139,0.07)] transition-transform hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_36%,white)]"
              aria-label={copied ? "Copied destination" : "Copy destination"}
            >
              {copied ? (
                <>
                  <span className="text-[var(--accent)]">
                    <Check size={15} weight="bold" />
                  </span>
                  Copied
                </>
              ) : (
                <>
                  <CopySimple size={15} weight="bold" />
                  Copy destination
                </>
              )}
            </button>
            <span className="text-xs text-[var(--muted)]">
              Tip: copy the page link below if the destination is private or long.
            </span>
          </div>
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

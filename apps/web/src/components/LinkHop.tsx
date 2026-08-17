"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, CopySimple } from "@phosphor-icons/react";
import {
  AdsterraRevenueStack,
  AdsterraShareExtras,
  AdsterraSmartlinkCta,
  AdsterraSoftRail,
} from "@/components/Adsterra";
import { HopDiscoverFooter } from "@/components/HopDiscoverFooter";
import { HopDiscoverHeader } from "@/components/HopDiscoverHeader";
import { HopPublishCanvas } from "@/components/HopPublishCanvas";
import { HopShareBar } from "@/components/HopShareBar";
import { HopSponsoredContinue } from "@/components/HopSponsoredContinue";

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
  const [pendingDest, setPendingDest] = useState<string | null>(null);
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
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <HopDiscoverHeader />

      <article className="flex flex-1 flex-col">
        {/* Content canvas */}
        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] sm:p-6">
          <header className="border-b border-[var(--stroke)] pb-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Published
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
              Shared content
            </h1>
          </header>

          <div className="prose-paste mt-6 text-[1.05rem] leading-relaxed text-[var(--ink)]">
            <p>
              <a
                href={dest}
                rel="noopener noreferrer"
                onClick={(event) => {
                  event.preventDefault();
                  setPendingDest(dest);
                }}
                className="break-all font-medium text-[var(--accent-ink)] underline decoration-[var(--stroke-strong)] underline-offset-4 hover:decoration-[var(--accent)]"
              >
                {dest}
              </a>
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--stroke)] pt-5">
            <button
              type="button"
              onClick={() => void copyDest()}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--stroke)] bg-[var(--bg-elevated)] px-3.5 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--stroke-strong)]"
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
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-4 sm:p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Page link
          </p>
          <HopShareBar code={code} />
        </div>

        <AdsterraSoftRail className="mt-5" />
        <AdsterraSmartlinkCta />

        <div className="mt-5">
          <HopPublishCanvas />
        </div>

        <AdsterraRevenueStack className="mt-5" />

        <HopDiscoverFooter />
        <AdsterraShareExtras />
      </article>
      <HopSponsoredContinue
        dest={pendingDest}
        onClose={() => setPendingDest(null)}
      />
    </div>
  );
}

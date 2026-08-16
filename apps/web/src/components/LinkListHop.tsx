"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, CopySimple } from "@phosphor-icons/react";
import { AdsterraBanner, AdsterraShareExtras } from "@/components/Adsterra";
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

function PasteLinkRow({ dest, index }: { dest: string; index: number }) {
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
    <li className="group flex flex-col gap-1.5 border-b border-[var(--stroke)] py-4 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <p className="min-w-0 flex-1 text-[1.05rem] leading-relaxed">
        <span className="mr-2 text-sm text-[var(--muted)]">{index + 1}.</span>
        <a
          href={dest}
          rel="noopener noreferrer"
          className="break-all font-medium text-[var(--accent-ink)] underline decoration-[var(--stroke-strong)] underline-offset-4 hover:decoration-[var(--accent)]"
        >
          {dest}
        </a>
      </p>
      <button
        type="button"
        onClick={() => void copyDest()}
        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--ink)]"
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
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <HopDiscoverHeader />

      <article className="flex flex-1 flex-col">
        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] sm:p-6">
          <header className="border-b border-[var(--stroke)] pb-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Published
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
              {count} {count === 1 ? "link" : "links"}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Shared content — open any link below.
            </p>
          </header>

          <ol className="mt-2 list-none">
            {urls.map((dest, i) => (
              <PasteLinkRow key={`${i}-${dest}`} dest={dest} index={i} />
            ))}
          </ol>
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-4 sm:p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Page link
          </p>
          <HopShareBar code={code} />
        </div>

        <div className="mt-5">
          <HopPublishCanvas />
        </div>

        <div className="mt-5">
          <AdsterraBanner size="300x250" />
        </div>

        <HopDiscoverFooter />
        <AdsterraShareExtras />
      </article>
    </div>
  );
}

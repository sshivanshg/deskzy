"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { AdsterraBanner, AdsterraSmartlinkCta } from "@/components/Adsterra";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

/**
 * Hyperlink marketing canvas — Pastelink-style “create your own” tease.
 * Looks like a publish input; links to Deskzy. Not an interstitial wall.
 */
export function HopPublishCanvas() {
  const publishHref = `${SITE_URL}/tools/url-shortener`;

  return (
    <section
      className="rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] p-4 sm:p-5"
      aria-label={`Publish with ${SITE_NAME}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        Make your own
      </p>
      <p className="mt-1.5 font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
        Publish links free on {SITE_NAME}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
        Paste a URL, get a clean share page — plus private PDF &amp; image tools
        in your browser.
      </p>

      <a
        href={publishHref}
        rel="noopener noreferrer"
        className="mt-4 flex items-stretch gap-2 rounded-xl border border-[var(--stroke)] bg-[var(--panel)] p-1.5 transition-colors hover:border-[var(--accent)]/40"
      >
        <span className="flex min-w-0 flex-1 items-center px-3 py-2.5 font-mono text-sm text-[var(--muted)]">
          https://your-link.com
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3.5 text-sm font-semibold text-white">
          Publish
          <ArrowRight size={14} weight="bold" />
        </span>
      </a>

      <p className="mt-3 text-center text-[11px] text-[var(--muted)]">
        No signup ·{" "}
        <a
          href={SITE_URL}
          rel="noopener noreferrer"
          className="font-medium text-[var(--accent-ink)] underline-offset-2 hover:underline"
        >
          deskzy.xyz
        </a>
      </p>

      <div className="mt-4">
        <AdsterraBanner size="300x250" />
      </div>

      <AdsterraSmartlinkCta />
    </section>
  );
}

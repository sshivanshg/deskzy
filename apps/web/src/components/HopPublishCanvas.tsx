"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

/**
 * Hyperlink marketing canvas — Pastelink-style “create your own” tease.
 * Looks like a publish input; links to Deskzy. Not an interstitial wall.
 */
export function HopPublishCanvas() {
  const publishHref = `${SITE_URL}/tools/url-shortener`;

  return (
    <section
      className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(250,242,247,0.88))] p-4 shadow-[0_18px_40px_rgba(123,91,141,0.08)] sm:p-5"
      aria-label={`Publish with ${SITE_NAME}`}
    >
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        Make your own
      </div>
      <p className="mt-2 font-display text-[1.08rem] font-semibold tracking-tight text-[var(--ink)] sm:text-[1.15rem]">
        Publish links free on {SITE_NAME}
      </p>
      <p className="mt-1.5 max-w-[42ch] text-xs leading-relaxed text-[var(--muted)]">
        Paste a URL, get a clean share page — plus private PDF &amp; image tools
        in your browser.
      </p>

      <a
        href={publishHref}
        rel="noopener noreferrer"
        className="mt-4 flex items-stretch gap-2 rounded-[1.3rem] border border-white/80 bg-white/85 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_24px_rgba(120,93,139,0.08)] transition-transform transition-colors hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_34%,white)]"
      >
        <span className="flex min-w-0 flex-1 items-center rounded-[1rem] bg-[rgba(255,255,255,0.75)] px-3 py-2.5 font-mono text-sm text-[var(--muted)]">
          https://your-link.com
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[1rem] bg-[var(--accent)] px-3.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(131,103,153,0.22)]">
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
    </section>
  );
}

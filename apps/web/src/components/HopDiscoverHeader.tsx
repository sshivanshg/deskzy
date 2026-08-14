import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

/**
 * Visible top brand on published pages — discovery into Deskzy tools.
 * Not an interstitial: no countdown, captcha, or "shortened with" copy.
 */
export function HopDiscoverHeader() {
  return (
    <div className="mb-8 flex items-center justify-between gap-3">
      <a
        href={SITE_URL}
        rel="noopener noreferrer"
        className="group flex min-w-0 items-center gap-2.5"
        aria-label={`${SITE_NAME} — free file tools`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${SITE_URL}/logo-mark.png`}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded-lg object-contain dark:brightness-[1.55] dark:saturate-[1.15]"
        />
        <span className="min-w-0">
          <span className="block font-display text-base font-semibold tracking-tight text-[var(--ink)] group-hover:text-[var(--accent-ink)]">
            {SITE_NAME}
          </span>
          <span className="block text-[11px] leading-snug text-[var(--muted)]">
            Free PDF &amp; image tools
          </span>
        </span>
      </a>
      <a
        href={`${SITE_URL}/pdf`}
        rel="noopener noreferrer"
        className="shrink-0 rounded-lg border border-[var(--stroke)] bg-[var(--bg-elevated)] px-3 py-2 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--stroke-strong)] hover:text-[var(--accent-ink)]"
      >
        Try tools
      </a>
    </div>
  );
}

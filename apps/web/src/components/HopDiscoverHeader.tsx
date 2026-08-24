import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

/**
 * Visible top brand on published pages — discovery into Deskzy tools.
 * Not an interstitial: no countdown, captcha, or "shortened with" copy.
 */
export function HopDiscoverHeader() {
  return (
    <div className="mb-8 flex items-center justify-between gap-3 rounded-[1.5rem] border border-white/60 bg-white/55 px-4 py-3 shadow-[0_14px_40px_rgba(106,83,126,0.08)] backdrop-blur-xl sm:px-5">
      <a
        href={SITE_URL}
        rel="noopener noreferrer"
        className="group flex min-w-0 items-center gap-3"
        aria-label={`${SITE_NAME} — free file tools`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(245,230,241,0.96))] text-[var(--accent-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_18px_rgba(131,103,153,0.14)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${SITE_URL}/logo-mark.png`}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 object-contain dark:brightness-[1.45] dark:saturate-[1.12]"
          />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-[15px] font-semibold tracking-tight text-[var(--ink)] group-hover:text-[var(--accent-ink)]">
            {SITE_NAME}
          </span>
          <span className="block text-[11px] leading-snug text-[var(--muted)]">
            private tools · pastelink-style sharing
          </span>
        </span>
      </a>
      <a
        href={`${SITE_URL}/pdf`}
        rel="noopener noreferrer"
        className="shrink-0 rounded-full border border-[color-mix(in_srgb,var(--accent)_18%,white)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--ink)] shadow-[0_8px_18px_rgba(106,83,126,0.08)] transition-transform transition-colors hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_32%,white)] hover:text-[var(--accent-ink)]"
      >
        Try tools
      </a>
    </div>
  );
}

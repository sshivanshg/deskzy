import Link from "next/link";
import { XLogo } from "@phosphor-icons/react/dist/ssr";
import { BrandLogo } from "@/components/BrandLogo";
import { CONTACT_X_HANDLE, CONTACT_X_URL } from "@/lib/seo/site";
import {
  CATEGORIES,
  getPopularTools,
  TOOLS,
} from "@/lib/tools/registry";

export function SiteFooter() {
  const popular = getPopularTools();

  return (
    <footer className="relative z-0 mx-auto mt-8 max-w-6xl px-4 pb-12 pt-4">
      <div className="shell">
        <div className="shell-core px-5 py-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <BrandLogo className="opacity-95" />
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
                Drop. Done. Private. Files stay in your browser whenever
                possible.
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                <Link
                  href="/privacy"
                  className="text-sm font-medium text-[var(--ink)] underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm font-medium text-[var(--ink)] underline-offset-4 hover:underline"
                >
                  Terms of Use
                </Link>
                <Link
                  href="/business"
                  className="text-sm font-medium text-[var(--ink)] underline-offset-4 hover:underline"
                >
                  Business
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-[var(--ink)] underline-offset-4 hover:underline"
                >
                  Pricing
                </Link>
                <Link
                  href="/link-analytics"
                  className="text-sm font-medium text-[var(--ink)] underline-offset-4 hover:underline"
                >
                  Link analytics
                </Link>
                <Link
                  href="/guides"
                  className="text-sm text-[var(--muted)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
                >
                  Guides
                </Link>
                <Link
                  href="/about"
                  className="text-sm text-[var(--muted)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
                >
                  About
                </Link>
                <a
                  href={CONTACT_X_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-3.5 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--stroke-strong)] hover:bg-[var(--panel-soft)]"
                >
                  <XLogo size={16} weight="bold" />
                  Contact @{CONTACT_X_HANDLE}
                </a>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Categories
              </p>
              <ul className="mt-3 space-y-2">
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/${c.id}`}
                      className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
                    >
                      {c.name} tools
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Popular tools
              </p>
              <ul className="mt-3 space-y-2">
                {popular.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                All tools
              </p>
              <ul className="mt-3 max-h-48 space-y-2 overflow-auto pr-2">
                {TOOLS.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 border-t border-[var(--stroke)] pt-6 text-xs text-[var(--muted)]">
            Free online file tools · PDF · Image · Text · Share links ·{" "}
            <Link href="/guides" className="hover:text-[var(--ink)]">
              Guides
            </Link>
            {" · "}
            <Link href="/pricing" className="hover:text-[var(--ink)]">
              Pricing
            </Link>
            {" · "}
            <Link href="/privacy" className="hover:text-[var(--ink)]">
              Privacy
            </Link>
            {" · "}
            <Link href="/terms" className="hover:text-[var(--ink)]">
              Terms
            </Link>
            {" · "}
            <Link href="/sitemap.xml" className="hover:text-[var(--ink)]">
              Sitemap
            </Link>
            {" · "}
            <a
              href={CONTACT_X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--ink)]"
            >
              @{CONTACT_X_HANDLE}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FilePdf,
  Image as ImageIcon,
  LinkSimple,
  MusicNotes,
  TextT,
} from "@phosphor-icons/react/dist/ssr";
import { HomeSearch } from "@/components/HomeSearch";
import { JsonLd } from "@/components/JsonLd";
import { buildWebsiteJsonLd } from "@/lib/seo/json-ld";
import {
  buildPageMetadata,
  DEFAULT_DESCRIPTION,
} from "@/lib/seo/site";
import {
  CATEGORIES,
  USE_CASES,
  getPopularTools,
  type ToolCategory,
} from "@/lib/tools/registry";

export const metadata: Metadata = buildPageMetadata({
  title: "Deskzy — Every file tool. One place.",
  description: DEFAULT_DESCRIPTION,
  path: "/",
  keywords: [
    "file tools",
    "pdf tools online",
    "image compressor",
    "url shortener free",
    "private file tools",
    "no signup",
  ],
});

const CAT_ICON: Record<ToolCategory, typeof FilePdf> = {
  pdf: FilePdf,
  media: MusicNotes,
  image: ImageIcon,
  links: LinkSimple,
  text: TextT,
};

export default function HomePage() {
  const popular = getPopularTools();

  return (
    <>
      <JsonLd data={buildWebsiteJsonLd()} />
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 md:pt-16">
        <section className="grid items-end gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
          <div className="reveal">
            <p className="mb-4 inline-flex items-center rounded-full border border-[var(--stroke)] bg-white/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Private file toolkit
            </p>
            <h1 className="font-display text-5xl font-semibold tracking-tight text-[var(--ink)] md:text-6xl md:leading-[0.95]">
              Free online file tools — private &amp; no signup
            </h1>
            <p className="mt-4 max-w-[32ch] text-lg leading-relaxed text-[var(--muted)] md:text-xl">
              Every file tool. One place.
            </p>
            <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-[var(--muted)]">
              Merge PDFs, compress images, format JSON, shorten URLs, and more.
              Most tools never leave your browser.
            </p>
          </div>

          <div className="reveal reveal-delay-1">
            <HomeSearch />
          </div>
        </section>

        <section className="mt-12 reveal reveal-delay-1 md:mt-16">
          <Link
            href="/tools/url-shortener"
            className="group relative block overflow-hidden rounded-[var(--radius-shell)] border border-[var(--accent)]/25 bg-[var(--accent-soft)]"
          >
            <div className="relative flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-white">
                  <LinkSimple size={24} weight="bold" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
                    Featured
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
                    URL Shortener — free link shortener
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--accent-ink)]/80 md:text-base">
                    Paste a long link. Get a short deskzy.xyz URL. No signup, no
                    upload.
                  </p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-300 group-hover:translate-x-0.5 md:self-center">
                Shorten a link
                <ArrowRight size={16} weight="bold" />
              </span>
            </div>
          </Link>
        </section>

        <section className="mt-16 reveal reveal-delay-2 md:mt-24">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              What do you need?
            </h2>
            <p className="hidden text-sm text-[var(--muted)] sm:block">
              Jump straight to the tool
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((uc) => {
              const featured = uc.id === "shorten";
              return (
                <Link
                  key={uc.id}
                  href={uc.href}
                  className={`group rounded-[var(--radius-core)] border px-4 py-4 transition-colors ${
                    featured
                      ? "border-[var(--accent)]/35 bg-[var(--accent-soft)] hover:border-[var(--accent)]/55"
                      : "border-[var(--stroke)] bg-white/50 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]/50"
                  }`}
                >
                  <p className="font-medium text-[var(--ink)]">{uc.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                    {uc.hint}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
                    {featured ? "Shorten" : "Open"}
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      <ArrowRight size={12} />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16 reveal reveal-delay-2 md:mt-24">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Popular right now
            </h2>
            <p className="hidden text-sm text-[var(--muted)] sm:block">
              Fast paths people come back for
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.slice(0, 6).map((t, i) => {
              const isShortener = t.slug === "url-shortener";
              return (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className={`group shell ${isShortener ? "ring-1 ring-[var(--accent)]/30 sm:col-span-2 lg:col-span-1" : ""}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="shell-core flex h-full flex-col justify-between p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                        {isShortener ? "Featured · links" : t.category}
                      </p>
                      <p className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
                        {t.name}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                        {t.description}
                      </p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
                      {isShortener ? "Shorten now" : "Open tool"}
                      <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                        <ArrowRight size={14} />
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16 reveal reveal-delay-3 md:mt-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Browse by category
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            PDF, image, media, links, and developer utilities — all free, most
            running privately in your browser.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {CATEGORIES.map((c) => {
              const Icon = CAT_ICON[c.id];
              return (
                <Link key={c.id} href={`/${c.id}`} className="group shell">
                  <div className="shell-core flex items-start gap-4 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Icon size={22} weight="duotone" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-display text-lg font-semibold tracking-tight">
                          {c.name}
                        </span>
                        <span className="text-[var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]">
                          <ArrowRight size={16} />
                        </span>
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-[var(--muted)]">
                        {c.description}
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

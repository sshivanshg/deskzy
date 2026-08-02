import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FilePdf,
  Image as ImageIcon,
  LinkSimple,
  LockSimple,
  MusicNotes,
  QrCode,
  ShieldCheck,
  TextT,
} from "@phosphor-icons/react/dist/ssr";
import { HomeCategoryChips } from "@/components/HomeCategoryChips";
import { HomePopularStrip } from "@/components/HomePopularStrip";
import { HomeSearch } from "@/components/HomeSearch";
import { HomeShortenDock } from "@/components/HomeShortenDock";
import { JsonLd } from "@/components/JsonLd";
import { buildWebsiteJsonLd } from "@/lib/seo/json-ld";
import {
  buildPageMetadata,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
} from "@/lib/seo/site";
import {
  CATEGORIES,
  USE_CASES,
  getPopularTools,
  getTool,
  type ToolCategory,
} from "@/lib/tools/registry";

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} — Short links on deskzy.xyz, private file tools`,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  keywords: [
    "url shortener free",
    "deskzy.xyz short link",
    "private file tools",
    "pdf tools online",
    "image compressor",
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

/** Home display order: Links first, then acquisition categories. */
const HOME_CATEGORIES = [
  ...CATEGORIES.filter((c) => c.id === "links"),
  ...CATEGORIES.filter((c) => c.id !== "links"),
];

const SHARE_STACK = [
  {
    slug: "qr-code",
    label: "QR code",
    hint: "From any URL or text",
    icon: QrCode,
  },
  {
    slug: "utm-builder",
    label: "UTM builder",
    hint: "Track campaign links",
    icon: LinkSimple,
  },
  {
    slug: "whatsapp-link",
    label: "WhatsApp link",
    hint: "wa.me with a message",
    icon: LinkSimple,
  },
  {
    slug: "bio-link",
    label: "Bio link page",
    hint: "Downloadable HTML",
    icon: LinkSimple,
  },
] as const;

const FILE_COMPLEMENT = [
  "compress-pdf",
  "merge-pdf",
  "compress-image",
  "json-formatter",
] as const;

const TRUST = [
  {
    icon: ShieldCheck,
    label: "No signup",
    detail: "Start in one paste",
  },
  {
    icon: LockSimple,
    label: "Files stay local",
    detail: "PDF & images in-browser",
  },
  {
    icon: LinkSimple,
    label: "deskzy.xyz links",
    detail: "Short links you own",
  },
] as const;

export default function HomePage() {
  const popular = getPopularTools();
  const shareUseCases = USE_CASES.filter((uc) =>
    ["qr", "utm", "whatsapp", "bio"].includes(uc.id),
  );
  const fileUseCases = USE_CASES.filter((uc) =>
    ["compress-pdf", "merge-pdf", "compress-image", "json"].includes(uc.id),
  );

  return (
    <>
      <JsonLd data={buildWebsiteJsonLd()} />

      {/* Mobile hero */}
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 md:hidden">
        <div className="reveal space-y-4">
          <p className="font-display text-3xl font-semibold tracking-tight text-[var(--ink)] leading-[1.05]">
            Deskzy
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--ink)] leading-snug">
            Short links on deskzy.xyz — free &amp; private
          </h1>
          <p className="max-w-[40ch] text-sm leading-relaxed text-[var(--muted)]">
            Paste a URL. Get a clean short link. PDF and image tools stay in
            your browser.
          </p>
          <HomeShortenDock size="compact" />
          <ul className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
            {TRUST.map((t) => {
              const Icon = t.icon;
              return (
                <li
                  key={t.label}
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)]"
                >
                  <span className="text-[var(--accent)]">
                    <Icon size={14} weight="duotone" />
                  </span>
                  {t.label}
                </li>
              );
            })}
          </ul>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Share stack
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            QR, UTM, WhatsApp, and bio — alongside your short link
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {shareUseCases.map((uc) => (
              <Link
                key={uc.id}
                href={uc.href}
                className="rounded-[var(--radius-core)] border border-[var(--stroke)] bg-white/50 px-3.5 py-3"
              >
                <p className="text-sm font-medium text-[var(--ink)]">{uc.label}</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">{uc.hint}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Also free file tools
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Private in your browser — complementary to Links
          </p>
          <div className="mt-3 space-y-2">
            {fileUseCases.map((uc) => (
              <Link
                key={uc.id}
                href={uc.href}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-core)] border border-[var(--stroke)] bg-white/50 px-3.5 py-3"
              >
                <span>
                  <span className="block text-sm font-medium text-[var(--ink)]">
                    {uc.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--muted)]">
                    {uc.hint}
                  </span>
                </span>
                <ArrowRight size={14} color="var(--muted)" />
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-10 space-y-3">
          <HomeSearch id="home-tool-search" />
          <HomeCategoryChips />
        </div>
        <HomePopularStrip tools={popular} />
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden max-w-6xl px-4 pb-8 pt-10 md:block md:pt-14">
        <section className="reveal mx-auto max-w-3xl text-center">
          <p className="font-display text-5xl font-semibold tracking-tight text-[var(--ink)] md:text-6xl md:leading-[0.95]">
            Deskzy
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl md:leading-[1.1]">
            Short links on deskzy.xyz — free, private tools
          </h1>
          <p className="mx-auto mt-4 max-w-[42ch] text-lg leading-relaxed text-[var(--muted)]">
            Paste a URL. Get a clean short link. PDF and image tools stay in
            your browser.
          </p>
        </section>

        <section className="reveal reveal-delay-1 mx-auto mt-8 max-w-2xl">
          <HomeShortenDock size="hero" />
        </section>

        <ul className="reveal reveal-delay-1 mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUST.map((t) => {
            const Icon = t.icon;
            return (
              <li key={t.label} className="flex items-center gap-2 text-sm">
                <span className="shrink-0 text-[var(--accent)]">
                  <Icon size={18} weight="duotone" />
                </span>
                <span>
                  <span className="font-medium text-[var(--ink)]">{t.label}</span>
                  <span className="text-[var(--muted)]"> · {t.detail}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <section className="mt-20 reveal reveal-delay-2 md:mt-24">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Share stack
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Pair your short link with QR, campaigns, WhatsApp, or a bio page
              </p>
            </div>
            <Link
              href="/links"
              className="hidden text-sm font-medium text-[var(--accent)] sm:inline-flex sm:items-center sm:gap-1"
            >
              All Links tools
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SHARE_STACK.map((item) => {
              const tool = getTool(item.slug);
              const Icon = item.icon;
              return (
                <Link
                  key={item.slug}
                  href={`/tools/${item.slug}`}
                  className="group rounded-[var(--radius-core)] border border-[var(--stroke)] bg-white/50 px-4 py-4 transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]/50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon size={18} weight="duotone" />
                  </span>
                  <p className="mt-3 font-medium text-[var(--ink)]">
                    {tool?.name ?? item.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                    {item.hint}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
                    Open
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      <ArrowRight size={12} />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16 reveal reveal-delay-2 md:mt-20">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Also free file tools
              </h2>
              <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
                Compress PDFs and images privately in your browser — complementary
                tools when you need them
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FILE_COMPLEMENT.map((slug) => {
              const tool = getTool(slug);
              if (!tool) return null;
              return (
                <Link
                  key={slug}
                  href={`/tools/${slug}`}
                  className="group rounded-[var(--radius-core)] border border-[var(--stroke)] bg-white/50 px-4 py-4 transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]/50"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {tool.category}
                  </p>
                  <p className="mt-2 font-medium text-[var(--ink)]">{tool.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                    {tool.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
                    Open
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      <ArrowRight size={12} />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16 reveal reveal-delay-3 md:mt-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Browse by category
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            Links first — then PDF, image, media, and developer utilities. Most
            file tools run privately in your browser.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {HOME_CATEGORIES.map((c) => {
              const Icon = CAT_ICON[c.id];
              const isLinks = c.id === "links";
              return (
                <Link
                  key={c.id}
                  href={`/${c.id}`}
                  className={`group shell ${isLinks ? "ring-1 ring-[var(--accent)]/25 md:col-span-2" : ""}`}
                >
                  <div className="shell-core flex items-start gap-4 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Icon size={22} weight="duotone" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-display text-lg font-semibold tracking-tight">
                          {isLinks ? "Links — shortener & share tools" : c.name}
                        </span>
                        <span className="text-[var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]">
                          <ArrowRight size={16} />
                        </span>
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-[var(--muted)]">
                        {isLinks
                          ? "URL shortener on deskzy.xyz, QR, UTM, WhatsApp, and bio pages."
                          : c.description}
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

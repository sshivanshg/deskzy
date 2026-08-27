import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  FilePdf,
  Image as ImageIcon,
  LinkSimple,
  LockSimple,
  MusicNotes,
  QrCode,
  Robot,
  ShieldCheck,
  TextT,
} from "@phosphor-icons/react/dist/ssr";
import { HomeCategoryChips } from "@/components/HomeCategoryChips";
import { HomeGlobeTease } from "@/components/HomeGlobeTease";
import { HomePopularStrip } from "@/components/HomePopularStrip";
import { HomeSearch } from "@/components/HomeSearch";
import { HomeShortenDock } from "@/components/HomeShortenDock";
import { JsonLd } from "@/components/JsonLd";
import {
  AdsterraBanner,
  AdsterraMobileBanner,
} from "@/components/Adsterra";
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
  title: `${SITE_NAME} — Built for the agent era`,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  keywords: [
    "tools for AI agents",
    "agent tools API",
    "intent-based tools",
    "share link free",
    "publish links online",
    "jfas.site share",
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
    icon: LinkSimple,
    label: "Own jfas.site links",
    detail: "Free shared links you control",
  },
  {
    icon: LockSimple,
    label: "Files stay local",
    detail: "PDF & images in-browser",
  },
] as const;

const SYSTEM_FLOW = [
  ["01", "Name the outcome", "Start from the job, not a software menu."],
  ["02", "Open the focused action", "Use one purpose-built tool without setup."],
  ["03", "Take the output", "Copy, download, or share and get back to work."],
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

      {/* Mobile — action-first fold: brand, promise, shorten, trust */}
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-5 md:hidden">
        <div className="reveal space-y-5">
          <div className="space-y-2.5">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
              <Robot size={13} weight="duotone" /> AI-native tool system
            </p>
            <h1 className="max-w-[16ch] font-display text-3xl font-semibold leading-[1.05] tracking-tight text-[var(--ink)]">
              Built for the agent era.
            </h1>
            <p className="max-w-[34ch] text-[15px] leading-snug text-[var(--muted)]">
              Use it yourself or hand the action to an agent. Start free in the
              browser, then connect the API when your workflow is ready.
            </p>
          </div>

          <HomeShortenDock size="compact" />

          <ul className="flex flex-wrap gap-x-4 gap-y-2">
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
                  <span className="font-medium text-[var(--ink)]">{t.label}</span>
                </li>
              );
            })}
          </ul>

          <Link
            href="#file-tools"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]"
          >
            Explore the system
            <ArrowRight size={14} />
          </Link>

          <HomeGlobeTease size="compact" />

          <section className="mt-12 border-y border-[var(--stroke)] py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              How the system works
            </p>
            <ol className="mt-4 space-y-4">
              {SYSTEM_FLOW.map(([number, title, detail]) => (
                <li key={number} className="flex gap-3">
                  <span className="font-mono text-xs text-[var(--accent)]">{number}</span>
                  <span>
                    <span className="block text-sm font-medium text-[var(--ink)]">{title}</span>
                    <span className="mt-0.5 block text-xs text-[var(--muted)]">{detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <Link
            href="/developers"
            className="mt-5 flex items-center gap-3 rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
              <Code size={19} weight="bold" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[var(--ink)]">Free API for agents</span>
              <span className="mt-0.5 block text-xs text-[var(--muted)]">1 key · 25 requests every day</span>
            </span>
            <span className="shrink-0 text-[var(--accent)]">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        <section className="mt-14">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Share stack
            </h2>
            <Link
              href="/links"
              className="text-xs font-medium text-[var(--accent)]"
            >
              All links
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-[var(--stroke)] border-y border-[var(--stroke)]">
            {shareUseCases.map((uc) => (
              <li key={uc.id}>
                <Link
                  href={uc.href}
                  className="flex items-center justify-between gap-3 py-3.5"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-[var(--ink)]">
                      {uc.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--muted)]">
                      {uc.hint}
                    </span>
                  </span>
                  <span className="shrink-0 text-[var(--muted)]">
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="file-tools" className="mt-12 scroll-mt-24">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Also free file tools
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Private in your browser
          </p>
          <ul className="mt-3 divide-y divide-[var(--stroke)] border-y border-[var(--stroke)]">
            {fileUseCases.map((uc) => (
              <li key={uc.id}>
                <Link
                  href={uc.href}
                  className="flex items-center justify-between gap-3 py-3.5"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-[var(--ink)]">
                      {uc.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--muted)]">
                      {uc.hint}
                    </span>
                  </span>
                  <span className="shrink-0 text-[var(--muted)]">
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 space-y-3">
          <HomeSearch id="home-tool-search" />
          <HomeCategoryChips />
        </div>
        <HomePopularStrip tools={popular} />
        <div className="mt-8 flex justify-center">
          <AdsterraMobileBanner className="w-full max-w-[320px]" />
        </div>
      </div>

      {/* Desktop — action-first split: shorten left, globe attractor right */}
      <div className="mx-auto hidden max-w-6xl px-4 pb-8 pt-10 md:block md:pt-14">
        <section className="reveal grid min-h-[min(72dvh,40rem)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              <Robot size={15} weight="duotone" /> Deskzy · AI-native tool system
            </p>
            <h1 className="mt-5 max-w-[15ch] font-display text-4xl font-semibold leading-[1.02] tracking-tight text-[var(--ink)] lg:text-5xl">
              Built for the agent era.
            </h1>
            <p className="mt-4 max-w-[38ch] text-lg leading-relaxed text-[var(--muted)]">
              Deskzy turns small, repeatable jobs into focused actions. Use them
              directly in the browser or call them from agents and automations
              through a predictable API.
            </p>

            <div className="reveal reveal-delay-1 mt-8 max-w-xl">
              <HomeShortenDock size="hero" />
            </div>

            <ul className="reveal reveal-delay-1 mt-6 flex flex-wrap gap-x-8 gap-y-3">
              {TRUST.map((t) => {
                const Icon = t.icon;
                return (
                  <li key={t.label} className="flex items-center gap-2 text-sm">
                    <span className="shrink-0 text-[var(--accent)]">
                      <Icon size={18} weight="duotone" />
                    </span>
                    <span>
                      <span className="font-medium text-[var(--ink)]">
                        {t.label}
                      </span>
                      <span className="text-[var(--muted)]"> · {t.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ul>

            <Link
              href="#file-tools-desktop"
              className="reveal reveal-delay-1 mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
            >
              Explore the system
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="reveal reveal-delay-2 flex justify-center lg:justify-end">
            <HomeGlobeTease size="hero" />
          </div>
        </section>

        <section className="mt-12 grid gap-4 border-y border-[var(--stroke)] py-6 md:grid-cols-[0.8fr_2fr] md:items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              The operating model
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">
              Designed around intent, not apps
            </h2>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {SYSTEM_FLOW.map(([number, title, detail]) => (
              <li key={number} className="border-l border-[var(--stroke)] pl-4">
                <span className="font-mono text-xs text-[var(--accent)]">{number}</span>
                <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 grid overflow-hidden rounded-[var(--radius-shell)] border border-[var(--accent)]/25 bg-[var(--accent-soft)]/55 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="p-7 md:p-9">
            <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              <Robot size={15} weight="duotone" /> Agent-ready API
            </p>
            <h2 className="mt-3 max-w-[16ch] font-display text-3xl font-semibold leading-tight tracking-tight">
              Give your agent a dependable action.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
              Create share links from scripts, automations, or agent tool calls.
              Structured JSON in, useful URL out.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/signup?next=%2Faccount%3Ftab%3Dapi" className="btn-primary">
                Get a free API key
              </Link>
              <Link href="/developers" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">
                View developer docs <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">25 requests/day · no card required</p>
          </div>
          <div className="border-t border-[var(--stroke)] bg-[var(--ink)] p-6 text-[#eceae4] lg:border-l lg:border-t-0 md:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#a8b3aa]">POST /api/links</span>
              <span className="rounded-full border border-[#455047] px-2 py-1 font-mono text-[9px] text-[#a8dccb]">201 CREATED</span>
            </div>
            <pre className="mt-5 overflow-x-auto font-mono text-xs leading-6 text-[#d8ded9]">{`{
  "url": "https://example.com/report"
}

→ {
  "kind": "single",
  "shortUrl": "https://jfas.site/p/v4Yk9mP2Qa7L"
}`}</pre>
          </div>
        </section>

        <section className="mt-20 reveal reveal-delay-2 md:mt-24">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Share system
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Compose a complete outcome from small, focused actions
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
                  className="group rounded-[var(--radius-core)] border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 py-4 transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]/50"
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

        <section
          id="file-tools-desktop"
          className="mt-16 scroll-mt-28 reveal reveal-delay-2 md:mt-20"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                File actions
              </h2>
              <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
                Focused utilities for the moments when a file needs a precise next step
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
                  className="group rounded-[var(--radius-core)] border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 py-4 transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]/50"
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
            The Deskzy system
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
            Start with an intent, open the focused action, and keep moving. Links,
            files, media, and developer utilities live in one consistent system.
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
                          {isLinks ? "Links — publish & share" : c.name}
                        </span>
                        <span className="text-[var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]">
                          <ArrowRight size={16} />
                        </span>
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-[var(--muted)]">
                        {isLinks
                          ? "Publish links on jfas.site, QR, UTM, WhatsApp, and bio pages."
                          : c.description}
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="mt-14 reveal reveal-delay-3 md:mt-16">
          <AdsterraBanner size="728x90" />
        </div>
      </div>
    </>
  );
}

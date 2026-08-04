import Link from "next/link";
import {
  Buildings,
  ChartLine,
  Code,
  FilePdf,
  GlobeHemisphereWest,
  Key,
  LinkSimple,
  LockSimple,
  UsersThree,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";
import { CONTACT_X_HANDLE, CONTACT_X_URL } from "@/lib/seo/site";

const PILLARS = [
  {
    icon: FilePdf,
    title: "One toolkit for files",
    body: "Merge, split, compress, and convert PDFs and images in the browser. No upload wall for tools marked private.",
  },
  {
    icon: LinkSimple,
    title: "Own short links on deskzy.xyz",
    body: "Unlimited short links, custom Pro slugs, and click analytics so campaigns and share-outs are measurable.",
  },
  {
    icon: Code,
    title: "API for pipelines",
    body: "Pro and Business members create API keys in Account and automate short-link creation from scripts.",
  },
] as const;

const CAPABILITIES = [
  {
    icon: LockSimple,
    title: "Browser-first privacy",
    body: "PDF and image tools process locally with Web APIs and WASM. Files stay on the device whenever we say they do.",
  },
  {
    icon: UsersThree,
    title: "Team seats",
    body: "Invite teammates to Pro (up to 25). Business is for larger orgs that need contracts, SSO, and custom limits.",
  },
  {
    icon: ChartLine,
    title: "Link analytics",
    body: "See daily clicks, referrers, and owned-link performance — built for founders, creators, and growth teams.",
  },
  {
    icon: Key,
    title: "Short-link API",
    body: "Bearer keys for POST /api/links. Bypass public IP rate limits and attach creates to the owning account.",
  },
  {
    icon: GlobeHemisphereWest,
    title: "Honest hybrid tools",
    body: "When something touches our servers (like the shortener), we label it. No dark patterns or fake download buttons.",
  },
  {
    icon: Buildings,
    title: "Business on request",
    body: "Custom contracts, SSO, invoicing, and higher API rate limits for 25+ seats. Talk to us to tailor a plan.",
  },
] as const;

const SECTORS = [
  {
    name: "Sales & marketing",
    body: "Ship campaign short links with custom slugs, track clicks, and keep creative PDFs private in-browser.",
  },
  {
    name: "People & ops",
    body: "Compress and merge offer letters or policy packs without uploading sensitive HR files to a random cloud.",
  },
  {
    name: "Legal & finance",
    body: "Split and reorganize PDFs locally. Share only what you mean to share — URL strings for links, not whole files.",
  },
  {
    name: "Product & engineering",
    body: "Automate deskzy.xyz short links from CI or internal tools with Pro API keys.",
  },
] as const;

export function BusinessLanding() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {/* Hero — one composition */}
      <header className="relative overflow-hidden rounded-[var(--radius-shell)] border border-[var(--stroke)] bg-[var(--panel)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 85% 10%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 55%), linear-gradient(160deg, var(--bg-elevated), var(--panel))",
          }}
          aria-hidden
        />
        <div className="relative grid gap-10 px-6 py-12 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-16 lg:px-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Deskzy Business
            </p>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl md:leading-[1.05]">
              Private file tools and measurable short links for teams
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--muted)] md:text-lg">
              Browser-first PDF and image workflows, deskzy.xyz short links with
              analytics, and an API for automation — without pretending we are a
              desktop suite or an e-sign platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CONTACT_X_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !rounded-full"
              >
                <XLogo size={16} weight="bold" />
                Contact sales
              </a>
              <Link href="/pricing" className="btn-secondary !rounded-full">
                Compare Free, Pro & Business
              </Link>
            </div>
          </div>

          <aside className="flex flex-col justify-end gap-3 self-stretch">
            {[
              "Files stay local for marked tools",
              "Pro: seats, analytics, API keys",
              "Business: SSO, contracts, higher limits",
            ].map((line) => (
              <div
                key={line}
                className="rounded-2xl border border-[var(--stroke)] bg-[var(--panel-soft)] px-4 py-3 text-sm font-medium text-[var(--ink)] backdrop-blur-sm"
              >
                {line}
              </div>
            ))}
          </aside>
        </div>
      </header>

      {/* One platform */}
      <section className="mt-20 md:mt-28" aria-labelledby="platform-heading">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Platform
        </p>
        <h2
          id="platform-heading"
          className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl"
        >
          One calm surface for documents and links
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
          iLovePDF-style breadth for PDF work, plus Deskzy&apos;s own short-link
          and privacy angle — without fake enterprise logos or invented stats.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="shell h-full">
              <div className="shell-core flex h-full flex-col p-5 md:p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon size={22} weight="duotone" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="mt-20 md:mt-28" aria-labelledby="cap-heading">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Capabilities
        </p>
        <h2
          id="cap-heading"
          className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl"
        >
          What teams actually get
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-shell)] border border-[var(--stroke)] bg-[var(--stroke)] sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-[var(--panel)] p-5 md:p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--accent)]">
                <Icon size={20} weight="duotone" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors */}
      <section className="mt-20 md:mt-28" aria-labelledby="sectors-heading">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Use cases
        </p>
        <h2
          id="sectors-heading"
          className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Built for how work actually moves
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {SECTORS.map((s) => (
            <article key={s.name} className="shell">
              <div className="shell-core p-5 md:p-6">
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {s.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="mt-20 md:mt-28" aria-labelledby="security-heading">
        <div className="shell overflow-hidden">
          <div className="shell-core grid gap-8 p-6 md:grid-cols-[1fr_1.1fr] md:p-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Security
              </p>
              <h2
                id="security-heading"
                className="mt-3 font-display text-3xl font-semibold tracking-tight"
              >
                Stay secure without theater
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                We don&apos;t claim HIPAA badges we haven&apos;t earned. We do
                make privacy defaults obvious and hybrid tools explicit.
              </p>
              <Link
                href="/privacy"
                className="mt-6 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
              >
                Read the Privacy Policy
              </Link>
            </div>
            <ul className="space-y-4">
              {[
                {
                  t: "Local processing",
                  d: "Marked tools never upload your PDF or image bytes to Deskzy servers.",
                },
                {
                  t: "Minimal shortener data",
                  d: "Only destination URL strings (and optional click metadata for owned links) hit our edge.",
                },
                {
                  t: "Account controls",
                  d: "Auth via Supabase; Pro seats and API keys are scoped to your membership.",
                },
              ].map((item) => (
                <li key={item.t} className="border-t border-[var(--stroke)] pt-4 first:border-t-0 first:pt-0">
                  <p className="font-medium text-[var(--ink)]">{item.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                    {item.d}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="contact"
        className="mt-20 scroll-mt-24 md:mt-28"
        aria-labelledby="cta-heading"
      >
        <div className="rounded-[var(--radius-shell)] border border-[var(--ink)] bg-[var(--ink)] px-6 py-12 text-[var(--bg)] md:px-12 md:py-14">
          <h2
            id="cta-heading"
            className="max-w-xl font-display text-3xl font-semibold tracking-tight text-[var(--bg)] md:text-4xl"
          >
            Start with Deskzy today
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--bg)]/75">
            Self-serve Pro for most teams. Business for 25+ seats, SSO, and
            custom contracts — message us on X and we&apos;ll shape the rollout.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={CONTACT_X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              <XLogo size={16} weight="bold" />
              @{CONTACT_X_HANDLE}
            </a>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--bg)]/30 bg-[var(--bg)]/10 px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition-colors hover:bg-[var(--bg)]/15"
            >
              View pricing
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--bg)]/30 bg-[var(--bg)]/10 px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition-colors hover:bg-[var(--bg)]/15"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

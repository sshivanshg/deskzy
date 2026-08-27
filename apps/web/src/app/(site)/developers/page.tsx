import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Code,
  Key,
  Robot,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Developers — Free API for agents and automations",
  description:
    "Add Deskzy link actions to agents, scripts, and automations. Create one free API key and make up to 25 requests per day.",
  path: "/developers",
  keywords: [
    "free link shortener API",
    "API for AI agents",
    "agent tools API",
    "automation link API",
  ],
});

const requestExample = `curl -X POST https://deskzy.xyz/api/links \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/report"}'`;

const responseExample = `{
  "code": "v4Yk9mP2Qa7L",
  "kind": "single",
  "dest": "https://example.com/report",
  "shortUrl": "https://jfas.site/p/v4Yk9mP2Qa7L",
  "isCustom": false
}`;

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            <Robot size={15} weight="duotone" /> Built for the agent era
          </p>
          <h1 className="mt-4 max-w-[14ch] font-display text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
            Give your agent a useful action.
          </h1>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Deskzy turns small, repeatable jobs into dependable API calls. Start
            with link creation today—structured input, predictable JSON, and a
            clean URL your workflow can hand to a human.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/signup?next=%2Faccount%3Ftab%3Dapi" className="btn-primary">
              <Key size={17} weight="bold" /> Get a free API key
            </Link>
            <a href="#quickstart" className="btn-secondary">
              Read the quickstart <ArrowRight size={15} weight="bold" />
            </a>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            No card required · 25 requests/day · upgrade only when you need scale
          </p>
        </div>

        <div className="shell overflow-hidden">
          <div className="shell-core overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--stroke)] px-4 py-3">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink)]">
                <Code size={15} weight="bold" /> Agent action
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ok-bg)] px-2.5 py-1 text-[10px] font-semibold text-[var(--ok-ink)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ok-ink)] motion-safe:animate-pulse" />
                API online
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-6 text-[var(--ink)] md:p-6">
              {requestExample}
            </pre>
            <div className="border-t border-[var(--stroke)] bg-[var(--accent-soft)]/35 p-5 md:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                Structured response
              </p>
              <pre className="mt-3 overflow-x-auto font-mono text-xs leading-6 text-[var(--accent-ink)]">
                {responseExample}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 border-y border-[var(--stroke)] py-8 md:mt-28 md:grid md:grid-cols-[0.7fr_1.3fr] md:gap-12">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Why agents can rely on it
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Small surface. Clear contract.
          </h2>
        </div>
        <ul className="mt-6 divide-y divide-[var(--stroke)] md:mt-0">
          {[
            ["Bearer-key authentication", "Works from any runtime, framework, or automation platform."],
            ["Predictable JSON", "Success and limit responses are machine-readable and easy to branch on."],
            ["Visible rate limits", "Free responses include remaining-request headers for responsible retries."],
            ["Human-ready output", "Every call returns a share URL that works outside the agent loop."],
          ].map(([title, detail]) => (
            <li key={title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
              <span className="mt-0.5 shrink-0 text-[var(--accent)]">
                <CheckCircle size={18} weight="fill" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[var(--ink)]">{title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-[var(--muted)]">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="quickstart" className="mt-20 scroll-mt-28 md:mt-28">
        <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Quickstart
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              First call in three steps
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              The free tier is intentionally useful for prototypes, personal
              agents, demos, and low-volume automations.
            </p>
          </div>
          <ol className="divide-y divide-[var(--stroke)] border-y border-[var(--stroke)]">
            {[
              ["01", "Create an account", "Sign up free so requests can be owned and limited per user."],
              ["02", "Generate your key", "Open Account → API. Copy the secret when it appears; it is shown once."],
              ["03", "Call POST /api/links", "Send a url, an array of urls, or an optional custom slug on Pro."],
            ].map(([number, title, detail]) => (
              <li key={number} className="grid gap-2 py-5 sm:grid-cols-[3rem_1fr]">
                <span className="font-mono text-xs text-[var(--accent)]">{number}</span>
                <span>
                  <span className="block font-semibold text-[var(--ink)]">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-[var(--muted)]">{detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-20 grid gap-6 rounded-[var(--radius-shell)] border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-6 md:mt-28 md:grid-cols-[1fr_auto] md:items-center md:p-9">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <ShieldCheck size={20} weight="duotone" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">Free developer access</span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">
            Build the workflow before you buy the scale.
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            One key and 25 daily calls are included. Pro adds unlimited requests and up to five keys.
          </p>
        </div>
        <Link href="/signup?next=%2Faccount%3Ftab%3Dapi" className="btn-primary shrink-0">
          Start building <ArrowRight size={16} weight="bold" />
        </Link>
      </section>
    </div>
  );
}

import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools/registry";
import { getRelatedTools } from "@/lib/tools/registry";
import { getToolSeoContent } from "@/lib/seo/tool-content";

export function ToolSeoBody({ tool }: { tool: ToolDefinition }) {
  const content = getToolSeoContent(tool);
  const related = getRelatedTools(tool.slug);

  return (
    <article className="mx-auto max-w-6xl px-4 pb-16 lg:pl-[calc(220px+2rem)]">
      <div className="max-w-3xl space-y-10 border-t border-[var(--stroke)] pt-10">
        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
            About this tool
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            {content.intro}
          </p>
          {tool.aliases.length > 0 && (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Also searched as:{" "}
              <span className="text-[var(--ink)]">
                {tool.aliases.join(" · ")}
              </span>
            </p>
          )}
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
            How it works
          </h2>
          <ol className="mt-4 space-y-3">
            {content.steps.map((step, i) => (
              <li
                key={step}
                className="flex gap-3 text-sm leading-relaxed text-[var(--muted)]"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
            Privacy
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            {content.privacy}
          </p>
          <Link
            href="/about"
            className="mt-3 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
          >
            Read our full privacy approach
          </Link>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
            Frequently asked questions
          </h2>
          <dl className="mt-4 space-y-4">
            {content.faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-[var(--stroke)] bg-white/40 px-4 py-4"
              >
                <dt className="font-medium text-[var(--ink)]">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {faq.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
              Related tools
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="chip hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/${tool.category}`}
                  className="chip hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  All {tool.category} tools
                </Link>
              </li>
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}

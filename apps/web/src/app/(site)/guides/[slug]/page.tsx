import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { JsonLd } from "@/components/JsonLd";
import { buildGuideJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/site";
import { getAllGuides, getGuide } from "@/lib/seo/guides";
import { getTool } from "@/lib/tools/registry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return buildPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    keywords: guide.keywords,
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const tool = getTool(guide.toolSlug);
  const html = await marked.parse(guide.body, { async: true });
  const related = guide.relatedToolSlugs
    .map((s) => getTool(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <>
      <JsonLd data={buildGuideJsonLd(guide)} />
      <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          <Link href="/guides" className="hover:text-[var(--accent)]">
            Guides
          </Link>
          {tool ? ` · ${tool.name}` : null}
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          {guide.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          {guide.description}
        </p>

        {tool && (
          <p className="mt-6">
            <Link
              href={`/tools/${tool.slug}`}
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Open {tool.name}
            </Link>
          </p>
        )}

        <div
          className="guide-prose mt-10 space-y-4 text-[var(--muted)] [&_a]:font-medium [&_a]:text-[var(--accent)] [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-[var(--ink)] [&_li]:leading-relaxed [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {tool && (
          <div className="mt-12 border-t border-[var(--stroke)] pt-8">
            <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
              Try it now
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Open the free {tool.name.toLowerCase()} tool —{" "}
              {tool.runtime === "hybrid"
                ? "hybrid privacy (only what the tool needs is sent)."
                : "runs in your browser, no signup."}
            </p>
            <Link
              href={`/tools/${tool.slug}`}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Open {tool.name}
            </Link>
          </div>
        )}

        <section className="mt-12 border-t border-[var(--stroke)] pt-8">
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
            Frequently asked questions
          </h2>
          <dl className="mt-4 space-y-4">
            {guide.faqs.map((faq) => (
              <div key={faq.q}>
                <dt className="font-medium text-[var(--ink)]">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {faq.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {related.length > 0 && (
          <section className="mt-12 border-t border-[var(--stroke)] pt-8">
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
                  href="/guides"
                  className="chip hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  All guides
                </Link>
              </li>
            </ul>
          </section>
        )}
      </article>
    </>
  );
}

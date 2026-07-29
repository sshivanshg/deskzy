import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { JsonLd } from "@/components/JsonLd";
import { buildCategoryJsonLd } from "@/lib/seo/json-ld";
import { CATEGORY_SEO } from "@/lib/seo/category-content";
import { buildPageMetadata } from "@/lib/seo/site";
import {
  CATEGORIES,
  ROUTE_SHORTCUTS,
  getToolsByCategory,
  type ToolCategory,
} from "@/lib/tools/registry";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) return {};
  const seo = CATEGORY_SEO[cat.id];
  return buildPageMetadata({
    title: seo.seoTitle,
    description: seo.seoDescription,
    path: `/${cat.id}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (
    [
      "tools",
      "about",
      "guides",
      "privacy",
      "terms",
      "deskzy-api",
      "api",
      "_next",
    ].includes(category) ||
    category in ROUTE_SHORTCUTS
  ) {
    notFound();
  }
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) notFound();
  const tools = getToolsByCategory(category as ToolCategory);
  const seo = CATEGORY_SEO[cat.id];

  return (
    <>
      <JsonLd
        data={buildCategoryJsonLd(
          cat.name,
          seo.seoDescription,
          `/${cat.id}`,
          seo.faqs,
        )}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Category
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          {cat.name} tools — free &amp; private
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)] leading-relaxed">
          {cat.description}
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
          {seo.intro}
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {tools.map((t, i) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className={`group shell ${i === 0 ? "sm:col-span-2" : ""}`}
            >
              <div className="shell-core flex h-full items-start justify-between gap-4 p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                <div>
                  <p className="font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
                    {t.name}
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                    {t.description}
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                    {t.runtime === "browser" ? "Free · Private" : "Hybrid"}
                  </p>
                </div>
                <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition-colors group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)]">
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            FAQ
          </h2>
          <dl className="mt-4 space-y-4">
            {seo.faqs.map((faq) => (
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
      </div>
    </>
  );
}

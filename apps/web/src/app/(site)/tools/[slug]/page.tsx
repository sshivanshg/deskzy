import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ToolSeoBody } from "@/components/ToolSeoBody";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { buildToolJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/site";
import { getTool, TOOLS } from "@/lib/tools/registry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  const title =
    tool.slug === "url-shortener"
      ? "Share a link free — publish on jfas.site"
      : `${tool.seoTitle} — private, no upload`;

  return buildPageMetadata({
    title,
    description: tool.seoDescription,
    path: `/tools/${tool.slug}`,
    keywords: [tool.name, ...tool.aliases, "free", "online", "no signup"],
  });
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const h1 =
    tool.slug === "url-shortener"
      ? "Share a link free — publish on jfas.site"
      : tool.seoTitle;

  return (
    <>
      <JsonLd data={buildToolJsonLd(tool)} />
      {/* Server-rendered H1 outside Suspense so crawlers see it without waiting on client JS */}
      <h1 className="sr-only">{h1}</h1>
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-[var(--muted)]">
            Loading tool…
          </div>
        }
      >
        <ToolWorkspace tool={tool} />
      </Suspense>
      <ToolSeoBody tool={tool} />
    </>
  );
}

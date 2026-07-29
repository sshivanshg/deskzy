import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/site";
import { getAllGuides } from "@/lib/seo/guides";
import { getTool } from "@/lib/tools/registry";

export const metadata: Metadata = buildPageMetadata({
  title: "Guides — how to use Deskzy tools",
  description:
    "Practical how-to guides for Deskzy: compress PDFs for email, merge without uploading, shorten links, QR codes, WhatsApp, and UTM campaigns.",
  path: "/guides",
  keywords: [
    "deskzy guides",
    "how to compress pdf",
    "free url shortener guide",
    "private pdf tools",
  ],
});

export default function GuidesIndexPage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        Learn
      </p>
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        Guides
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
        Short how-tos that answer real search questions — then open the matching
        Deskzy tool. Privacy-first, no signup wall.
      </p>

      <ul className="mt-10 space-y-4">
        {guides.map((guide) => {
          const tool = getTool(guide.toolSlug);
          return (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="group block border-b border-[var(--stroke)] pb-4 transition-colors hover:border-[var(--accent)]"
              >
                <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--ink)] group-hover:text-[var(--accent)]">
                  {guide.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {guide.description}
                </p>
                {tool && (
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                    Tool · {tool.name}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { absoluteUrl } from "@/lib/seo/site";
import { getAllGuides } from "@/lib/seo/guides";
import { CATEGORIES, TOOLS } from "@/lib/tools/registry";

export const dynamic = "force-static";

type SitemapEntry = {
  loc: string;
  lastmod: string;
  changefreq: "weekly" | "monthly";
  priority: string;
};

const LASTMOD = "2026-07-29";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function sitemapEntry(entry: SitemapEntry): string {
  return [
    "  <url>",
    `    <loc>${escapeXml(entry.loc)}</loc>`,
    `    <lastmod>${entry.lastmod}</lastmod>`,
    `    <changefreq>${entry.changefreq}</changefreq>`,
    `    <priority>${entry.priority}</priority>`,
    "  </url>",
  ].join("\n");
}

function buildSitemap(): string {
  const entries: SitemapEntry[] = [
    {
      loc: absoluteUrl("/"),
      lastmod: LASTMOD,
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      loc: absoluteUrl("/guides"),
      lastmod: LASTMOD,
      changefreq: "weekly",
      priority: "0.85",
    },
    {
      loc: absoluteUrl("/pricing"),
      lastmod: LASTMOD,
      changefreq: "weekly",
      priority: "0.9",
    },
    {
      loc: absoluteUrl("/business"),
      lastmod: LASTMOD,
      changefreq: "weekly",
      priority: "0.85",
    },
    {
      loc: absoluteUrl("/link-analytics"),
      lastmod: LASTMOD,
      changefreq: "weekly",
      priority: "0.85",
    },
    {
      loc: absoluteUrl("/about"),
      lastmod: LASTMOD,
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      loc: absoluteUrl("/privacy"),
      lastmod: LASTMOD,
      changefreq: "monthly",
      priority: "0.4",
    },
    {
      loc: absoluteUrl("/terms"),
      lastmod: LASTMOD,
      changefreq: "monthly",
      priority: "0.4",
    },
    ...CATEGORIES.map((category): SitemapEntry => ({
      loc: absoluteUrl(`/${category.id}`),
      lastmod: LASTMOD,
      changefreq: "weekly",
      priority: "0.85",
    })),
    ...TOOLS.map((tool): SitemapEntry => ({
      loc: absoluteUrl(`/tools/${tool.slug}`),
      lastmod: LASTMOD,
      changefreq: "weekly",
      priority:
        tool.slug === "url-shortener" ? "0.95" : tool.popular ? "0.9" : "0.75",
    })),
    ...getAllGuides().map((guide): SitemapEntry => ({
      loc: absoluteUrl(`/guides/${guide.slug}`),
      lastmod: guide.updatedAt ?? guide.publishedAt,
      changefreq: "monthly",
      priority: "0.8",
    })),
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries.map(sitemapEntry).join("\n"),
    "</urlset>",
    "",
  ].join("\n");
}

export function GET(): Response {
  return new Response(buildSitemap(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}

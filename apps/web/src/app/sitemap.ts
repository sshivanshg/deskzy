import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";
import { getAllGuides } from "@/lib/seo/guides";
import { CATEGORIES, TOOLS } from "@/lib/tools/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastMod = new Date("2026-07-29");

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: lastMod, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/guides`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/business`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/link-analytics`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const categories: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/${c.id}`,
    lastModified: lastMod,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const tools: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}`,
    lastModified: lastMod,
    changeFrequency: "weekly",
    priority: t.popular ? 0.9 : 0.75,
  }));

  // Bump shortener slightly above other popular tools
  for (const entry of tools) {
    if (entry.url.endsWith("/tools/url-shortener")) {
      entry.priority = 0.95;
    }
  }

  const guides: MetadataRoute.Sitemap = getAllGuides().map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: new Date(g.updatedAt ?? g.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...categories, ...tools, ...guides];
}

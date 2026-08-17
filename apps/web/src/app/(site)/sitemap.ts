import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site";
import { getAllGuides } from "@/lib/seo/guides";
import { CATEGORIES, TOOLS } from "@/lib/tools/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastMod = "2026-07-29";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/guides"),
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/pricing"),
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/business"),
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/link-analytics"),
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const categories: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: absoluteUrl(`/${c.id}`),
    lastModified: lastMod,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const tools: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: absoluteUrl(`/tools/${t.slug}`),
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
    url: absoluteUrl(`/guides/${g.slug}`),
    lastModified: g.updatedAt ?? g.publishedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...categories, ...tools, ...guides];
}

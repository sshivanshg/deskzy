import type { ToolDefinition } from "@/lib/tools/registry";
import { getToolSeoContent } from "@/lib/seo/tool-content";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo/site";

export function buildToolJsonLd(tool: ToolDefinition) {
  const content = getToolSeoContent(tool);
  const url = absoluteUrl(`/tools/${tool.slug}`);

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: tool.seoDescription,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    featureList: tool.aliases.join(", "),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return [software, faq];
}

export function buildCategoryJsonLd(
  categoryName: string,
  description: string,
  path: string,
  faqs: { q: string; a: string }[],
) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${categoryName} tools`,
      description,
      url: absoluteUrl(path),
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ];
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Free private file tools — PDF, image, text, and URL shortener in one place.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

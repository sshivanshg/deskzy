import type { ToolDefinition } from "@/lib/tools/registry";
import type { Guide } from "@/lib/seo/guides";
import { getToolSeoContent } from "@/lib/seo/tool-content";
import {
  absoluteUrl,
  CONTACT_X_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/site";

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

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
    sameAs: [CONTACT_X_URL],
    description:
      "Private browser file tools for PDF, image, text, and links — free to use with no signup wall.",
  };
}

export function buildWebPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildPricingJsonLd() {
  return [
    buildOrganizationJsonLd(),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Deskzy Pricing",
      description:
        "Deskzy pricing for Free, Pro, and Business plans — private browser file tools with Razorpay checkout.",
      url: absoluteUrl("/pricing"),
      mainEntity: {
        "@type": "Product",
        name: "Deskzy Pro",
        description:
          "Higher daily limits for private PDF, image, and text tools plus team seats on Business.",
        brand: {
          "@type": "Brand",
          name: SITE_NAME,
        },
        offers: [
          {
            "@type": "Offer",
            name: "Free",
            price: "0",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: absoluteUrl("/pricing"),
          },
          {
            "@type": "Offer",
            name: "Pro (yearly)",
            price: "2699",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: absoluteUrl("/pricing"),
          },
        ],
      },
    },
  ];
}

export function buildWebsiteJsonLd() {
  return [
    buildOrganizationJsonLd(),
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Free URL shortener on deskzy.xyz — plus private PDF and image tools in your browser.",
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export function buildGuideJsonLd(guide: Guide) {
  const url = absoluteUrl(`/guides/${guide.slug}`);
  const toolUrl = absoluteUrl(`/tools/${guide.toolSlug}`);

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt ?? guide.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: url,
    url,
    keywords: guide.keywords.join(", "),
    about: {
      "@type": "SoftwareApplication",
      name: guide.toolSlug,
      url: toolUrl,
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return [article, faq];
}

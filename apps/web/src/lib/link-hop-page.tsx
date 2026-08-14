import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkHop } from "@/components/LinkHop";
import { LinkListHop } from "@/components/LinkListHop";
import { fetchDestOpenGraph } from "@/lib/dest-og";
import type { LinkPathPrefix } from "@/lib/link-path";
import { SHARE_HOST, SHARE_ORIGIN } from "@/lib/link-path";
import { getLink, isListLink } from "@/lib/links-store";

type Props = { params: Promise<{ code: string }> };

function splitDest(dest: string): { host: string; rest: string } {
  try {
    const u = new URL(dest);
    const rest = `${u.pathname === "/" ? "" : u.pathname}${u.search}${u.hash}`;
    return { host: u.host, rest: rest || "/" };
  } catch {
    return { host: dest, rest: "" };
  }
}

/**
 * Social unfurl strategy for published pages:
 * 1. Prefer the *destination* Open Graph card.
 * 2. If dest has no usable preview, emit minimal meta — never Deskzy branding.
 * List links skip dest OG scrape and use a simple "N links" card.
 */
export function createHopGenerateMetadata(pathPrefix: LinkPathPrefix) {
  return async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { code } = await params;
    const link = await getLink(code);
    if (!link) {
      return {
        title: { absolute: "Not found" },
        robots: { index: false, follow: false },
      };
    }

    const url = `${SHARE_ORIGIN.replace(/\/$/, "")}${pathPrefix}/${link.code}`;

    if (isListLink(link)) {
      const n = link.urls.length;
      const title = `${n} links`;
      const description = `Published content with ${n} links`;
      return {
        title: { absolute: title },
        description,
        applicationName: SHARE_HOST,
        robots: { index: false, follow: false },
        alternates: { canonical: url },
        openGraph: {
          title,
          description,
          url,
          siteName: SHARE_HOST,
          type: "article",
          images: [],
        },
        twitter: {
          card: "summary",
          title,
          description,
          images: [],
        },
      };
    }

    const { host } = splitDest(link.dest);
    const destOg = await fetchDestOpenGraph(link.dest);

    if (destOg && (destOg.title || destOg.description || destOg.image)) {
      const title = destOg.title || host;
      const description =
        destOg.description || `Published content · ${host}`;
      const imageUrl = destOg.image;

      return {
        title: { absolute: title },
        description,
        applicationName: SHARE_HOST,
        robots: { index: false, follow: false },
        alternates: { canonical: url },
        openGraph: {
          title,
          description,
          url,
          siteName: destOg.siteName || SHARE_HOST,
          type: "article",
          images: imageUrl ? [{ url: imageUrl, alt: title }] : [],
        },
        twitter: imageUrl
          ? {
              card: "summary_large_image",
              title,
              description,
              images: [imageUrl],
            }
          : {
              card: "summary",
              title,
              description,
              images: [],
            },
      };
    }

    // No destination preview — keep unfurl minimal (no product branding).
    return {
      title: { absolute: "Shared content" },
      description: host,
      applicationName: SHARE_HOST,
      robots: { index: false, follow: false },
      alternates: { canonical: url },
      openGraph: {
        title: "Shared content",
        description: host,
        url,
        siteName: SHARE_HOST,
        type: "article",
        images: [],
      },
      twitter: {
        card: "summary",
        title: "Shared content",
        description: host,
        images: [],
      },
    };
  };
}

export function createHopPage() {
  return async function PublishedPage({ params }: Props) {
    const { code } = await params;
    // Read-only: no hit counter write — saves KV write quota on every open.
    const link = await getLink(code);
    if (!link) notFound();

    if (isListLink(link)) {
      return <LinkListHop urls={link.urls} code={link.code} />;
    }

    return <LinkHop dest={link.dest} code={link.code} />;
  };
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkHop } from "@/components/LinkHop";
import { LinkListHop } from "@/components/LinkListHop";
import { fetchDestOpenGraph } from "@/lib/dest-og";
import { getLink, isListLink } from "@/lib/links-store";
import { absoluteUrl, SITE_NAME } from "@/lib/seo/site";

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
 * Social unfurl strategy for plain short links:
 * 1. Prefer the *destination* Open Graph card (what sharers expect).
 * 2. If dest has no usable preview, emit minimal meta (host only) and no image —
 *    never fall back to the Deskzy homepage OG card.
 * List links skip dest OG scrape and use a simple "N links" card.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const link = await getLink(code);
  if (!link) {
    return {
      title: "Link not found",
      robots: { index: false, follow: false },
    };
  }

  const url = absoluteUrl(`/r/${link.code}`);

  if (isListLink(link)) {
    const n = link.urls.length;
    const title = `${n} links · ${SITE_NAME}`;
    const description = `${n} links shared via ${SITE_NAME}`;
    return {
      title,
      description,
      robots: { index: false, follow: false },
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName: SITE_NAME,
        type: "website",
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
      destOg.description || `Shared via ${SITE_NAME} · ${host}`;
    const imageUrl = destOg.image;

    return {
      title,
      description,
      robots: { index: false, follow: false },
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName: destOg.siteName || SITE_NAME,
        type: "website",
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

  // No destination preview — keep unfurl minimal (no Deskzy marketing image).
  return {
    title: host,
    description: host,
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      title: host,
      description: host,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [],
    },
    twitter: {
      card: "summary",
      title: host,
      description: host,
      images: [],
    },
  };
}

export default async function ShortLinkHopPage({ params }: Props) {
  const { code } = await params;
  // Read-only: no hit counter write — saves KV write quota on every open.
  const link = await getLink(code);
  if (!link) notFound();

  if (isListLink(link)) {
    return <LinkListHop urls={link.urls} code={link.code} />;
  }

  return <LinkHop dest={link.dest} code={link.code} />;
}

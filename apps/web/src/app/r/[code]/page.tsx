import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkHop } from "@/components/LinkHop";
import { hitLink } from "@/lib/links-store";

type Props = { params: Promise<{ code: string }> };

export const metadata: Metadata = {
  title: "Open link",
  robots: { index: false, follow: false },
};

export default async function ShortLinkHopPage({ params }: Props) {
  const { code } = await params;
  const link = await hitLink(code);
  if (!link) notFound();

  return <LinkHop dest={link.dest} code={link.code} />;
}

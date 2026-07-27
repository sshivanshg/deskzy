import { NextRequest, NextResponse } from "next/server";
import { hitLink } from "@/lib/links-store";

type Props = { params: Promise<{ code: string }> };

export async function GET(_req: NextRequest, { params }: Props) {
  const { code } = await params;
  const link = hitLink(code);
  if (!link) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.redirect(link.dest, 302);
}

import { NextRequest, NextResponse } from "next/server";
import { bumpLinkHits, isSafeCode } from "@/lib/links-store";
import { recordLinkClick } from "@/lib/pro-links";

type Ctx = { params: Promise<{ code: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { code: raw } = await ctx.params;
  const code = decodeURIComponent(raw);
  if (!isSafeCode(code) && !/^[a-z0-9-]{3,32}$/.test(code)) {
    return NextResponse.json({ error: "invalid code" }, { status: 400 });
  }

  const referrer = req.headers.get("referer");
  const userAgent = req.headers.get("user-agent");

  // Must await on Workers — fire-and-forget is dropped when the isolate exits.
  await bumpLinkHits(code);
  const tracked = await recordLinkClick({ code, referrer, userAgent });

  return NextResponse.json({ ok: true, tracked: tracked.recorded, reason: tracked.reason });
}

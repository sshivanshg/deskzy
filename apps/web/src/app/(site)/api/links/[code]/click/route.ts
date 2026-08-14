import { NextRequest, NextResponse } from "next/server";
import { isSafeCode } from "@/lib/links-store";
import { recordLinkClick } from "@/lib/pro-links";

type Ctx = { params: Promise<{ code: string }> };

/** Extract Cloudflare colo from cf-ray (e.g. a25b7db0183fc0e2-BOM → BOM). */
function coloFromRay(ray: string | null): string | null {
  if (!ray) return null;
  const parts = ray.split("-");
  const last = parts[parts.length - 1]?.trim().toUpperCase();
  return last && /^[A-Z]{3}$/.test(last) ? last : null;
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { code: raw } = await ctx.params;
  const code = decodeURIComponent(raw);
  if (!isSafeCode(code) && !/^[a-z0-9-]{3,32}$/.test(code)) {
    return NextResponse.json({ error: "invalid code" }, { status: 400 });
  }

  const referrer = req.headers.get("referer");
  const userAgent = req.headers.get("user-agent");
  const country =
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-vercel-ip-country") ||
    null;
  const colo =
    coloFromRay(req.headers.get("cf-ray")) ||
    req.headers.get("cf-colo") ||
    null;

  const tracked = await recordLinkClick({
    code,
    referrer,
    userAgent,
    country,
    colo,
  });

  return NextResponse.json({
    ok: true,
    tracked: tracked.recorded,
    reason: tracked.reason,
  });
}

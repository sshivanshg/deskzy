import { NextRequest, NextResponse } from "next/server";
import { freeDailyCap } from "@/lib/entitlements";
import { checkAndIncrementUsage } from "@/lib/usage";
import { createClient } from "@/lib/supabase/server";

function anonFromRequest(req: NextRequest): string | null {
  const fromCookie = req.cookies.get("deskzy_anon")?.value;
  if (fromCookie && /^[a-zA-Z0-9_-]{8,64}$/.test(fromCookie)) return fromCookie;
  const header = req.headers.get("x-deskzy-anon");
  if (header && /^[a-zA-Z0-9_-]{8,64}$/.test(header)) return header;
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      toolSlug?: string;
      increment?: boolean;
    };
    const toolSlug = body.toolSlug?.trim();
    if (!toolSlug) {
      return NextResponse.json({ error: "toolSlug required" }, { status: 400 });
    }

    const cap = freeDailyCap(toolSlug);
    if (cap === null) {
      return NextResponse.json({
        ok: true,
        plan: "free",
        remaining: null,
        unlimited: true,
      });
    }

    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      userId = null;
    }

    const anonKey = userId ? null : anonFromRequest(req);
    if (!userId && !anonKey) {
      return NextResponse.json(
        { error: "Missing anon id — refresh and try again" },
        { status: 400 },
      );
    }

    const result = await checkAndIncrementUsage({
      toolSlug,
      userId,
      anonKey,
      increment: body.increment !== false,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          plan: "free",
          limit: result.limit,
          used: result.used,
          upgradeUrl: "/pricing",
          error: `Daily Free limit reached (${result.used}/${result.limit}). Upgrade to Pro for unlimited.`,
        },
        { status: 402 },
      );
    }

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Usage check failed" },
      { status: 500 },
    );
  }
}

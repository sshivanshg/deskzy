import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { resolveLinksApiAuth } from "@/lib/links-api-auth";
import {
  allowLinkCreate,
  hasLink,
  normalizeCustomSlug,
  putLink,
  putListLink,
} from "@/lib/links-store";
import {
  normalizeUrlBatch,
  resolveCreateUrlTokens,
} from "@/lib/parse-pasted-urls";
import { publicLinkUrl } from "@/lib/link-path";
import { getUserPlan, persistOwnedLink } from "@/lib/pro-links";
import { createClient } from "@/lib/supabase/server";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function randomCode(n = 12): string {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = randomBytes(n);
  let out = "";
  for (let i = 0; i < n; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

type CreateBody = {
  url?: string;
  urls?: string[];
  slug?: string;
};

async function allocateCode(
  slug: string | undefined,
  plan: string,
): Promise<{ code: string; isCustom: boolean } | NextResponse> {
  if (slug?.trim()) {
    if (plan === "free") {
      return NextResponse.json(
        {
          error:
            "Custom slugs are a Pro feature. Upgrade to choose your short path.",
          upgradeUrl: "/pricing",
        },
        { status: 402 },
      );
    }
    const code = normalizeCustomSlug(slug);
    if (await hasLink(code)) {
      return NextResponse.json(
        { error: "That slug is already taken" },
        { status: 409 },
      );
    }
    return { code, isCustom: true };
  }

  for (let i = 0; i < 8; i++) {
    const candidate = randomCode(12);
    if (!(await hasLink(candidate))) {
      return { code: candidate, isCustom: false };
    }
  }
  return NextResponse.json(
    { error: "could not allocate code" },
    { status: 409 },
  );
}

export async function POST(req: NextRequest) {
  try {
    const apiAuth = await resolveLinksApiAuth(
      req.headers.get("authorization"),
    );

    // Public creates are IP rate-limited; API keys (global or Pro user) bypass.
    if (!apiAuth.ok) {
      const ip = clientIp(req);
      if (!(await allowLinkCreate(ip))) {
        return NextResponse.json(
          { error: "rate limit exceeded — try again in a minute" },
          { status: 429, headers: { "Retry-After": "60" } },
        );
      }
    }

    let userId: string | null = null;
    if (apiAuth.ok && apiAuth.kind === "user") {
      userId = apiAuth.userId;
    } else {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        userId = user?.id ?? null;
      } catch {
        userId = null;
      }
    }

    const { plan } = await getUserPlan(userId);
    const body = (await req.json()) as CreateBody;

    const rawList = resolveCreateUrlTokens(body);
    const batch = normalizeUrlBatch(rawList);
    if (!batch.ok) {
      return NextResponse.json({ error: batch.error }, { status: 400 });
    }

    const allocated = await allocateCode(body.slug, plan);
    if (allocated instanceof NextResponse) return allocated;
    const { code, isCustom } = allocated;

    if (batch.urls.length >= 2) {
      const record = await putListLink(code, batch.urls, { userId, isCustom });
      if (userId) {
        await persistOwnedLink({
          code: record.code,
          dest: record.dest,
          userId,
          isCustom,
        });
      }
      return NextResponse.json(
        {
          code,
          kind: "list" as const,
          dest: record.dest,
          urls: record.urls,
          shortUrl: publicLinkUrl(record.code),
          shareUrl: publicLinkUrl(record.code),
          createdAt: record.createdAt,
          isCustom,
        },
        { status: 201 },
      );
    }

    const dest = batch.urls[0];
    const record = await putLink(code, dest, { userId, isCustom });
    if (userId) {
      await persistOwnedLink({
        code: record.code,
        dest,
        userId,
        isCustom,
      });
    }

    return NextResponse.json(
      {
        code,
        kind: "single" as const,
        dest,
        shortUrl: publicLinkUrl(record.code),
        shareUrl: publicLinkUrl(record.code),
        createdAt: record.createdAt,
        isCustom,
      },
      { status: 201 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "invalid request";
    const kvCapped = /kv put\(\) limit exceeded|limit exceeded for the day/i.test(
      msg,
    );
    return NextResponse.json(
      {
        error: kvCapped
          ? "Link storage is temporarily busy. Please try again in a moment."
          : msg,
      },
      { status: kvCapped ? 503 : 400 },
    );
  }
}

/** List owned links for the signed-in user (Pro analytics). */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("short_links")
      .select("code,dest,hits,is_custom,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ links: data ?? [] });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}

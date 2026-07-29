import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  allowLinkCreate,
  hasLink,
  normalizeCustomSlug,
  putLink,
} from "@/lib/links-store";
import { getUserPlan, persistOwnedLink } from "@/lib/pro-links";
import { createClient } from "@/lib/supabase/server";

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("url required");
  if (trimmed.length > 2048) throw new Error("url too long");
  const withScheme = /:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  let u: URL;
  try {
    u = new URL(withScheme);
  } catch {
    throw new Error("invalid url");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("only http/https allowed");
  }
  if (!u.host || u.host.includes(" ")) throw new Error("invalid url");
  if (u.username || u.password) throw new Error("credentials in url not allowed");
  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    /^(10\.|192\.168\.|169\.254\.|127\.)/.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  ) {
    throw new Error("url not allowed");
  }
  return u.toString();
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function randomCode(n = 7): string {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = randomBytes(n);
  let out = "";
  for (let i = 0; i < n; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    if (!(await allowLinkCreate(ip))) {
      return NextResponse.json(
        { error: "rate limit exceeded — try again in a minute" },
        { status: 429, headers: { "Retry-After": "60" } },
      );
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

    const { plan } = await getUserPlan(userId);
    const body = (await req.json()) as { url?: string; slug?: string };
    const dest = normalizeUrl(body.url || "");

    let code = "";
    let isCustom = false;

    if (body.slug?.trim()) {
      if (plan === "free") {
        return NextResponse.json(
          {
            error: "Custom slugs are a Pro feature. Upgrade to choose your short path.",
            upgradeUrl: "/pricing",
          },
          { status: 402 },
        );
      }
      code = normalizeCustomSlug(body.slug);
      if (await hasLink(code)) {
        return NextResponse.json(
          { error: "That slug is already taken" },
          { status: 409 },
        );
      }
      isCustom = true;
    } else {
      for (let i = 0; i < 8; i++) {
        const candidate = randomCode(7);
        if (!(await hasLink(candidate))) {
          code = candidate;
          break;
        }
      }
      if (!code) {
        return NextResponse.json(
          { error: "could not allocate code" },
          { status: 409 },
        );
      }
    }

    const record = await putLink(code, dest, { userId, isCustom });
    if (userId) {
      await persistOwnedLink({
        code: record.code,
        dest,
        userId,
        isCustom,
      });
    }

    const origin = req.nextUrl.origin;
    return NextResponse.json(
      {
        code,
        dest,
        shortUrl: `${origin}/r/${record.code}`,
        createdAt: record.createdAt,
        isCustom,
      },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "invalid request" },
      { status: 400 },
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

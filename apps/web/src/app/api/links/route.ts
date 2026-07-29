import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { allowLinkCreate, hasLink, putLink } from "@/lib/links-store";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/lib/usage";

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

    const usage = await checkAndIncrementUsage({
      toolSlug: "url-shortener",
      userId,
      anonKey: userId ? null : `ip:${ip}`,
    });
    if (!usage.ok) {
      return NextResponse.json(
        {
          error: `Daily free limit reached (${usage.used}/${usage.limit}). Upgrade to Pro for unlimited links.`,
          upgradeUrl: "/pricing",
        },
        { status: 402 },
      );
    }

    const body = (await req.json()) as { url?: string };
    const dest = normalizeUrl(body.url || "");

    let code = "";
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

    const record = await putLink(code, dest);
    const origin = req.nextUrl.origin;

    return NextResponse.json(
      {
        code,
        dest,
        shortUrl: `${origin}/r/${record.code}`,
        createdAt: record.createdAt,
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

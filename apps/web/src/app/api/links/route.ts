import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { hasLink, putLink } from "@/lib/links-store";

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("url required");
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
  if (!u.host) throw new Error("invalid url");
  return u.toString();
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

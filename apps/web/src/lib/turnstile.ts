import { NextRequest, NextResponse } from "next/server";

type TurnstileResponse = {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export const TURNSTILE_TOKEN_FIELD = "turnstileToken";

function clientIp(req: NextRequest): string | undefined {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    undefined
  );
}

export function isTurnstileRequired(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstileToken(
  token: string | undefined,
  req: NextRequest,
  expectedAction: string,
): Promise<NextResponse | null> {
  const secret = process.env.TURNSTILE_SECRET || process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return null;

  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
  );

  if (!token || token.length > 2048 || expectedHostnames.size === 0) {
    return NextResponse.json(
      { error: "Security check required. Please complete Turnstile." },
      { status: 400 },
    );
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  const ip = clientIp(req);
  if (ip) formData.append("remoteip", ip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: formData },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Security check unavailable. Please try again." },
      { status: 503 },
    );
  }

  const data = (await res.json()) as TurnstileResponse;
  if (
    !data.success ||
    data.action !== expectedAction ||
    !data.hostname ||
    !expectedHostnames.has(data.hostname)
  ) {
    return NextResponse.json(
      { error: "Security check failed. Please try again." },
      { status: 403 },
    );
  }

  return null;
}

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/account";
  return raw;
}

function appOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost) return `${proto}://${forwardedHost.split(",")[0].trim()}`;
  return new URL(request.url).origin;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(searchParams.get("next"));
  const origin = appOrigin(request);
  const errorRedirect = NextResponse.redirect(
    `${origin}/login?error=auth_callback`,
  );

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return errorRedirect;
  }

  // Build redirect first so we can attach session cookies to it (Cloudflare-safe).
  const successRedirect = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          successRedirect.cookies.set(name, value, options);
          errorRedirect.cookies.set(name, value, options);
        });
      },
    },
  });

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return successRedirect;
      console.error("auth callback exchangeCodeForSession:", error.message);
      return errorRedirect;
    }

    // Email confirmation / magic-link style links from Supabase
    if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      });
      if (!error) return successRedirect;
      console.error("auth callback verifyOtp:", error.message);
      return errorRedirect;
    }
  } catch (err) {
    console.error("auth callback exception:", err);
    return errorRedirect;
  }

  return errorRedirect;
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveShortcut } from "@/lib/tools/registry";
import { updateSession } from "@/lib/supabase/middleware";

/** Canonical host + shortcuts + Supabase session refresh. */
export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (host === "www.deskzy.xyz") {
    const url = request.nextUrl.clone();
    url.host = "deskzy.xyz";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  const segment = request.nextUrl.pathname.replace(/^\/+|\/+$/g, "");
  if (segment && !segment.includes("/")) {
    const slug = resolveShortcut(segment);
    if (slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/tools/${slug}`;
      return NextResponse.redirect(url, 308);
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|r/|sitemap\\.xml|robots\\.txt|og\\.png|logo\\.png|logo-mark\\.png|icon-.*\\.png|apple-touch-icon\\.png).*)",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveShortcut } from "@/lib/tools/registry";
import { updateSession } from "@/lib/supabase/middleware";
import {
  isHopPathname,
  isShareHost,
  SHARE_HOST,
  SITE_ORIGIN,
} from "@/lib/link-path";

const APEX_HOST = SITE_ORIGIN.replace(/^https?:\/\//i, "").replace(/\/$/, "");

/** Canonical host + HTTPS + share domain + shortcuts + session. */
export async function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const proto = request.headers.get("x-forwarded-proto");
  const pathname = request.nextUrl.pathname;

  // Force HTTPS everywhere.
  const isHttp =
    proto === "http" || request.nextUrl.protocol === "http:";
  if (isHttp) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = host || APEX_HOST;
    return NextResponse.redirect(url, 308);
  }

  // www → apex for product site
  if (host === `www.${APEX_HOST}`) {
    const url = request.nextUrl.clone();
    url.host = APEX_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  // www → apex for share domain
  if (host === `www.${SHARE_HOST.toLowerCase()}`) {
    const url = request.nextUrl.clone();
    url.host = SHARE_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  // Move legacy share links onto the canonical share domain while preserving
  // their code and query string. Old bookmarks keep working, but visitors only
  // see the current domain.
  if (
    isShareHost(host) &&
    host !== SHARE_HOST.toLowerCase() &&
    isHopPathname(pathname)
  ) {
    const url = request.nextUrl.clone();
    url.hostname = SHARE_HOST;
    url.port = "";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  // Dedicated share domain (jfas.site / legacy share hosts): hop pages only.
  if (isShareHost(host)) {
    if (isHopPathname(pathname) || pathname === "/") {
      if (pathname === "/") {
        const url = request.nextUrl.clone();
        url.host = APEX_HOST;
        url.pathname = "/";
        return NextResponse.redirect(url, 308);
      }
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-pathname", pathname);
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }
    // Non-hop on share host → main Deskzy site
    const url = request.nextUrl.clone();
    url.host = APEX_HOST;
    return NextResponse.redirect(url, 308);
  }

  // Apex deskzy.xyz: hop pages still work (legacy bookmarks).
  if (isHopPathname(pathname)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  const segment = pathname.replace(/^\/+|\/+$/g, "");
  if (segment && !segment.includes("/")) {
    const slug = resolveShortcut(segment);
    if (slug) {
      const next = request.nextUrl.clone();
      next.pathname = `/tools/${slug}`;
      return NextResponse.redirect(next, 308);
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|sitemap\\.xml|robots\\.txt|og\\.png|logo\\.png|logo-mark\\.png|icon-.*\\.png|apple-touch-icon\\.png).*)",
  ],
};

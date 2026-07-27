import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Canonical host: deskzy.xyz (www → apex). */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (host === "www.deskzy.xyz") {
    const url = request.nextUrl.clone();
    url.host = "deskzy.xyz";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

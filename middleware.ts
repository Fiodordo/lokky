import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = request.cookies.get("lokky-locale")?.value;
  if (locale === "en" && pathname.startsWith("/dashboard")) {
    const target = request.nextUrl.clone();
    target.pathname = `/en${pathname}`;
    return NextResponse.redirect(target);
  }
  if (locale === "fr" && pathname.startsWith("/en/dashboard")) {
    const target = request.nextUrl.clone();
    target.pathname = pathname.replace(/^\/en/, "");
    return NextResponse.redirect(target);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/en/dashboard/:path*"] };

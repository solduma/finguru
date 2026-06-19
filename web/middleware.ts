import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, isValidToken } from "@/lib/auth";

// Paths that must stay reachable without auth (the login page + its endpoints,
// and Next internals). Everything else is gated.
const PUBLIC_PREFIXES = ["/login", "/auth", "/logout", "/_next", "/favicon"];

export async function middleware(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  // No secret configured => gate disabled (local dev stays open). You opt in to
  // the password wall by setting AUTH_SECRET (and SITE_PASSWORD) in the env.
  if (!secret) return NextResponse.next();

  const { pathname, search } = req.nextUrl;
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (await isValidToken(token, secret)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  // Remember where they were headed so we can send them back after login.
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except static asset files (matched by the negative lookahead).
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

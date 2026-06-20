import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, makeToken } from "@/lib/auth";

// POST /auth { password }  -> sets the auth cookie on success.
export async function POST(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  const expected = process.env.SITE_PASSWORD;
  if (!secret || !expected) {
    // Misconfigured: treat as open rather than locking everyone out.
    return NextResponse.json({ ok: true, gateDisabled: true });
  }

  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    /* ignore malformed body */
  }

  if (password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // Only mark the cookie Secure when the request actually arrived over HTTPS.
  // Gating on NODE_ENV instead would set Secure in `next start` over plain HTTP
  // (e.g. localhost/LAN), and the browser would silently drop the cookie —
  // bouncing users back to /login even with the right password. Honor
  // x-forwarded-proto so it still becomes Secure behind a TLS reverse proxy.
  const isHttps =
    req.nextUrl.protocol === "https:" ||
    req.headers.get("x-forwarded-proto") === "https";

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, await makeToken(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

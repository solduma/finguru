// Minimal shared-password auth for a friends-only site.
//
// The cookie holds an HMAC of a fixed message keyed by AUTH_SECRET, so it can't
// be forged without the secret and carries no user data. Stateless: the
// middleware just recomputes the HMAC and compares. Uses Web Crypto so it works
// in both the edge (middleware) and node (route handler) runtimes.

export const COOKIE_NAME = "finguru_auth";
const TOKEN_MESSAGE = "finguru-authenticated-v1";

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function makeToken(secret: string): Promise<string> {
  return hmacHex(secret, TOKEN_MESSAGE);
}

// Constant-time-ish hex compare (avoids early-exit timing leaks).
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isValidToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  return safeEqual(token, await makeToken(secret));
}

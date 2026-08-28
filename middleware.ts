import { NextResponse, type NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "c2c_admin_session";
const AUTH_SECRET =
  process.env.AUTH_SECRET || "crayon2couture-demo-secret-change-me";
const PUBLIC_ADMIN = ["/admin/login"];

export const config = {
  runtime: "nodejs",
  matcher: ["/admin/:path*"],
};

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return false;
  const expected = createHmac("sha256", AUTH_SECRET).update(b64).digest("hex");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(b64, "base64url").toString("utf8"),
    ) as { exp: number };
    return payload.exp >= Date.now();
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_ADMIN.some((p) => pathname === p)) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!isValidToken(token)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

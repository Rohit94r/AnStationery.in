import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "c2c_admin_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "crayon2couture-jwt-secret-change-me-2026",
);
const PUBLIC_ADMIN = ["/admin/login"];

export const config = {
  runtime: "nodejs",
  matcher: ["/admin/:path*"],
};

async function isValidAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_ADMIN.some((p) => pathname === p)) return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await isValidAdminToken(token))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

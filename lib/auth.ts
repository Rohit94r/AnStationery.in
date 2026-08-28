import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "c2c_session";
const ADMIN_COOKIE = "c2c_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// --- Admin credentials ---
// In production, store hashed password in DB. For demo we hash on first run.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "Anstationery2@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ANstationery@123";
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "crayon2couture-jwt-secret-change-me-2026",
);

// --- Types ---
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  image?: string;
};

// =====================
// ADMIN AUTH (JWT)
// =====================

export async function adminLogin(
  email: string,
  password: string,
): Promise<boolean> {
  const emailOk =
    email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
  const passOk = password === ADMIN_PASSWORD;
  if (!emailOk || !passOk) return false;

  const token = await new SignJWT({
    id: "admin",
    email: ADMIN_EMAIL,
    name: "Admin",
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET);

  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return true;
}

export async function adminLogout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function getAdminSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "admin") return null;
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: "admin",
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

// =====================
// USER AUTH (JWT + Google OAuth)
// =====================

export async function setUserSession(user: {
  id: string;
  email: string;
  name: string;
  image?: string;
}): Promise<void> {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: "user",
    image: user.image ?? "",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(JWT_SECRET);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getUserSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "user") return null;
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: "user",
      image: (payload.image as string) || undefined,
    };
  } catch {
    return null;
  }
}

export async function userLogout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getAnySession(): Promise<SessionUser | null> {
  return (await getAdminSession()) || (await getUserSession());
}

// =====================
// GOOGLE OAuth helpers
// =====================

export function getGoogleOAuthUrl(state: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string): Promise<{
  email: string;
  name: string;
  picture: string;
  sub: string;
} | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) return null;
  const tokenData = await tokenRes.json();

  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!userRes.ok) return null;
  const user = await userRes.json();
  return {
    email: user.email,
    name: user.name,
    picture: user.picture,
    sub: user.sub,
  };
}

// Exposed for dev hint on login page
export const DEMO_ADMIN_EMAIL = ADMIN_EMAIL;
export const DEMO_ADMIN_PASSWORD = ADMIN_PASSWORD;
export const isGoogleConfigured = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

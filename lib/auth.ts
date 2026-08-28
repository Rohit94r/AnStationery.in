import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "c2c_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Demo credentials (override with env in production)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@crayon2couture.in";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const AUTH_SECRET =
  process.env.AUTH_SECRET || "crayon2couture-demo-secret-change-me";

function sign(payload: string): string {
  return createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
}

function createToken(email: string): string {
  const payload = JSON.stringify({ email, exp: Date.now() + SESSION_MAX_AGE * 1000 });
  const b64 = Buffer.from(payload, "utf8").toString("base64url");
  return `${b64}.${sign(b64)}`;
}

function verifyToken(token: string): { email: string; exp: number } | null {
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const expected = sign(b64);
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(b64, "base64url").toString("utf8"),
    ) as { email: string; exp: number };
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<boolean> {
  const emailOk =
    email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
  const passOk = password === ADMIN_PASSWORD;
  if (!emailOk || !passOk) return false;

  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(ADMIN_EMAIL), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return true;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ email: string } | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin(): Promise<{ email: string }> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export const DEMO_ADMIN_EMAIL = ADMIN_EMAIL;
export const DEMO_ADMIN_PASSWORD = ADMIN_PASSWORD;

import { NextResponse } from "next/server";
import { exchangeGoogleCode, setUserSession, isGoogleConfigured } from "@/lib/auth";

export async function GET(request: Request) {
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(new URL("/login?error=google_not_configured", request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }

  // Decode redirect target from state
  let from = "/";
  try {
    const parsed = JSON.parse(Buffer.from(state ?? "", "base64url").toString("utf8"));
    if (parsed.from && typeof parsed.from === "string") from = parsed.from;
  } catch {
    /* keep default */
  }

  const user = await exchangeGoogleCode(code);
  if (!user) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }

  await setUserSession({
    id: `google-${user.sub}`,
    email: user.email,
    name: user.name,
    image: user.picture,
  });

  const baseUrl = new URL(request.url).origin;
  return NextResponse.redirect(new URL(from, baseUrl));
}

import { NextResponse } from "next/server";
import { getGoogleOAuthUrl, isGoogleConfigured } from "@/lib/auth";

export async function GET(request: Request) {
  if (!isGoogleConfigured()) {
    return NextResponse.json(
      { error: "Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET." },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || "/";
  const state = Buffer.from(JSON.stringify({ from, ts: Date.now() })).toString("base64url");
  const url = getGoogleOAuthUrl(state);

  return NextResponse.redirect(url);
}

import { NextResponse } from "next/server";
import { getUserSession, getAdminSession } from "@/lib/auth";

export async function GET() {
  const user = await getUserSession();
  const admin = await getAdminSession();
  return NextResponse.json({
    user: user ?? null,
    admin: admin ?? null,
    isAuthenticated: Boolean(user || admin),
  });
}

import { NextResponse } from "next/server";
import { userLogout } from "@/lib/auth";

export async function POST() {
  await userLogout();
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { adminLogin, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from "@/lib/auth";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email and password" },
      { status: 400 },
    );
  }

  const ok = await adminLogin(parsed.data.email, parsed.data.password);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }
  return NextResponse.json({ ok: true });
}

export function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ demo: false });
  }
  return NextResponse.json({
    demo: true,
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_ADMIN_PASSWORD,
  });
}

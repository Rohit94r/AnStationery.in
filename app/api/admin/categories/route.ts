import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { adminCreateCategory } from "@/lib/data";

const Schema = z.object({
  name: z.string().min(1),
  emoji: z.string().optional(),
  description: z.string().optional(),
  accent: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const category = await adminCreateCategory({
    name: parsed.data.name,
    emoji: parsed.data.emoji,
    description: parsed.data.description,
    accent: parsed.data.accent,
  });
  return NextResponse.json({ category }, { status: 201 });
}

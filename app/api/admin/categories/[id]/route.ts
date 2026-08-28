import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { adminDeleteCategory, adminUpdateCategory } from "@/lib/data";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  await adminUpdateCategory(id, {
    name: body.name,
    emoji: body.emoji,
    description: body.description,
    accent: body.accent,
    isActive: body.isActive,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await adminDeleteCategory(id);
  return NextResponse.json({ ok: true });
}

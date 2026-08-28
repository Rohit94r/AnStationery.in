import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { adminDeleteBanner, adminUpdateBanner } from "@/lib/data";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  await adminUpdateBanner(id, {
    title: body.title,
    subtitle: body.subtitle,
    imageUrl: body.imageUrl,
    buttonText: body.buttonText,
    buttonUrl: body.buttonUrl,
    variant: body.variant,
    isActive: body.isActive,
    sortOrder: body.sortOrder ?? 0,
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
  await adminDeleteBanner(id);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { adminUpdateOrderStatus } from "@/lib/data";
import { ORDER_STATUSES } from "@/lib/constants";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  if (!ORDER_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await adminUpdateOrderStatus(id, body.status);
  return NextResponse.json({ ok: true });
}

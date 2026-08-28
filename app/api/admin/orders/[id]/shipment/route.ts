import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { adminUpdateShipment } from "@/lib/data";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  await adminUpdateShipment(id, {
    courierName: body.courierName,
    trackingNumber: body.trackingNumber,
    trackingUrl: body.trackingUrl,
    status: body.status,
  });

  // auto-advance order status to SHIPPED when courier set
  if (body.courierName && body.trackingNumber) {
    const { adminUpdateOrderStatus } = await import("@/lib/data");
    await adminUpdateOrderStatus(id, "SHIPPED");
  }

  return NextResponse.json({ ok: true });
}

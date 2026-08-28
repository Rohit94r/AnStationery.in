import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { adminCreateBanner, adminGetBanners } from "@/lib/data";

const Schema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  imageUrl: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  variant: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const banners = await adminGetBanners();
  return NextResponse.json({ banners });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const banner = await adminCreateBanner({
    title: parsed.data.title,
    subtitle: parsed.data.subtitle,
    imageUrl: parsed.data.imageUrl,
    buttonText: parsed.data.buttonText,
    buttonUrl: parsed.data.buttonUrl,
    variant: parsed.data.variant,
    isActive: parsed.data.isActive,
    sortOrder: parsed.data.sortOrder,
  });
  return NextResponse.json({ banner }, { status: 201 });
}

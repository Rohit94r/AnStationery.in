import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { adminCreateProduct, adminGetCategories } from "@/lib/data";

const Schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().int().min(0),
  originalPrice: z.number().int().min(0).nullable().optional(),
  stock: z.number().int().min(0),
  sku: z.string().nullable().optional(),
  badge: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isTrending: z.boolean(),
  isNew: z.boolean(),
  isBestSeller: z.boolean(),
  images: z
    .array(z.object({ id: z.string(), url: z.string(), isPrimary: z.boolean() }))
    .min(1, "At least one image is required"),
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const d = parsed.data;

  try {
    const product = await adminCreateProduct({
      name: d.name,
      description: d.description,
      price: d.price,
      originalPrice: d.originalPrice ?? null,
      stock: d.stock,
      sku: d.sku ?? null,
      badge: d.badge ?? null,
      isActive: d.isActive,
      isFeatured: d.isFeatured,
      isTrending: d.isTrending,
      isNew: d.isNew,
      isBestSeller: d.isBestSeller,
      categoryId: d.categoryId ?? null,
      images: d.images.map((im) => ({ url: im.url, isPrimary: im.isPrimary })),
    });
    return NextResponse.json({ id: product.id, slug: product.slug }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create product" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await adminGetCategories();
  return NextResponse.json({ categories });
}

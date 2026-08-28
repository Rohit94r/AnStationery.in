import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import {
  adminGetProductById,
  adminReplaceImages,
  adminSoftDeleteProduct,
  adminUpdateProduct,
  adminUpdateStock,
} from "@/lib/data";

const UpdateSchema = z.object({
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
    .optional(),
});

async function checkAuth() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const product = await adminGetProductById(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const d = parsed.data;

  try {
    if (d.images) {
      await adminReplaceImages(id, d.images.map((im) => ({ url: im.url, isPrimary: im.isPrimary })));
    }

    await adminUpdateProduct(id, {
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
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const data = body as { stock?: number };
  if (typeof data.stock === "number") {
    await adminUpdateStock(id, data.stock);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await adminSoftDeleteProduct(id);
  return NextResponse.json({ ok: true });
}

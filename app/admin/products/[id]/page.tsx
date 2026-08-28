import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { adminGetCategories, adminGetProductForEdit } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    adminGetProductForEdit(id),
    adminGetCategories(),
  ]);

  if (!product) notFound();

  return (
    <ProductForm
      mode="edit"
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      product={product}
    />
  );
}

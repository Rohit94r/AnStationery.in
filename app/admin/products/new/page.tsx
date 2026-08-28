import { ProductForm } from "@/components/admin/product-form";
import { adminGetCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await adminGetCategories();
  return (
    <ProductForm
      mode="create"
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}

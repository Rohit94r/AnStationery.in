import { CategoriesManager } from "@/components/admin/categories-manager";
import { adminGetCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await adminGetCategories();
  return (
    <CategoriesManager
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        emoji: c.emoji,
        description: c.description,
        accent: c.accent,
        isActive: "is_active" in c ? (c as { is_active: boolean }).is_active : true,
        _count: { products: c._count.products },
      }))}
    />
  );
}

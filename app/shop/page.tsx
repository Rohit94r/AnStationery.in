import { Suspense } from "react";
import { ShopClient } from "@/components/products/shop-client";
import { getAllProducts, getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop All Products",
  description: "Browse trending, aesthetic and gift-worthy stationery.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted">
          Loading shop...
        </div>
      }
    >
      <ShopClient
        products={products}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          emoji: c.emoji,
        }))}
      />
    </Suspense>
  );
}

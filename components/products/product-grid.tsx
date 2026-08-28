import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[];
  columns?: 2 | 3 | 4;
}) {
  const cols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  }[columns];

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-cream p-10 text-center text-muted">
        No products found.
      </div>
    );
  }

  return <div className={cn("grid gap-4", cols)}>{products.map((p) => (
    <ProductCard key={p.id} product={p} />
  ))}</div>;
}

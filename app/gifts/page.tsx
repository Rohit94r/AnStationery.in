import { ProductGrid } from "@/components/products/product-grid";
import { getProductsByCategory } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gifts",
  description: "Ready-to-gift cute hampers and boxes from Crayon2Couture.",
};

export default async function GiftsPage() {
  const products = await getProductsByCategory("gifts");
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="font-accent text-xl font-bold text-yellow-deep">
          gift something cute
        </p>
        <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          Gifts {"\ud83c\udf81"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {products.length} ready-to-gift picks
        </p>
      </header>
      <ProductGrid products={products} />
    </div>
  );
}

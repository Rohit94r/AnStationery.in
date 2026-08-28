import { ProductGrid } from "@/components/products/product-grid";
import { getNewArrivals } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Arrivals",
  description: "Just landed at Crayon2Couture.",
};

export default async function NewPage() {
  const products = await getNewArrivals();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="font-accent text-xl font-bold text-yellow-deep">
          fresh in store
        </p>
        <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          New Arrivals {"\u2728"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {products.length} products just landed
        </p>
      </header>
      <ProductGrid products={products} />
    </div>
  );
}

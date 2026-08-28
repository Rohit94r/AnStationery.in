import { ProductGrid } from "@/components/products/product-grid";
import { getTrending } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trending Now",
  description: "What everyone is loving this week at Crayon2Couture.",
};

export default async function TrendingPage() {
  const products = await getTrending();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="font-accent text-xl font-bold text-yellow-deep">
          what&rsquo;s hot
        </p>
        <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          Trending Now {"\ud83d\udd25"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {products.length} products people are loving right now
        </p>
      </header>
      <ProductGrid products={products} />
    </div>
  );
}

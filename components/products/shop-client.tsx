"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "@/components/products/product-grid";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "best", label: "Best Selling" },
] as const;

export function ShopClient({
  products,
  categories,
}: {
  products: Product[];
  categories: { id: string; name: string; slug: string; emoji: string }[];
}) {
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<string>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "all") {
      list = list.filter((p) => p.categorySlug === category);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categorySlug.toLowerCase().includes(q),
      );
    }
    if (inStockOnly) list = list.filter((p) => p.stock > 0);

    switch (sort) {
      case "newest":
        list = [...list].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "best":
        list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        list = [...list].sort(
          (a, b) => Number(b.isFeatured) - Number(a.isFeatured),
        );
    }
    return list;
  }, [products, query, category, sort, inStockOnly]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="font-accent text-xl font-bold text-yellow-deep">
          browse everything cute
        </p>
        <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          Shop All Products
        </h1>
      </header>

      {/* Search + sort row */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-line bg-cream py-3 pl-11 pr-4 text-sm outline-none focus:border-yellow-deep"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-line bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-yellow-deep"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        <Chip active={category === "all"} onClick={() => setCategory("all")}>
          All
        </Chip>
        {categories.map((c) => (
          <Chip
            key={c.slug}
            active={category === c.slug}
            onClick={() => setCategory(c.slug)}
          >
            {c.emoji} {c.name}
          </Chip>
        ))}
        <button
          onClick={() => setInStockOnly((v) => !v)}
          className={cn(
            "ml-auto rounded-full border px-4 py-2 text-sm font-semibold transition",
            inStockOnly
              ? "border-pastel-mint bg-pastel-mint text-ink"
              : "border-line text-muted hover:text-ink",
          )}
        >
          In stock only
        </button>
      </div>

      <p className="mb-4 text-sm text-muted">{filtered.length} products</p>
      <ProductGrid products={filtered} />
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition",
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-white text-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

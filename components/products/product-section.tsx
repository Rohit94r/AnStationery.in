import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/products/product-grid";
import type { Product } from "@/types";

export function ProductSection({
  eyebrow,
  title,
  subtitle,
  products,
  viewAllHref,
  accent = "text-yellow-deep",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  accent?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          {eyebrow && (
            <p className={`font-accent text-xl font-bold ${accent}`}>
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="group flex items-center gap-1 rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:border-ink hover:bg-ink hover:text-white"
          >
            View All
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      <ProductGrid products={products} />
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/components/cart/cart-context";
import {
  cn,
  discountPercent,
  formatINR,
  toCartSnapshot,
} from "@/lib/utils";

const BADGE_STYLES: Record<string, string> = {
  NEW: "bg-badge-new text-white",
  SALE: "bg-badge-sale text-white",
  HOT: "bg-badge-hot text-white",
  TRENDING: "bg-badge-trend text-white",
  BESTSELLER: "bg-ink text-white",
  "SOLD OUT": "bg-ink/70 text-white",
};

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const soldOut = product.stock <= 0;
  const off = discountPercent(product.price, product.originalPrice);
  const lowStock = !soldOut && product.stock <= 5;

  return (
    <div className="group lift relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-cream"
      >
        <Image
          src={primary?.url ?? ""}
          alt={primary?.alt ?? product.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide shadow-sm",
                BADGE_STYLES[product.badge],
              )}
            >
              {product.badge}
            </span>
          )}
          {off > 0 && !soldOut && (
            <span className="rounded-full bg-yellow px-2.5 py-1 text-[10px] font-black text-ink shadow-sm">
              {off}% OFF
            </span>
          )}
        </div>
        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-white/60">
            <span className="rotate-[-6deg] rounded-lg bg-ink px-4 py-1.5 font-display text-sm font-black uppercase text-white">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="mb-1 flex items-center gap-1 text-xs text-muted">
          <Star className="h-3.5 w-3.5 fill-yellow text-yellow" />
          <span className="font-semibold text-ink">{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug hover:text-yellow-deep"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-display text-base font-black">
            {formatINR(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-muted line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>

        {lowStock && (
          <p className="mt-1 text-[11px] font-semibold text-badge-hot">
            Only {product.stock} left!
          </p>
        )}

        <button
          onClick={() => add(toCartSnapshot(product))}
          disabled={soldOut}
          className={cn(
            "mt-3 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition",
            soldOut
              ? "cursor-not-allowed bg-cream text-muted"
              : "bg-ink text-white hover:bg-yellow hover:text-ink",
          )}
        >
          <ShoppingBag className="h-4 w-4" />
          {soldOut ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/components/cart/cart-context";
import {
  cn,
  discountPercent,
  formatINR,
  toCartSnapshot,
} from "@/lib/utils";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);

  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 5;
  const off = discountPercent(product.price, product.originalPrice);
  const primary = product.images[active] ?? product.images[0];

  const handleBuyNow = () => {
    add(toCartSnapshot(product), qty);
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        / <Link href="/shop" className="hover:text-ink">Shop</Link> /{" "}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-cream">
            <Image
              key={primary?.id}
              src={primary?.url ?? ""}
              alt={primary?.alt ?? product.name}
              fill
              sizes="(max-width:1024px) 90vw, 560px"
              className="object-cover animate-pop"
              priority
            />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-black uppercase text-white">
                {product.badge}
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {product.images.map((im, i) => (
                <button
                  key={im.id}
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-cream transition",
                    i === active ? "border-yellow-deep" : "border-line",
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image
                    src={im.url}
                    alt={im.alt}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating)
                      ? "fill-yellow text-yellow"
                      : "text-line"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted">({product.reviewCount} reviews)</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="font-display text-3xl font-black">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-lg text-muted line-through">
                  {formatINR(product.originalPrice)}
                </span>
                <span className="rounded-full bg-yellow px-2.5 py-1 text-xs font-black text-ink">
                  {off}% OFF
                </span>
              </>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-ink-soft">
            {product.description}
          </p>

          {/* Stock */}
          <div className="mt-5">
            {soldOut ? (
              <span className="inline-block rounded-full bg-ink/10 px-3 py-1.5 text-sm font-bold text-ink">
                Sold Out
              </span>
            ) : (
              <span
                className={cn(
                  "inline-block rounded-full px-3 py-1.5 text-sm font-bold",
                  lowStock
                    ? "bg-badge-hot/15 text-badge-hot"
                    : "bg-pastel-mint text-ink",
                )}
              >
                {lowStock ? `Only ${product.stock} left! ` : "In Stock "}
                {"\u2705"}
              </span>
            )}
          </div>

          {/* Quantity + actions */}
          {!soldOut && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-line">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  disabled={qty >= product.stock}
                  className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => add(toCartSnapshot(product), qty)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-display text-sm font-bold text-white transition hover:bg-yellow hover:text-ink"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 rounded-full bg-yellow px-6 py-3.5 font-display text-sm font-bold text-ink transition hover:bg-yellow-deep"
              >
                Buy Now
              </button>
            </div>
          )}

          {product.sku && (
            <p className="mt-4 text-xs text-muted">SKU: {product.sku}</p>
          )}

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-6 text-center">
            {[
              { icon: Truck, label: "Fast Shipping" },
              { icon: RefreshCw, label: "7-day Returns" },
              { icon: ShieldCheck, label: "Secure Checkout" },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-1.5">
                <t.icon className="h-5 w-5 text-yellow-deep" />
                <span className="text-xs font-semibold text-muted">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

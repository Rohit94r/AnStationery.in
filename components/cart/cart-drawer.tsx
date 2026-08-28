"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { formatINR } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export function CartDrawer() {
  const {
    lines,
    open,
    setOpen,
    setQuantity,
    remove,
    subtotal,
    shipping,
    total,
    count,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const freeLeft = SITE.freeShippingThreshold - subtotal;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <ShoppingBag className="h-5 w-5 text-yellow-deep" />
            Your Cart
            <span className="rounded-full bg-yellow px-2 text-xs font-bold text-ink">
              {count}
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 hover:bg-cream"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="text-6xl animate-float">{"\ud83d\udea7"}</div>
            <p className="font-display text-xl font-bold">Your cart is empty</p>
            <p className="text-sm text-muted">
              Add some cute things to get started!
            </p>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-soft"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {freeLeft > 0 ? (
              <div className="bg-yellow-soft px-5 py-3 text-center text-xs font-semibold text-ink-soft">
                Add {formatINR(freeLeft)} more for FREE shipping {"\ud83d\ude9a"}
              </div>
            ) : (
              <div className="bg-pastel-mint px-5 py-3 text-center text-xs font-semibold text-ink-soft">
                Yay! You unlocked FREE shipping {"\ud83c\udf89"}
              </div>
            )}

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {lines.map((line) => (
                <div key={line.slug} className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream">
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${line.slug}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-sm font-semibold hover:underline"
                      >
                        {line.name}
                      </Link>
                      <button
                        onClick={() => remove(line.slug)}
                        className="text-muted hover:text-badge-sale"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-ink">
                      {formatINR(line.price)}
                    </p>
                    <div className="mt-auto flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          onClick={() => setQuantity(line.slug, line.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full hover:bg-cream"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(line.slug, line.quantity + 1)}
                          disabled={line.quantity >= line.stock}
                          className="grid h-7 w-7 place-items-center rounded-full hover:bg-cream disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {line.quantity >= line.stock && (
                        <span className="text-xs text-muted">
                          Only {line.stock} left
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-line px-5 py-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span className="font-semibold text-ink">
                  {shipping === 0 ? "FREE" : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-bold">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-full bg-yellow py-3 text-center font-display text-sm font-bold text-ink transition hover:bg-yellow-deep"
              >
                Proceed to Checkout {"\u2192"}
              </Link>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="block text-center text-xs font-semibold text-muted hover:text-ink"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

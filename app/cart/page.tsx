"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const { lines, setQuantity, remove, subtotal, shipping, total, clear } =
    useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
        <div className="text-7xl animate-float">{"\ud83d\udea7"}</div>
        <h1 className="font-display text-3xl font-black">Your cart is empty</h1>
        <p className="text-muted">
          Looks like you haven&rsquo;t added anything cute yet.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-display text-sm font-bold text-white transition hover:bg-yellow hover:text-ink"
        >
          Start Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-display text-3xl font-black tracking-tight sm:text-4xl">
        Your Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Lines */}
        <div className="space-y-4">
          {lines.map((line) => (
            <div
              key={line.slug}
              className="flex gap-4 rounded-2xl border border-line bg-white p-3"
            >
              <Link
                href={`/products/${line.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream"
              >
                <Image
                  src={line.image}
                  alt={line.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${line.slug}`}
                    className="font-semibold hover:underline"
                  >
                    {line.name}
                  </Link>
                  <button
                    onClick={() => remove(line.slug)}
                    className="text-muted hover:text-badge-sale"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm font-bold">{formatINR(line.price)}</p>
                <div className="mt-auto flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      onClick={() => setQuantity(line.slug, line.quantity - 1)}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-cream"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold">
                      {line.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(line.slug, line.quantity + 1)}
                      disabled={line.quantity >= line.stock}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-cream disabled:opacity-40"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {line.quantity >= line.stock && (
                    <span className="text-xs text-muted">
                      Only {line.stock} available
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden text-right sm:block">
                <p className="font-display font-black">
                  {formatINR(line.price * line.quantity)}
                </p>
              </div>
            </div>
          ))}
          <button
            onClick={clear}
            className="text-sm font-semibold text-muted hover:text-badge-sale"
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-line bg-cream p-5">
          <h2 className="font-display text-lg font-black">Order Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-semibold">{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="font-semibold">
                {shipping === 0 ? "FREE" : formatINR(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-black">
              <dt>Total</dt>
              <dd>{formatINR(total)}</dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-yellow py-3.5 font-display text-sm font-bold text-ink transition hover:bg-yellow-deep"
          >
            <ShoppingBag className="h-4 w-4" /> Checkout
          </Link>
          <Link
            href="/shop"
            className="mt-2 block text-center text-xs font-semibold text-muted hover:text-ink"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

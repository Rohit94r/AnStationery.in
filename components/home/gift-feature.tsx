import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import type { Product } from "@/types";
import { primaryImage, formatINR } from "@/lib/utils";

export function GiftFeature({ product }: { product?: Product | null }) {
  if (!product) return null;
  const img = primaryImage(product);
  const perks = ["Binder + pens", "Stickers & washi", "Gift-ready box", "Handwritten note"];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-yellow-soft p-6 lg:grid-cols-2 lg:p-10">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-white bg-cream shadow-lg">
            <Image
              src={img}
              alt={product.name}
              fill
              sizes="(max-width:1024px) 90vw, 560px"
              className="object-cover"
            />
          </div>
          <span className="absolute -left-3 -top-3 rotate-[-8deg] rounded-xl bg-ink px-3 py-2 font-display text-sm font-black text-white shadow-md">
            Best Gift {"\ud83c\udf81"}
          </span>
          <span className="absolute -right-2 bottom-6 text-3xl animate-float">{"\u2728"}</span>
        </div>

        <div>
          <p className="font-accent text-2xl font-bold text-yellow-deep">
            the perfect gift
          </p>
          <h2 className="mt-1 font-display text-3xl font-black leading-tight sm:text-4xl">
            {product.name}
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <ul className="mt-5 grid grid-cols-2 gap-2">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-pastel-mint">
                  <Check className="h-3 w-3 text-ink" />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <span className="font-display text-3xl font-black">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-muted line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-display text-sm font-bold text-white transition hover:bg-white hover:text-ink"
          >
            Shop Now
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

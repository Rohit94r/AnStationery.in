import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import type { Product } from "@/types";

export function Hero({ products: heroProducts }: { products: Product[] }) {
  if (heroProducts.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-dots">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-pastel-pink/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-pastel-sky/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20 lg:px-8">
        {/* Copy */}
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow px-3 py-1.5 text-xs font-black uppercase tracking-wide text-ink shadow-sm">
            <Sparkles className="h-3.5 w-3.5" /> New Drop Live
          </span>

          <h1 className="mt-5 font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Small Things.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Big Smiles.</span>
              <span className="absolute inset-x-0 bottom-2 -z-0 h-4 rounded-full bg-yellow/70" />
            </span>
          </h1>

          <p className="mt-3 font-accent text-2xl font-bold text-yellow-deep">
            cute things for everyday moments
          </p>

          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            Discover trending, aesthetic and gift-worthy products made to
            brighten your everyday moments.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-display text-sm font-bold text-white transition hover:bg-yellow hover:text-ink"
            >
              Shop Now
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/trending"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-7 py-3.5 font-display text-sm font-bold transition hover:bg-ink hover:text-white"
            >
              Explore Trending
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm">
            <div className="flex -space-x-2">
              {["\ud83d\udc9d", "\u2728", "\ud83c\udf80"].map((e, i) => (
                <span
                  key={i}
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-cream text-base shadow-sm"
                >
                  {e}
                </span>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 font-bold">
                <Star className="h-4 w-4 fill-yellow text-yellow" /> 4.9
              </div>
              <p className="text-xs text-muted">loved by 15K+ happy customers</p>
            </div>
          </div>
        </div>

        {/* Visual cluster */}
        <div className="relative hidden h-[420px] lg:block">
          {/* main card */}
          <div className="tape absolute left-1/2 top-1/2 h-72 w-56 -translate-x-1/2 -translate-y-1/2 -rotate-3 overflow-hidden rounded-2xl border-4 border-white bg-cream shadow-xl">
            <Image
              src={heroProducts[0].images[0].url}
              alt={heroProducts[0].name}
              fill
              sizes="(max-width:1024px) 0px, 224px"
              className="object-cover"
              priority
            />
          </div>
          {/* secondary cards */}
          <div className="absolute left-2 top-6 h-40 w-32 rotate-[-8deg] overflow-hidden rounded-xl border-4 border-white bg-cream shadow-lg animate-float">
            <Image
              src={heroProducts[1].images[0].url}
              alt={heroProducts[1].name}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-4 right-2 h-44 w-36 rotate-[7deg] overflow-hidden rounded-xl border-4 border-white bg-cream shadow-lg animate-float-slow">
            <Image
              src={heroProducts[2].images[0].url}
              alt={heroProducts[2].name}
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
          {/* doodles */}
          <span className="absolute right-10 top-2 text-3xl animate-wiggle">{"\u2b50"}</span>
          <span className="absolute left-6 bottom-16 text-3xl">{"\u2728"}</span>
          <span className="absolute right-4 bottom-24 text-2xl">{"\ud83c\udf80"}</span>
          {/* price tag */}
          <div className="absolute right-6 top-10 rotate-6 rounded-xl bg-yellow px-3 py-2 font-display text-sm font-black shadow-md">
            from {"\u20b9"}199
          </div>
        </div>
      </div>

      <div className="squiggle h-3 w-full" />
    </section>
  );
}

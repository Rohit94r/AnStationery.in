import Link from "next/link";
import { STATS } from "@/lib/constants";

export const metadata = {
  title: "About Us",
  description: "The story behind Crayon2Couture.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-accent text-2xl font-bold text-yellow-deep">
        our little story
      </p>
      <h1 className="mt-1 font-display text-4xl font-black tracking-tight sm:text-5xl">
        About Crayon2Couture
      </h1>

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft">
        <p>
          Crayon2Couture started with a simple idea: everyday things should make
          you smile. We hunt for the cutest, most aesthetic stationery and gifts
          and bring them together in one happy little shop.
        </p>
        <p>
          From hand-drawn journals to ready-to-gift hampers, every product is
          handpicked for quality and charm. We believe small things create big
          smiles {"\u2728"}.
        </p>
        <p>
          Based in India, we ship across the country and are always adding new
          drops. Thank you for supporting a small business with a big heart.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 rounded-3xl bg-cream p-6 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl">{s.emoji}</div>
            <div className="mt-1 font-display text-2xl font-black">{s.value}</div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/shop"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-yellow px-7 py-3.5 font-display text-sm font-bold text-ink transition hover:bg-yellow-deep"
      >
        Explore the shop {"\u2192"}
      </Link>
    </div>
  );
}

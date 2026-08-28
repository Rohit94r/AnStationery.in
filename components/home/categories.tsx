import Link from "next/link";

const ACCENT_BG: Record<string, string> = {
  "pastel-pink": "bg-pastel-pink",
  "pastel-mint": "bg-pastel-mint",
  "pastel-lilac": "bg-pastel-lilac",
  "pastel-peach": "bg-pastel-peach",
  "pastel-sky": "bg-pastel-sky",
};

type CategoryCard = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  accent?: string | null;
  count: number;
};

export function Categories({ cards }: { cards: CategoryCard[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 text-center">
        <p className="font-accent text-xl font-bold text-yellow-deep">
          find your vibe
        </p>
        <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
          Shop by Category
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <Link
            key={`${c.id}-${c.slug}`}
            href={c.slug === "shop" ? "/shop" : `/${c.slug}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-5 text-center transition hover:-translate-y-1 hover:shadow-md"
          >
            <span
              className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${ACCENT_BG[c.accent ?? "pastel-sky"]}`}
            >
              {c.emoji}
            </span>
            <span className="text-sm font-bold">{c.name}</span>
            <span className="text-xs text-muted">{c.count} items</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

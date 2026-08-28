import { Star } from "lucide-react";

type ReviewItem = {
  id: string;
  name: string;
  city: string | null;
  rating: number;
  text: string;
  product: string | null;
};

export function Reviews({ reviews }: { reviews: ReviewItem[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="font-accent text-xl font-bold text-yellow-deep">
          real smiles
        </p>
        <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
          Loved by Happy Customers
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map((r) => (
          <figure
            key={r.id}
            className="tape flex flex-col gap-3 rounded-2xl border border-line bg-cream p-5"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < r.rating ? "fill-yellow text-yellow" : "text-line"
                  }`}
                />
              ))}
            </div>
            <blockquote className="flex-1 text-sm leading-relaxed text-ink-soft">
              &ldquo;{r.text}&rdquo;
            </blockquote>
            <figcaption className="text-xs">
              <span className="font-bold">{r.name}</span>
              <span className="text-muted"> &middot; {r.city}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

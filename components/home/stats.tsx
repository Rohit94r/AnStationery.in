import { STATS } from "@/lib/constants";

export function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 rounded-3xl bg-cream p-6 sm:grid-cols-4 sm:p-8">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl">{s.emoji}</div>
            <div className="mt-1 font-display text-3xl font-black text-ink">
              {s.value}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

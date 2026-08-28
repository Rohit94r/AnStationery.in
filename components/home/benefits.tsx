import { BENEFITS } from "@/lib/constants";

export function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-6 text-center"
          >
            <span className="text-3xl">{b.emoji}</span>
            <h3 className="font-display text-sm font-bold">{b.title}</h3>
            <p className="text-xs text-muted">{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

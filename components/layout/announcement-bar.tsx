import { ANNOUNCEMENTS } from "@/lib/constants";

export function AnnouncementBar() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];
  return (
    <div className="relative overflow-hidden bg-yellow text-ink">
      <div className="flex w-max animate-marquee items-center gap-10 py-2 whitespace-nowrap">
        {items.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-2 text-xs font-semibold tracking-wide"
          >
            <span className="text-base">{"\u2728"}</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

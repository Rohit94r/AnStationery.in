import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
      <div className="text-7xl animate-float">{"\ud83d\udd0d"}</div>
      <h1 className="font-display text-4xl font-black tracking-tight">
        Page Not Found
      </h1>
      <p className="text-muted">
        The page you&rsquo;re looking for wandered off. Let&rsquo;s get you back
        to the cute stuff.
      </p>
      <Link
        href="/"
        className="rounded-full bg-ink px-7 py-3.5 font-display text-sm font-bold text-white transition hover:bg-yellow hover:text-ink"
      >
        Back to Home
      </Link>
    </div>
  );
}

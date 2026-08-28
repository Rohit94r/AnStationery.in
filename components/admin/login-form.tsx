"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { SITE } from "@/lib/constants";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/login")
      .then((r) => r.json())
      .then((d) => {
        if (d.demo) setDemo({ email: d.email, password: d.password });
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      router.push(from);
      router.refresh();
    } catch {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const fillDemo = () => {
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-yellow font-display text-xl font-black text-ink">
            C
          </span>
          <span className="font-display text-2xl font-black tracking-tight">
            Crayon<span className="text-yellow-deep">2</span>Couture
          </span>
        </Link>

        <div className="rounded-2xl border border-line bg-white p-7 shadow-sm">
          <div className="mb-5 text-center">
            <h1 className="font-display text-2xl font-black">Admin Login</h1>
            <p className="text-sm text-muted">Sign in to manage your store</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-badge-sale/15 px-4 py-3 text-sm font-semibold text-badge-sale">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-line bg-cream py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-deep"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-line bg-cream py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-deep"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 font-display text-sm font-bold text-white transition hover:bg-yellow hover:text-ink disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {demo && (
            <button
              onClick={fillDemo}
              className="mt-4 w-full rounded-xl bg-yellow-soft py-2.5 text-xs font-semibold text-ink-soft"
            >
              {"Demo mode \u2014 tap to fill demo credentials"}
            </button>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-muted">
          {SITE.name} Admin &middot; Secure area
        </p>
      </div>
    </div>
  );
}

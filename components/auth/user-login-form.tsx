"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, LogOut, Mail } from "lucide-react";
import { SITE } from "@/lib/constants";

export function UserLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/";
  const error = params.get("error");
  const [session, setSession] = useState<{
    user: { name: string; email: string; image?: string } | null;
    admin: { name: string; email: string } | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setSession(d))
      .catch(() => {});
  }, []);

  const googleLoginUrl = `/api/auth/google?from=${encodeURIComponent(from)}`;

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    router.refresh();
  };

  const errorMsg: Record<string, string> = {
    google_not_configured: "Google login is not configured yet. Please check back soon!",
    auth_failed: "Google authentication failed. Please try again.",
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
            <h1 className="font-display text-2xl font-black">Welcome Back</h1>
            <p className="text-sm text-muted">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-badge-sale/15 px-4 py-3 text-sm font-semibold text-badge-sale">
              {errorMsg[error] ?? "Something went wrong. Please try again."}
            </div>
          )}

          {session?.user && (
            <div className="mb-4 rounded-xl bg-pastel-mint px-4 py-4 text-center">
              <p className="font-semibold">{session.user.name}</p>
              <p className="text-xs text-muted">{session.user.email}</p>
              <div className="mt-3 flex gap-2">
                <Link
                  href="/account"
                  className="flex-1 rounded-full bg-ink py-2 text-sm font-bold text-white hover:bg-yellow hover:text-ink"
                >
                  My Account
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 rounded-full border border-line px-4 py-2 text-sm font-semibold hover:bg-cream"
                >
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </div>
            </div>
          )}

          {session?.admin && (
            <div className="mb-4 rounded-xl bg-yellow-soft px-4 py-4 text-center">
              <p className="font-semibold">Admin: {session.admin.name}</p>
              <p className="text-xs text-muted">{session.admin.email}</p>
              <Link
                href="/admin/dashboard"
                className="mt-2 inline-block rounded-full bg-ink px-5 py-2 text-sm font-bold text-white hover:bg-yellow hover:text-ink"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {!session?.user && (
            <>
              <a
                href={googleLoginUrl}
                onClick={() => setLoading(true)}
                className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-line bg-white py-3.5 font-semibold transition hover:border-ink hover:bg-cream"
              >
                <GoogleIcon />
                {loading ? "Connecting..." : "Continue with Google"}
              </a>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-line" />
                <span className="text-xs font-semibold text-muted">OR</span>
                <div className="h-px flex-1 bg-line" />
              </div>

              <div className="space-y-3 opacity-60">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    placeholder="Email"
                    disabled
                    className="w-full rounded-xl border border-line bg-cream py-3 pl-10 pr-4 text-sm outline-none"
                  />
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="password"
                    placeholder="Password"
                    disabled
                    className="w-full rounded-xl border border-line bg-cream py-3 pl-10 pr-4 text-sm outline-none"
                  />
                </div>
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 font-display text-sm font-bold text-white"
                >
                  Sign In <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-center text-xs text-muted">
                  Email/password login coming soon. Use Google for now.
                </p>
              </div>
            </>
          )}

          <div className="mt-5 border-t border-line pt-4 text-center">
            <Link
              href="/admin/login"
              className="text-xs font-semibold text-muted hover:text-yellow-deep"
            >
              Admin login {"\u2192"}
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-muted">
          {SITE.name} &middot; By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

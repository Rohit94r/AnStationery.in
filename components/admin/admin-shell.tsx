"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // login page: render bare
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar - desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-white lg:flex">
        <SidebarContent onLogout={onLogout} pathname={pathname} />
      </aside>

      {/* Sidebar - mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-60 flex-col border-r border-line bg-white">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full hover:bg-cream"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onLogout={onLogout} pathname={pathname} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur">
          <button
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-black">
            {NAV.find((n) => pathname.startsWith(n.href))?.label ?? "Admin"}
          </h1>
          <Link
            href="/"
            target="_blank"
            className="ml-auto flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition hover:border-ink hover:bg-ink hover:text-white"
          >
            <Store className="h-3.5 w-3.5" /> View Store
          </Link>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  onLogout,
  pathname,
}: {
  onLogout: () => void;
  pathname: string;
}) {
  return (
    <>
      <Link href="/admin/dashboard" className="flex items-center gap-2 border-b border-line px-5 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-yellow font-display text-lg font-black text-ink">
          C
        </span>
        <span className="font-display text-lg font-black">
          Crayon<span className="text-yellow-deep">2</span>Couture
        </span>
      </Link>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-yellow text-ink"
                  : "text-muted hover:bg-cream hover:text-ink",
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition hover:bg-cream hover:text-ink"
        >
          <LogOut className="h-4.5 w-4.5" />
          Logout
        </button>
      </div>
    </>
  );
}

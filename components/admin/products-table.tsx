"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import type { Product } from "@/types";
import { cn, formatINR } from "@/lib/utils";

export function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [list, setList] = useState(products);

  const filtered = list.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  const saveStock = async (id: string) => {
    const val = Number(stockValue) || 0;
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: val }),
    });
    setList((l) => l.map((p) => (p.id === id ? { ...p, stock: val } : p)));
    setEditingStock(null);
  };

  const doDelete = async (id: string) => {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setList((l) => l.filter((p) => p.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl font-black">Products</h2>
        <Link
          href="/admin/products/new"
          className="ml-auto flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-yellow hover:text-ink"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-yellow-deep"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-3 font-semibold">Product</th>
              <th className="px-3 py-3 font-semibold">Price</th>
              <th className="px-3 py-3 font-semibold">Stock</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 font-semibold">Flags</th>
              <th className="px-3 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-line/60 hover:bg-cream/50">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                      {p.images[0] && (
                        <Image
                          src={p.images[0].url}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="line-clamp-1 font-semibold hover:underline"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-muted">{p.sku ?? "no sku"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="font-bold">{formatINR(p.price)}</span>
                  {p.originalPrice && (
                    <span className="block text-xs text-muted line-through">
                      {formatINR(p.originalPrice)}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">
                  {editingStock === p.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={stockValue}
                        onChange={(e) => setStockValue(e.target.value)}
                        className="w-16 rounded-lg border border-line px-2 py-1 text-sm outline-none focus:border-yellow-deep"
                        autoFocus
                      />
                      <button
                        onClick={() => saveStock(p.id)}
                        className="grid h-7 w-7 place-items-center rounded-full bg-pastel-mint"
                        title="Save"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingStock(null)}
                        className="grid h-7 w-7 place-items-center rounded-full bg-cream"
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingStock(p.id);
                        setStockValue(String(p.stock));
                      }}
                      className="group flex items-center gap-1.5"
                      title="Click to edit stock"
                    >
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-bold",
                          p.stock === 0
                            ? "bg-badge-sale/15 text-badge-sale"
                            : p.stock <= 5
                              ? "bg-pastel-peach text-ink"
                              : "bg-pastel-mint text-ink",
                        )}
                      >
                        {p.stock}
                      </span>
                      <Pencil className="h-3 w-3 text-muted opacity-0 transition group-hover:opacity-100" />
                    </button>
                  )}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-bold",
                      p.isActive ? "bg-pastel-mint text-ink" : "bg-cream text-muted",
                    )}
                  >
                    {p.isActive ? "Active" : "Hidden"}
                  </span>
                  {p.badge && (
                    <span className="ml-1 rounded-full bg-yellow px-2 py-0.5 text-[10px] font-black">
                      {p.badge}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {[
                      ["F", p.isFeatured],
                      ["T", p.isTrending],
                      ["N", p.isNew],
                      ["B", p.isBestSeller],
                    ].map(([label, on]) => (
                      <span
                        key={label as string}
                        className={cn(
                          "grid h-5 w-5 place-items-center rounded text-[10px] font-black",
                          on ? "bg-ink text-white" : "bg-cream text-muted",
                        )}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-cream"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(p.id)}
                      className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-badge-sale/15 hover:text-badge-sale"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-muted">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-badge-sale/15 text-3xl">
              {"\ud83d\udea7"}
            </div>
            <h3 className="font-display text-lg font-black">Delete this product?</h3>
            <p className="mt-1 text-sm text-muted">
              It will be archived (soft-deleted). Existing orders keep their
              snapshots and stay accurate.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-full border border-line py-2.5 text-sm font-semibold hover:bg-cream"
              >
                Cancel
              </button>
              <button
                onClick={() => doDelete(confirmDelete)}
                className="flex-1 rounded-full bg-badge-sale py-2.5 text-sm font-bold text-white hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

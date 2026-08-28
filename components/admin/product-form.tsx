"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader";
import { BADGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CategoryOption = { id: string; name: string };

export function ProductForm({
  mode,
  product,
  categories,
}: {
  mode: "create" | "edit";
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number | null;
    stock: number;
    sku: string | null;
    badge: string | null;
    isActive: boolean;
    isFeatured: boolean;
    isTrending: boolean;
    isNew: boolean;
    isBestSeller: boolean;
    categoryId: string | null;
    images: UploadedImage[];
  };
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<UploadedImage[]>(product?.images ?? []);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    originalPrice: product?.originalPrice?.toString() ?? "",
    stock: product?.stock?.toString() ?? "0",
    sku: product?.sku ?? "",
    badge: product?.badge ?? "",
    categoryId: product?.categoryId ?? "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    isTrending: product?.isTrending ?? false,
    isNew: product?.isNew ?? true,
    isBestSeller: product?.isBestSeller ?? false,
  });

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: Number(form.stock) || 0,
      sku: form.sku.trim() || null,
      badge: form.badge || null,
      categoryId: form.categoryId || null,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isTrending: form.isTrending,
      isNew: form.isNew,
      isBestSeller: form.isBestSeller,
      images,
    };

    if (!payload.name || payload.price <= 0) {
      setError("Name and a valid price are required.");
      setSaving(false);
      return;
    }
    if (images.length === 0) {
      setError("Add at least one product image.");
      setSaving(false);
      return;
    }

    try {
      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${product!.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save product");
        setSaving(false);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Failed to save product. Please try again.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="font-display text-2xl font-black">
          {mode === "create" ? "New Product" : "Edit Product"}
        </h2>
      </div>

      {error && (
        <div className="rounded-xl bg-badge-sale/15 px-4 py-3 text-sm font-semibold text-badge-sale">
          {error}
        </div>
      )}

      {/* Images */}
      <Section title="Product Images" hint="Upload multiple, set primary, reorder">
        <ImageUploader images={images} onChange={setImages} />
      </Section>

      {/* Basics */}
      <Section title="Product Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product Name" full>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
              placeholder="Aesthetic Floral Journal"
            />
          </Field>
          <Field label="Description" full>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className={inputCls}
              placeholder="Describe the product..."
            />
          </Field>
          <Field label="Price (₹)">
            <input
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className={inputCls}
              placeholder="399"
            />
          </Field>
          <Field label="Original Price (₹)" hint="For discount display">
            <input
              type="number"
              value={form.originalPrice}
              onChange={(e) => set("originalPrice", e.target.value)}
              className={inputCls}
              placeholder="499"
            />
          </Field>
          <Field label="Stock Quantity">
            <input
              type="number"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              className={inputCls}
              placeholder="25"
            />
          </Field>
          <Field label="SKU (optional)">
            <input
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              className={inputCls}
              placeholder="C2C-DIARY-001"
            />
          </Field>
          <Field label="Category">
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className={inputCls}
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Badge">
            <select
              value={form.badge}
              onChange={(e) => set("badge", e.target.value)}
              className={inputCls}
            >
              <option value="">None</option>
              {BADGES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* Flags */}
      <Section title="Flags & Visibility">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Toggle
            label="Active"
            checked={form.isActive}
            onChange={(v) => set("isActive", v)}
          />
          <Toggle
            label="Featured"
            checked={form.isFeatured}
            onChange={(v) => set("isFeatured", v)}
          />
          <Toggle
            label="Trending"
            checked={form.isTrending}
            onChange={(v) => set("isTrending", v)}
          />
          <Toggle
            label="New Arrival"
            checked={form.isNew}
            onChange={(v) => set("isNew", v)}
          />
          <Toggle
            label="Best Seller"
            checked={form.isBestSeller}
            onChange={(v) => set("isBestSeller", v)}
          />
        </div>
      </Section>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-display text-sm font-bold text-white transition hover:bg-yellow hover:text-ink disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Publish Product" : "Save Changes"}
        </button>
        <Link
          href="/admin/products"
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold hover:bg-cream"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-yellow-deep";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <h3 className="font-display font-black">{title}</h3>
      {hint && <p className="mb-3 text-xs text-muted">{hint}</p>}
      <div className={hint ? "" : "mt-3"}>{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  full,
  children,
}: {
  label: string;
  hint?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", full && "sm:col-span-2")}>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition",
        checked ? "border-yellow-deep bg-yellow-soft" : "border-line bg-cream",
      )}
    >
      {label}
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition",
          checked ? "bg-yellow-deep" : "bg-line",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition",
            checked ? "left-4" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

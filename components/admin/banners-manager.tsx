"use client";

import { useState } from "react";
import { Image as ImageIcon, Plus, Save, Trash2, X } from "lucide-react";
import { BANNER_VARIANTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BannerRow = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  variant: string;
  isActive: boolean;
  sortOrder: number;
};

const VARIANT_BG: Record<string, string> = {
  yellow: "bg-yellow text-ink",
  cream: "bg-cream-deep text-ink",
  photo: "bg-ink text-white",
  pastel: "bg-pastel-lilac text-ink",
};

const empty = {
  title: "",
  subtitle: "",
  imageUrl: "",
  buttonText: "Shop Now",
  buttonUrl: "/shop",
  variant: "yellow",
  isActive: true,
  sortOrder: 99,
};

export function BannersManager({ banners: initial }: { banners: BannerRow[] }) {
  const [list, setList] = useState(initial);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(empty);
  const [editing, setEditing] = useState<Record<string, BannerRow>>({});

  const create = async () => {
    if (!draft.title.trim()) return;
    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    if (res.ok) {
      setList((l) => [...l, data.banner]);
      setCreating(false);
      setDraft(empty);
    }
  };

  const saveEdit = async (id: string) => {
    const b = editing[id];
    if (!b) return;
    await fetch(`/api/admin/banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: b.title,
        subtitle: b.subtitle,
        imageUrl: b.imageUrl,
        buttonText: b.buttonText,
        buttonUrl: b.buttonUrl,
        variant: b.variant,
        isActive: b.isActive,
        sortOrder: b.sortOrder,
      }),
    });
    setList((l) => l.map((x) => (x.id === id ? { ...x, ...b } : x)));
    setEditing((e) => {
      const next = { ...e };
      delete next[id];
      return next;
    });
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    setList((l) => l.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl font-black">Banners</h2>
        <button
          onClick={() => setCreating((v) => !v)}
          className="ml-auto flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-yellow hover:text-ink"
        >
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </div>

      {creating && (
        <div className="rounded-2xl border border-yellow-deep bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display font-black">New Banner</h3>
            <button onClick={() => setCreating(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-cream">
              <X className="h-4 w-4" />
            </button>
          </div>
          <BannerFields value={draft} onChange={setDraft} />
          <button onClick={create} className="mt-3 rounded-full bg-ink px-5 py-2 text-sm font-bold text-white hover:bg-yellow hover:text-ink">
            Create Banner
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {list
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((b) => {
            const edit = editing[b.id];
            const cur = edit ?? b;
            return (
              <div key={b.id} className="overflow-hidden rounded-2xl border border-line bg-white">
                {/* preview */}
                <div className={cn("flex min-h-[90px] flex-col justify-between p-4", VARIANT_BG[b.variant] ?? VARIANT_BG.yellow)}>
                  <p className="font-accent text-base font-bold opacity-80">{cur.subtitle}</p>
                  <h3 className="font-display text-xl font-black">{cur.title}</h3>
                  {cur.buttonText && (
                    <span className="mt-1 inline-flex w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-bold">
                      {cur.buttonText}
                    </span>
                  )}
                </div>
                {/* controls */}
                <div className="p-4">
                  <BannerFields
                    value={{
                      title: cur.title,
                      subtitle: cur.subtitle ?? "",
                      imageUrl: cur.imageUrl ?? "",
                      buttonText: cur.buttonText ?? "",
                      buttonUrl: cur.buttonUrl ?? "",
                      variant: cur.variant,
                      isActive: cur.isActive,
                      sortOrder: cur.sortOrder,
                    }}
                    onChange={(v) => setEditing((e) => ({ ...e, [b.id]: { ...b, ...v } }))}
                  />
                  <div className="mt-3 flex gap-2">
                    {edit ? (
                      <button onClick={() => saveEdit(b.id)} className="flex items-center gap-1.5 rounded-full bg-pastel-mint px-4 py-2 text-sm font-bold">
                        <Save className="h-3.5 w-3.5" /> Save
                      </button>
                    ) : (
                      <span className="text-xs text-muted">Edit fields above, then save</span>
                    )}
                    <button
                      onClick={() => remove(b.id)}
                      className="ml-auto flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-muted hover:bg-badge-sale/15 hover:text-badge-sale"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        {list.length === 0 && !creating && (
          <div className="md:col-span-2 rounded-2xl border border-dashed border-line bg-cream p-10 text-center text-muted">
            <ImageIcon className="mx-auto mb-2 h-8 w-8" />
            No banners yet. Add one to promote offers on your homepage.
          </div>
        )}
      </div>
    </div>
  );
}

function BannerFields({
  value,
  onChange,
}: {
  value: {
    title: string;
    subtitle: string;
    imageUrl: string;
    buttonText: string;
    buttonUrl: string;
    variant: string;
    isActive: boolean;
    sortOrder: number;
  };
  onChange: (v: typeof value) => void;
}) {
  const set = (k: keyof typeof value, v: string | boolean | number) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold">Title</span>
        <input value={value.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold">Subtitle</span>
        <input value={value.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={inputCls} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold">Button Text</span>
        <input value={value.buttonText} onChange={(e) => set("buttonText", e.target.value)} className={inputCls} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold">Button URL</span>
        <input value={value.buttonUrl} onChange={(e) => set("buttonUrl", e.target.value)} className={inputCls} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold">Variant</span>
        <select value={value.variant} onChange={(e) => set("variant", e.target.value)} className={inputCls}>
          {BANNER_VARIANTS.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold">Display Order</span>
        <input type="number" value={value.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} className={inputCls} />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1 block text-xs font-semibold">Image URL (optional)</span>
        <input value={value.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className={inputCls} placeholder="https://..." />
      </label>
      <label className="flex items-center gap-2 sm:col-span-2">
        <input type="checkbox" checked={value.isActive} onChange={(e) => set("isActive", e.target.checked)} className="h-4 w-4" />
        <span className="text-sm font-semibold">Active (show on homepage)</span>
      </label>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-yellow-deep";

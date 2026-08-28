"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { CATEGORY_ACCENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  description: string | null;
  accent: string | null;
  isActive: boolean;
  _count: { products: number };
};

export function CategoriesManager({
  categories: initial,
}: {
  categories: CategoryRow[];
}) {
  const [list, setList] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    emoji: "",
    description: "",
    accent: "pastel-pink",
    isActive: true,
  });
  const [editDraft, setEditDraft] = useState<CategoryRow | null>(null);

  const create = async () => {
    if (!draft.name.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    if (res.ok) {
      setList((l) => [...l, { ...data.category, _count: { products: 0 } }]);
      setCreating(false);
      setDraft({ name: "", emoji: "", description: "", accent: "pastel-pink", isActive: true });
    }
  };

  const saveEdit = async () => {
    if (!editDraft) return;
    const res = await fetch(`/api/admin/categories/${editDraft.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editDraft.name,
        emoji: editDraft.emoji ?? "",
        description: editDraft.description ?? "",
        accent: editDraft.accent ?? "pastel-pink",
        isActive: editDraft.isActive,
      }),
    });
    if (res.ok) {
      setList((l) => l.map((c) => (c.id === editDraft.id ? editDraft : c)));
      setEditing(null);
      setEditDraft(null);
    }
  };

  const doDelete = async (id: string) => {
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setList((l) => l.filter((c) => c.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl font-black">Categories</h2>
        <button
          onClick={() => setCreating((v) => !v)}
          className="ml-auto flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-yellow hover:text-ink"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {creating && (
        <div className="rounded-2xl border border-yellow-deep bg-white p-5">
          <h3 className="mb-3 font-display font-black">New Category</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Name"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className={inputCls}
            />
            <input
              placeholder="Emoji (e.g. 📓)"
              value={draft.emoji}
              onChange={(e) => setDraft((d) => ({ ...d, emoji: e.target.value }))}
              className={inputCls}
            />
            <input
              placeholder="Description"
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              className={inputCls}
            />
            <select
              value={draft.accent}
              onChange={(e) => setDraft((d) => ({ ...d, accent: e.target.value }))}
              className={inputCls}
            >
              {CATEGORY_ACCENTS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={create} className="rounded-full bg-ink px-5 py-2 text-sm font-bold text-white hover:bg-yellow hover:text-ink">
              Create
            </button>
            <button onClick={() => setCreating(false)} className="rounded-full border border-line px-5 py-2 text-sm font-semibold hover:bg-cream">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-3 font-semibold">Category</th>
              <th className="px-3 py-3 font-semibold">Slug</th>
              <th className="px-3 py-3 font-semibold">Products</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b border-line/60 hover:bg-cream/50">
                <td className="px-3 py-3">
                  {editing === c.id && editDraft ? (
                    <div className="flex gap-2">
                      <input
                        value={editDraft.emoji ?? ""}
                        onChange={(e) => setEditDraft({ ...editDraft, emoji: e.target.value })}
                        className="w-14 rounded-lg border border-line px-2 py-1 text-sm"
                        placeholder="📓"
                      />
                      <input
                        value={editDraft.name}
                        onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                        className="rounded-lg border border-line px-2 py-1 text-sm"
                      />
                    </div>
                  ) : (
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="text-lg">{c.emoji}</span> {c.name}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-muted">{c.slug}</td>
                <td className="px-3 py-3 font-semibold">{c._count.products}</td>
                <td className="px-3 py-3">
                  {editing === c.id && editDraft ? (
                    <button
                      onClick={() => setEditDraft({ ...editDraft, isActive: !editDraft.isActive })}
                      className={cn("rounded-full px-2.5 py-1 text-xs font-bold", editDraft.isActive ? "bg-pastel-mint" : "bg-cream text-muted")}
                    >
                      {editDraft.isActive ? "Active" : "Hidden"}
                    </button>
                  ) : (
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", c.isActive ? "bg-pastel-mint text-ink" : "bg-cream text-muted")}>
                      {c.isActive ? "Active" : "Hidden"}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {editing === c.id ? (
                      <>
                        <button onClick={saveEdit} className="grid h-8 w-8 place-items-center rounded-full bg-pastel-mint" title="Save">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setEditing(null); setEditDraft(null); }} className="grid h-8 w-8 place-items-center rounded-full bg-cream" title="Cancel">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditing(c.id); setEditDraft(c); }}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-cream"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(c.id)}
                          className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-badge-sale/15 hover:text-badge-sale"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-10 text-center text-muted">No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h3 className="font-display text-lg font-black">Delete category?</h3>
            <p className="mt-1 text-sm text-muted">Products in this category will become uncategorized.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 rounded-full border border-line py-2.5 text-sm font-semibold hover:bg-cream">Cancel</button>
              <button onClick={() => doDelete(confirmDelete)} className="flex-1 rounded-full bg-badge-sale py-2.5 text-sm font-bold text-white hover:opacity-90">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-yellow-deep";

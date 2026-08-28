"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { SITE } from "@/lib/constants";

const FIELDS = [
  { key: "name", label: "Business Name" },
  { key: "tagline", label: "Tagline" },
  { key: "description", label: "Description" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "whatsapp", label: "WhatsApp (digits only)" },
  { key: "instagram", label: "Instagram URL" },
  { key: "instagramHandle", label: "Instagram Handle" },
  { key: "address", label: "Address" },
  { key: "freeShippingThreshold", label: "Free Shipping Threshold (₹)" },
  { key: "shippingFee", label: "Shipping Fee (₹)" },
] as const;

export function SettingsManager() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        setConfig(d.config ?? {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setMsg("Settings saved!");
    setTimeout(() => setMsg(""), 2000);
  };

  if (loading) {
    return (
      <div className="grid place-items-center py-20 text-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-black">Settings</h2>
      <p className="text-sm text-muted">
        Business configuration. These values are the single source of truth (no
        duplication across files).
      </p>

      {msg && (
        <div className="rounded-xl bg-pastel-mint px-4 py-2 text-sm font-semibold text-ink">
          {msg}
        </div>
      )}

      <div className="rounded-2xl border border-line bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="mb-1 block text-sm font-semibold">{f.label}</span>
              <input
                value={config[f.key] ?? ""}
                onChange={(e) => setConfig({ ...config, [f.key]: e.target.value })}
                className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-yellow-deep"
              />
            </label>
          ))}
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="mt-4 flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-yellow hover:text-ink disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </button>
      </div>

      <div className="rounded-2xl border border-line bg-cream p-5 text-sm">
        <h3 className="mb-2 font-display font-black">Demo Admin Credentials</h3>
        <p className="text-muted">Email: <span className="font-semibold text-ink">{SITE.email}</span></p>
        <p className="text-muted">Default login: <span className="font-semibold text-ink">admin@crayon2couture.in</span> / <span className="font-semibold text-ink">admin123</span></p>
        <p className="mt-2 text-xs text-muted">
          Override with ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET env vars in production.
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { formatINR } from "@/lib/utils";

export default function CheckoutPage() {
  const { lines, subtotal, shipping, total, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState("");

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
        <div className="text-7xl">{"\ud83d\uded2"}</div>
        <h1 className="font-display text-3xl font-black">Nothing to check out</h1>
        <p className="text-muted">Add some cute things to your cart first.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-display text-sm font-bold text-white transition hover:bg-yellow hover:text-ink"
        >
          Shop now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setServerError("");
    setErrors({});

    const form = new FormData(e.currentTarget);
    const payload = {
      customerName: form.get("customerName"),
      customerPhone: form.get("customerPhone"),
      customerEmail: form.get("customerEmail") || "",
      address: form.get("address"),
      city: form.get("city"),
      state: form.get("state"),
      pincode: form.get("pincode"),
      lines: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.issues) setErrors(data.issues);
        else setServerError(data.error || "Order could not be placed.");
        setSubmitting(false);
        return;
      }
      clear();
      router.push(`/order-confirmation/${data.order.orderNumber}?o=${encodeURIComponent(JSON.stringify(data.order))}`);
    } catch {
      setServerError("Order could not be placed. Please try again.");
      setSubmitting(false);
    }
  };

  const field = (name: string) =>
    errors[name] ? errors[name][0] : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-display text-3xl font-black tracking-tight sm:text-4xl">
        Checkout
      </h1>

      <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Form */}
        <div className="space-y-5 rounded-2xl border border-line bg-white p-5">
          <div>
            <h2 className="font-display text-lg font-black">
              Delivery Details
            </h2>
            <p className="text-sm text-muted">
              Where should we send your cute order?
            </p>
          </div>

          {serverError && (
            <div className="rounded-xl bg-badge-sale/15 px-4 py-3 text-sm font-semibold text-badge-sale">
              {serverError}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" name="customerName" error={field("customerName")} />
            <Input
              label="Phone"
              name="customerPhone"
              type="tel"
              placeholder="10-digit mobile"
              error={field("customerPhone")}
            />
            <Input
              label="Email (optional)"
              name="customerEmail"
              type="email"
              error={field("customerEmail")}
            />
            <Input label="Pincode" name="pincode" placeholder="6 digits" error={field("pincode")} />
            <Input label="City" name="city" error={field("city")} />
            <Input label="State" name="state" error={field("state")} />
          </div>

          <Input
            label="Address"
            name="address"
            placeholder="House no, street, area, landmark"
            error={field("address")}
          />

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-yellow py-4 font-display text-sm font-bold text-ink transition hover:bg-yellow-deep disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Place Order {`\u2014 ${formatINR(total)}`}
          </button>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-line bg-cream p-5">
          <h2 className="font-display text-lg font-black">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {lines.map((line) => (
              <div key={line.slug} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col text-sm">
                  <span className="line-clamp-1 font-semibold">{line.name}</span>
                  <span className="text-muted">Qty {line.quantity}</span>
                </div>
                <span className="text-sm font-bold">
                  {formatINR(line.price * line.quantity)}
                </span>
              </div>
            ))}
          </div>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-semibold">{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="font-semibold">
                {shipping === 0 ? "FREE" : formatINR(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-black">
              <dt>Total</dt>
              <dd>{formatINR(total)}</dd>
            </div>
          </dl>
        </aside>
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-yellow-deep"
      />
      {error && <span className="mt-1 block text-xs text-badge-sale">{error}</span>}
    </label>
  );
}

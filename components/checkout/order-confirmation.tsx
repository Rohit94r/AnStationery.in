"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import { formatINR } from "@/lib/utils";

type Order = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: { name: string; price: number; quantity: number; image: string }[];
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  status: string;
};

const STEPS = [
  { key: "NEW", label: "Order Placed", icon: CheckCircle2 },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: Home },
];

export function OrderConfirmation() {
  const params = useParams<{ orderNumber: string }>();
  const search = useSearchParams();
  const orderNumber = params.orderNumber;

  let order: Order | null = null;
  try {
    const raw = search.get("o");
    if (raw) order = JSON.parse(raw) as Order;
  } catch {
    order = null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-pastel-mint text-3xl animate-pop">
          {"\ud83c\udf89"}
        </div>
        <h1 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-4xl">
          Order Placed Successfully!
        </h1>
        <p className="mt-1 text-muted">Thank you for shopping with us.</p>
        <p className="mt-3 rounded-full bg-yellow px-4 py-1.5 font-display text-sm font-black text-ink">
          Order #{orderNumber}
        </p>
      </div>

      {order ? (
        <>
          {/* Status timeline */}
          <div className="mt-8 rounded-2xl border border-line bg-white p-6">
            <h2 className="mb-4 font-display text-lg font-black">Order Status</h2>
            <ol className="flex justify-between">
              {STEPS.map((step, i) => {
                const active = i === 0;
                return (
                  <li key={step.key} className="flex flex-1 flex-col items-center gap-2 text-center">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-full ${
                        active ? "bg-yellow text-ink" : "bg-cream text-muted"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        active ? "text-ink" : "text-muted"
                      }`}
                    >
                      {step.label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span className="hidden">
                        <Truck className="h-3 w-3" />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Items */}
          <div className="mt-6 rounded-2xl border border-line bg-white p-6">
            <h2 className="mb-4 font-display text-lg font-black">Items</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col text-sm">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-muted">Qty {item.quantity}</span>
                  </div>
                  <span className="text-sm font-bold">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatINR(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd>
                  {order.shippingAmount === 0 ? "FREE" : formatINR(order.shippingAmount)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-black">
                <dt>Total</dt>
                <dd>{formatINR(order.totalAmount)}</dd>
              </div>
            </dl>
          </div>

          {/* Delivery */}
          <div className="mt-6 rounded-2xl border border-line bg-cream p-6">
            <h2 className="mb-2 font-display text-lg font-black">
              Delivery Address
            </h2>
            <p className="text-sm font-semibold">{order.customerName}</p>
            <p className="text-sm text-muted">{order.customerPhone}</p>
            {order.customerEmail && (
              <p className="text-sm text-muted">{order.customerEmail}</p>
            )}
            <p className="mt-1 text-sm text-muted">
              {order.address}, {order.city}, {order.state} - {order.pincode}
            </p>
          </div>
        </>
      ) : (
        <p className="mt-6 rounded-2xl border border-line bg-cream p-6 text-center text-sm text-muted">
          We&rsquo;ve received your order and will reach out shortly with
          updates.
        </p>
      )}

      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/shop"
          className="rounded-full bg-ink px-6 py-3 font-display text-sm font-bold text-white transition hover:bg-yellow hover:text-ink"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

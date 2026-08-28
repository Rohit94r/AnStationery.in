"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Truck } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { ORDER_STATUSES, STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type OrderItem = {
  id: string;
  productNameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  subtotal: number;
};

type Shipment = {
  id: string;
  courierName: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  status: string;
} | null;

export function OrderDetail({
  order,
}: {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    address: string;
    city: string;
    state: string;
    pincode: string;
    subtotal: number;
    shippingAmount: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
    shipment: Shipment;
  };
}) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [savingStatus, setSavingStatus] = useState(false);
  const [ship, setShip] = useState({
    courierName: order.shipment?.courierName ?? "",
    trackingNumber: order.shipment?.trackingNumber ?? "",
    trackingUrl: order.shipment?.trackingUrl ?? "",
  });
  const [savingShip, setSavingShip] = useState(false);
  const [msg, setMsg] = useState("");

  const updateStatus = async () => {
    setSavingStatus(true);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSavingStatus(false);
    setMsg("Status updated");
    router.refresh();
    setTimeout(() => setMsg(""), 2000);
  };

  const saveShipment = async () => {
    setSavingShip(true);
    await fetch(`/api/admin/orders/${order.id}/shipment`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...ship,
        status: ship.courierName && ship.trackingNumber ? "SHIPPED" : "PENDING",
      }),
    });
    setSavingShip(false);
    setMsg("Shipping info saved");
    router.refresh();
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="font-display text-2xl font-black">Order #{order.orderNumber}</h2>
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", STATUS_COLORS[order.status])}>
          {order.status}
        </span>
      </div>

      {msg && (
        <div className="rounded-xl bg-pastel-mint px-4 py-2 text-sm font-semibold text-ink">
          {msg}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: items + totals */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-white p-5">
            <h3 className="mb-3 font-display font-black">Items</h3>
            <div className="space-y-3">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-semibold">{it.productNameSnapshot}</p>
                    <p className="text-muted">
                      {formatINR(it.priceSnapshot)} {"\u00d7"} {it.quantity}
                    </p>
                  </div>
                  <span className="font-bold">{formatINR(it.subtotal)}</span>
                </div>
              ))}
            </div>
            <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              <Row label="Subtotal" value={formatINR(order.subtotal)} />
              <Row label="Shipping" value={order.shippingAmount === 0 ? "FREE" : formatINR(order.shippingAmount)} />
              <div className="flex justify-between border-t border-line pt-2 text-base font-black">
                <span>Total</span>
                <span>{formatINR(order.totalAmount)}</span>
              </div>
            </dl>
          </div>

          {/* Manual shipping */}
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-yellow-deep" />
              <h3 className="font-display font-black">Shipping & Tracking</h3>
            </div>
            <p className="mb-3 text-xs text-muted">
              Enter courier details manually. Order auto-advances to SHIPPED when both are set.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold">Courier Name</span>
                <input
                  value={ship.courierName}
                  onChange={(e) => setShip({ ...ship, courierName: e.target.value })}
                  placeholder="Delhivery"
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold">Tracking Number</span>
                <input
                  value={ship.trackingNumber}
                  onChange={(e) => setShip({ ...ship, trackingNumber: e.target.value })}
                  placeholder="123456789"
                  className={inputCls}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-semibold">Tracking URL (optional)</span>
                <input
                  value={ship.trackingUrl}
                  onChange={(e) => setShip({ ...ship, trackingUrl: e.target.value })}
                  placeholder="https://..."
                  className={inputCls}
                />
              </label>
            </div>
            <button
              onClick={saveShipment}
              disabled={savingShip}
              className="mt-3 flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white hover:bg-yellow hover:text-ink disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> Save Shipping
            </button>
            {order.shipment?.trackingNumber && (
              <p className="mt-2 text-xs text-muted">
                Current tracking: {order.shipment.trackingNumber} ({order.shipment.status})
              </p>
            )}
          </div>
        </div>

        {/* Right: customer + status */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-cream p-5">
            <h3 className="mb-3 font-display font-black">Customer</h3>
            <div className="space-y-1.5 text-sm">
              <p className="font-semibold">{order.customerName}</p>
              <p className="text-muted">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-muted">{order.customerEmail}</p>}
              <div className="mt-2 border-t border-line pt-2 text-muted">
                <p>{order.address}</p>
                <p>{order.city}, {order.state} - {order.pincode}</p>
              </div>
              <p className="mt-2 text-xs">
                Placed: {new Date(order.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h3 className="mb-3 font-display font-black">Update Status</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputCls}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={updateStatus}
              disabled={savingStatus || status === order.status}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-yellow py-2.5 text-sm font-bold text-ink hover:bg-yellow-deep disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted">
      <span>{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-yellow-deep";

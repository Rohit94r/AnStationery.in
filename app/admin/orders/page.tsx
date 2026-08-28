import Link from "next/link";
import { adminGetOrders } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";
import { ArrowRight, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

type RawOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
  total_amount: number;
  status: string;
  items: { id: string }[];
};

export default async function AdminOrdersPage() {
  const orders = (await adminGetOrders()) as RawOrder[];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl font-black">Orders</h2>
        <span className="rounded-full bg-yellow px-2.5 py-1 text-xs font-black text-ink">
          {orders.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-3 font-semibold">Order</th>
              <th className="px-3 py-3 font-semibold">Customer</th>
              <th className="px-3 py-3 font-semibold">Contact</th>
              <th className="px-3 py-3 font-semibold">Date</th>
              <th className="px-3 py-3 font-semibold">Items</th>
              <th className="px-3 py-3 font-semibold">Amount</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 text-right font-semibold">View</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-line/60 hover:bg-cream/50">
                <td className="px-3 py-3 font-semibold">
                  <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                    #{o.order_number}
                  </Link>
                </td>
                <td className="px-3 py-3">{o.customer_name}</td>
                <td className="px-3 py-3 text-muted">{o.customer_phone}</td>
                <td className="px-3 py-3 text-muted">
                  {new Date(o.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </td>
                <td className="px-3 py-3">{o.items.length}</td>
                <td className="px-3 py-3 font-bold">{formatINR(o.total_amount)}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold hover:bg-cream"
                  >
                    <Eye className="h-3.5 w-3.5" /> View <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-12 text-center text-muted">
                  <div className="text-4xl">{"\ud83d\udce6"}</div>
                  <p className="mt-2">No orders yet. They&rsquo;ll show up here when customers buy.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

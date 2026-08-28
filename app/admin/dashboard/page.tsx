import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  PackageX,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import { getDashboardStats } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, tint: "bg-pastel-sky" },
    { label: "New Orders", value: stats.newOrders, icon: TrendingUp, tint: "bg-yellow" },
    { label: "Total Products", value: stats.totalProducts, icon: Package, tint: "bg-pastel-mint" },
    { label: "Total Sales", value: formatINR(stats.totalSales), icon: IndianRupee, tint: "bg-pastel-lilac" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-black">Dashboard</h2>
        <p className="text-sm text-muted">Your store at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-white p-5">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.tint}`}>
              <c.icon className="h-5 w-5 text-ink" />
            </span>
            <p className="mt-3 font-display text-2xl font-black">{c.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      {/* Order status row */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          { label: "New", value: stats.newOrders, status: "NEW" },
          { label: "Confirmed", value: stats.confirmed, status: "CONFIRMED" },
          { label: "Processing", value: stats.processing, status: "PROCESSING" },
          { label: "Shipped", value: stats.shipped, status: "SHIPPED" },
          { label: "Delivered", value: stats.delivered, status: "DELIVERED" },
          { label: "Cancelled", value: stats.cancelled, status: "CANCELLED" },
        ].map((s) => (
          <div
            key={s.status}
            className={`rounded-xl px-3 py-3 text-center ${STATUS_COLORS[s.status]}`}
          >
            <p className="font-display text-xl font-black">{s.value}</p>
            <p className="text-[11px] font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Stock warnings */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-badge-hot" />
            <h3 className="font-display font-black">Low Stock ({stats.lowStock})</h3>
            <span className="ml-auto text-xs text-muted">
              {`<= ${stats.lowStockThreshold} left`}
            </span>
          </div>
          {stats.lowStockProducts.filter((p) => p.stock > 0).length === 0 ? (
            <p className="py-4 text-center text-sm text-muted">
              No low-stock products.
            </p>
          ) : (
            <ul className="space-y-2">
              {stats.lowStockProducts
                .filter((p) => p.stock > 0)
                .slice(0, 5)
                .map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-cream">
                      {p.images[0] && (
                        <Image
                          src={p.images[0].url}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="line-clamp-1 flex-1 text-sm font-semibold">
                      {p.name}
                    </span>
                    <span className="rounded-full bg-pastel-peach px-2.5 py-1 text-xs font-black text-ink">
                      {p.stock} left
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <PackageX className="h-5 w-5 text-badge-sale" />
            <h3 className="font-display font-black">Out of Stock ({stats.outOfStock})</h3>
            <Link
              href="/admin/products"
              className="ml-auto flex items-center gap-1 text-xs font-semibold text-yellow-deep hover:underline"
            >
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {stats.outOfStock === 0 ? (
            <p className="py-4 text-center text-sm text-muted">
              Everything is in stock.
            </p>
          ) : (
            <p className="text-sm text-muted">
              {stats.outOfStock} product(s) need restocking.{" "}
              <Link href="/admin/products" className="font-semibold text-yellow-deep hover:underline">
                Update stock {"\u2192"}
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-line bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display font-black">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-semibold text-yellow-deep hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="pb-2 pr-3 font-semibold">Order</th>
                  <th className="pb-2 pr-3 font-semibold">Customer</th>
                  <th className="pb-2 pr-3 font-semibold">Date</th>
                  <th className="pb-2 pr-3 font-semibold">Amount</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o: { id: string; order_number: string; customer_name: string; created_at: string; total_amount: number; status: string }) => (
                  <tr key={o.id} className="border-b border-line/60">
                    <td className="py-2.5 pr-3 font-semibold">
                      <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                        #{o.order_number}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-3">{o.customer_name}</td>
                    <td className="py-2.5 pr-3 text-muted">
                      {new Date(o.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                    <td className="py-2.5 pr-3 font-bold">{formatINR(o.total_amount)}</td>
                    <td className="py-2.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

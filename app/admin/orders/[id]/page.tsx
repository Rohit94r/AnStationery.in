import { notFound } from "next/navigation";
import { OrderDetail } from "@/components/admin/order-detail";
import { adminGetOrder } from "@/lib/data";

export const dynamic = "force-dynamic";

type RawOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shipping_amount: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: {
    id: string;
    product_name_snapshot: string;
    price_snapshot: number;
    quantity: number;
    subtotal: number;
  }[];
  shipment: {
    id: string;
    courier_name: string | null;
    tracking_number: string | null;
    tracking_url: string | null;
    status: string;
  } | null;
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = (await adminGetOrder(id)) as RawOrder | null;
  if (!order) notFound();

  return (
    <OrderDetail
      order={{
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        subtotal: order.subtotal,
        shippingAmount: order.shipping_amount,
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at,
        items: order.items.map((it) => ({
          id: it.id,
          productNameSnapshot: it.product_name_snapshot,
          priceSnapshot: it.price_snapshot,
          quantity: it.quantity,
          subtotal: it.subtotal,
        })),
        shipment: order.shipment
          ? {
              id: order.shipment.id,
              courierName: order.shipment.courier_name,
              trackingNumber: order.shipment.tracking_number,
              trackingUrl: order.shipment.tracking_url,
              status: order.shipment.status,
            }
          : null,
      }}
    />
  );
}

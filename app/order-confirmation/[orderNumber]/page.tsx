import { Suspense } from "react";
import { OrderConfirmation } from "@/components/checkout/order-confirmation";

export const metadata = {
  title: "Order Confirmation",
};

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-24 text-center text-muted">
          Loading...
        </div>
      }
    >
      <OrderConfirmation />
    </Suspense>
  );
}

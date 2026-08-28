import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { SITE } from "@/lib/constants";

const LineSchema = z.object({
  slug: z.string().min(1),
  quantity: z.number().int().min(1).max(999),
});

const OrderSchema = z.object({
  customerName: z.string().min(2, "Please enter your full name"),
  customerPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  customerEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
  address: z.string().min(8, "Please enter a complete address"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please enter your state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  lines: z.array(LineSchema).min(1, "Your cart is empty"),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = OrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Call the create_order RPC (atomic: validates stock, creates order,
  // creates items with snapshots, decrements stock — all in one transaction)
  const { data: order, error } = await supabase.rpc("create_order", {
    p_customer_name: data.customerName,
    p_customer_phone: data.customerPhone,
    p_customer_email: data.customerEmail || "",
    p_address: data.address,
    p_city: data.city,
    p_state: data.state,
    p_pincode: data.pincode,
    p_lines: data.lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
    p_shipping_threshold: SITE.freeShippingThreshold,
    p_shipping_fee: SITE.shippingFee,
  });

  if (error) {
    const msg = error.message ?? "Order could not be placed.";
    // Check if it's a stock/validation error
    const isStockError = msg.includes("available") || msg.includes("not available");
    return NextResponse.json(
      { error: msg },
      { status: isStockError ? 409 : 500 },
    );
  }

  return NextResponse.json({ order }, { status: 201 });
}

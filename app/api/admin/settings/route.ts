import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("site_config").select("key, value");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const config: Record<string, string> = {};
  for (const row of data ?? []) {
    config[row.key] = row.value;
  }
  return NextResponse.json({ config });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as Record<string, string>;

  const rows = Object.entries(body).map(([key, value]) => ({ key, value: String(value) }));

  for (const row of rows) {
    const { data: existing } = await supabase
      .from("site_config")
      .select("id")
      .eq("key", row.key)
      .maybeSingle();

    if (existing) {
      await supabase.from("site_config").update({ value: row.value }).eq("key", row.key);
    } else {
      await supabase.from("site_config").insert({ key: row.key, value: row.value });
    }
  }
  return NextResponse.json({ ok: true });
}

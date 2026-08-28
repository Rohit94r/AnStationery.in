import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import type { Product, Category } from "@/types";
import * as dummy from "@/lib/dummy-data";

const LOW_STOCK_THRESHOLD = 5;

/* ---------- mappers (snake_case DB → camelCase TS) ---------- */

type RawProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  stock: number;
  sku: string | null;
  badge: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_trending: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  rating: number;
  review_count: number;
  deleted_at: string | null;
  category_id: string | null;
  created_at: string;
  images?: RawImage[];
  category?: { slug: string } | null;
};

type RawImage = {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary: boolean;
};

function mapProduct(r: RawProduct): Product {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    price: r.price,
    originalPrice: r.original_price,
    stock: r.stock,
    sku: r.sku ?? undefined,
    badge: (r.badge as Product["badge"]) ?? null,
    isActive: r.is_active,
    isFeatured: r.is_featured,
    isTrending: r.is_trending,
    isNew: r.is_new,
    isBestSeller: r.is_best_seller,
    categorySlug: r.category?.slug ?? "",
    images: (r.images ?? []).map((im) => ({
      id: im.id,
      url: im.url,
      alt: im.alt ?? im.url,
      sortOrder: im.sort_order,
      isPrimary: im.is_primary,
    })),
    rating: r.rating,
    reviewCount: r.review_count,
    createdAt: r.created_at,
  };
}

const PRODUCT_SELECT = "*, images:product_images(*), category:categories(slug)";

/* ---------- storefront: products ---------- */

export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return dummy.getAllProducts();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error || !data) return dummy.getAllProducts();
  return (data as RawProduct[]).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured) return dummy.getProductBySlug(slug) ?? null;
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();
  if (error || !data) return dummy.getProductBySlug(slug) ?? null;
  return mapProduct(data as RawProduct);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  if (!isSupabaseConfigured) return dummy.getProductsByCategory(slug);
  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .single();
  if (!cat) return [];
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .is("deleted_at", null)
    .eq("category_id", cat.id)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as RawProduct[]).map(mapProduct);
}

export async function getTrending(): Promise<Product[]> {
  if (!isSupabaseConfigured) return dummy.getTrending();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .is("deleted_at", null)
    .eq("is_trending", true)
    .order("review_count", { ascending: false });
  if (error || !data) return dummy.getTrending();
  return (data as RawProduct[]).map(mapProduct);
}

export async function getNewArrivals(): Promise<Product[]> {
  if (!isSupabaseConfigured) return dummy.getNewArrivals();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .is("deleted_at", null)
    .eq("is_new", true)
    .order("created_at", { ascending: false });
  if (error || !data) return dummy.getNewArrivals();
  return (data as RawProduct[]).map(mapProduct);
}

export async function getBestSellers(): Promise<Product[]> {
  if (!isSupabaseConfigured) return dummy.getBestSellers();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .is("deleted_at", null)
    .eq("is_best_seller", true)
    .order("review_count", { ascending: false });
  if (error || !data) return dummy.getBestSellers();
  return (data as RawProduct[]).map(mapProduct);
}

export async function getFeatured(): Promise<Product[]> {
  if (!isSupabaseConfigured) return dummy.getFeatured();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .is("deleted_at", null)
    .eq("is_featured", true)
    .order("review_count", { ascending: false });
  if (error || !data) return dummy.getFeatured();
  return (data as RawProduct[]).map(mapProduct);
}

export async function getPerfectGifts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return dummy.getPerfectGifts();
  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", "gifts")
    .single();
  const catId = cat?.id;
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .is("deleted_at", null)
    .or("is_featured.eq.true");
  if (catId) query = query.or(`category_id.eq.${catId}`);
  const { data, error } = await query.order("review_count", { ascending: false });
  if (error || !data) return dummy.getPerfectGifts();
  return (data as RawProduct[]).map(mapProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!isSupabaseConfigured) return dummy.searchProducts(query);
  const q = query.trim();
  if (!q) return [];
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .is("deleted_at", null)
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as RawProduct[]).map(mapProduct);
}

/* ---------- storefront: categories ---------- */

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return dummy.categories;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });
  if (error || !data) return dummy.categories;
  return (data as { id: string; name: string; slug: string; emoji: string | null; description: string | null; accent: string | null }[]).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    emoji: c.emoji ?? "",
    description: c.description ?? "",
    accent: c.accent ?? "pastel-sky",
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSupabaseConfigured) return dummy.getCategoryBySlug(slug) ?? null;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return dummy.getCategoryBySlug(slug) ?? null;
  const c = data as { id: string; name: string; slug: string; emoji: string | null; description: string | null; accent: string | null };
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    emoji: c.emoji ?? "",
    description: c.description ?? "",
    accent: c.accent ?? "pastel-sky",
  };
}

export async function getCategoryCounts() {
  if (!isSupabaseConfigured) return dummy.getCategoryCounts();
  const { data: cats } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });
  if (!cats) return dummy.getCategoryCounts();

  const result = [];
  for (const c of cats as { id: string; name: string; slug: string; emoji: string | null; description: string | null; accent: string | null }[]) {
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .is("deleted_at", null)
      .eq("category_id", c.id);
    result.push({
      id: c.id,
      name: c.name,
      slug: c.slug,
      emoji: c.emoji ?? "",
      description: c.description ?? "",
      accent: c.accent ?? "pastel-sky",
      count: count ?? 0,
    });
  }
  return result;
}

/* ---------- storefront: banners / reviews ---------- */

export async function getActiveBanners() {
  if (!isSupabaseConfigured) return dummy.getActiveBanners();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return dummy.getActiveBanners();
  return (data as { id: string; title: string; subtitle: string | null; button_text: string | null; button_url: string | null; variant: string }[]).map((b) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle ?? "",
    buttonText: b.button_text ?? "",
    buttonUrl: b.button_url ?? "/shop",
    variant: b.variant as "yellow" | "cream" | "photo" | "pastel",
  }));
}

export async function getActiveReviews() {
  if (!isSupabaseConfigured) return dummy.reviews;
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error || !data) return dummy.reviews;
  return (data as { id: string; name: string; city: string | null; rating: number; text: string; product: string | null }[]).map((r) => ({
    id: r.id,
    name: r.name,
    city: r.city ?? "",
    rating: r.rating,
    text: r.text,
    product: r.product ?? "",
  }));
}

/* ---------- admin: products ---------- */

export async function adminGetProducts() {
  if (!isSupabaseConfigured) return dummy.getAllProducts();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as RawProduct[]).map(mapProduct);
}

export async function adminGetProductById(id: string) {
  if (!isSupabaseConfigured) return dummy.products.find((p) => p.id === id) ?? null;
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return mapProduct(data as RawProduct);
}

export async function adminGetProductForEdit(id: string) {
  const p = await adminGetProductById(id);
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    stock: p.stock,
    sku: p.sku ?? null,
    badge: p.badge ?? null,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    isTrending: p.isTrending,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    categoryId: null,
    images: p.images.map((im) => ({ id: im.id, url: im.url, isPrimary: im.isPrimary })),
  };
}

export async function adminCreateProduct(input: {
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  sku?: string | null;
  badge?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  categoryId?: string | null;
  images: { url: string; isPrimary: boolean }[];
}) {
  const base = slugify(input.name) || `product-${Date.now()}`;
  let uniqueSlug = base;
  let n = 1;
  while (true) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", uniqueSlug)
      .maybeSingle();
    if (!existing) break;
    uniqueSlug = `${base}-${n++}`;
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      slug: uniqueSlug,
      description: input.description,
      price: input.price,
      original_price: input.originalPrice ?? null,
      stock: input.stock,
      sku: input.sku ?? null,
      badge: input.badge ?? null,
      is_active: input.isActive,
      is_featured: input.isFeatured,
      is_trending: input.isTrending,
      is_new: input.isNew,
      is_best_seller: input.isBestSeller,
      category_id: input.categoryId ?? null,
      rating: 0,
      review_count: 0,
    })
    .select()
    .single();

  if (error || !product) throw new Error(error?.message ?? "Failed to create product");

  if (input.images.length > 0) {
    const imageRows = input.images.map((im, i) => ({
      product_id: product.id,
      url: im.url,
      sort_order: i,
      is_primary: im.isPrimary,
    }));
    await supabase.from("product_images").insert(imageRows);
  }

  return product;
}

export async function adminUpdateProduct(
  id: string,
  input: {
    name: string;
    description: string;
    price: number;
    originalPrice?: number | null;
    stock: number;
    sku?: string | null;
    badge?: string | null;
    isActive: boolean;
    isFeatured: boolean;
    isTrending: boolean;
    isNew: boolean;
    isBestSeller: boolean;
    categoryId?: string | null;
  },
) {
  const { error } = await supabase
    .from("products")
    .update({
      name: input.name,
      description: input.description,
      price: input.price,
      original_price: input.originalPrice ?? null,
      stock: input.stock,
      sku: input.sku ?? null,
      badge: input.badge ?? null,
      is_active: input.isActive,
      is_featured: input.isFeatured,
      is_trending: input.isTrending,
      is_new: input.isNew,
      is_best_seller: input.isBestSeller,
      category_id: input.categoryId ?? null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminUpdateStock(id: string, stock: number) {
  await supabase.from("products").update({ stock: Math.max(0, stock) }).eq("id", id);
}

export async function adminSoftDeleteProduct(id: string) {
  await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id);
}

export async function adminReplaceImages(
  productId: string,
  images: { url: string; isPrimary: boolean }[],
) {
  await supabase.from("product_images").delete().eq("product_id", productId);
  if (images.length > 0) {
    await supabase.from("product_images").insert(
      images.map((im, i) => ({
        product_id: productId,
        url: im.url,
        sort_order: i,
        is_primary: im.isPrimary,
      })),
    );
  }
}

/* ---------- admin: categories ---------- */

export async function adminGetCategories() {
  if (!isSupabaseConfigured) return dummy.categories.map((c) => ({ ...c, _count: { products: dummy.getProductsByCategory(c.slug).length } }));
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });
  if (error || !data) return [];

  const result = [];
  for (const c of data as { id: string; name: string; slug: string; emoji: string | null; description: string | null; accent: string | null; is_active: boolean }[]) {
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("category_id", c.id);
    result.push({
      id: c.id,
      name: c.name,
      slug: c.slug,
      emoji: c.emoji,
      description: c.description,
      accent: c.accent,
      is_active: c.is_active,
      _count: { products: count ?? 0 },
    });
  }
  return result;
}

export async function adminCreateCategory(input: {
  name: string;
  emoji?: string;
  description?: string;
  accent?: string;
  image?: string;
}) {
  const base = slugify(input.name) || `cat-${Date.now()}`;
  let uniqueSlug = base;
  let n = 1;
  while (true) {
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", uniqueSlug)
      .maybeSingle();
    if (!existing) break;
    uniqueSlug = `${base}-${n++}`;
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: input.name,
      slug: uniqueSlug,
      emoji: input.emoji ?? null,
      description: input.description ?? null,
      accent: input.accent ?? null,
      image: input.image ?? null,
      is_active: true,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminUpdateCategory(
  id: string,
  input: {
    name: string;
    emoji?: string;
    description?: string;
    accent?: string;
    image?: string;
    isActive: boolean;
  },
) {
  await supabase
    .from("categories")
    .update({
      name: input.name,
      emoji: input.emoji ?? null,
      description: input.description ?? null,
      accent: input.accent ?? null,
      image: input.image ?? null,
      is_active: input.isActive,
    })
    .eq("id", id);
}

export async function adminDeleteCategory(id: string) {
  await supabase.from("products").update({ category_id: null }).eq("category_id", id);
  await supabase.from("categories").delete().eq("id", id);
}

/* ---------- admin: orders ---------- */

export async function adminGetOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*), shipment:shipments(*)")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function adminGetOrder(id: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*), shipment:shipments(*)")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data;
}

export async function adminGetOrderByNumber(orderNumber: string) {
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*), shipment:shipments(*)")
    .eq("order_number", orderNumber)
    .single();
  return data;
}

export async function adminUpdateOrderStatus(id: string, status: string) {
  await supabase.from("orders").update({ status }).eq("id", id);
}

export async function adminUpdateShipment(
  orderId: string,
  input: { courierName?: string; trackingNumber?: string; trackingUrl?: string; status?: string },
) {
  const { data: existing } = await supabase
    .from("shipments")
    .select("id")
    .eq("order_id", orderId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("shipments")
      .update({
        courier_name: input.courierName ?? null,
        tracking_number: input.trackingNumber ?? null,
        tracking_url: input.trackingUrl ?? null,
        status: input.status ?? "PENDING",
      })
      .eq("order_id", orderId);
  } else {
    await supabase.from("shipments").insert({
      order_id: orderId,
      courier_name: input.courierName ?? null,
      tracking_number: input.trackingNumber ?? null,
      tracking_url: input.trackingUrl ?? null,
      status: input.status ?? "PENDING",
    });
  }
}

/* ---------- admin: banners ---------- */

export async function adminGetBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data;
}

export async function adminCreateBanner(input: {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  variant?: string;
  isActive: boolean;
  sortOrder: number;
}) {
  const { data, error } = await supabase
    .from("banners")
    .insert({
      title: input.title,
      subtitle: input.subtitle ?? null,
      image_url: input.imageUrl ?? null,
      button_text: input.buttonText ?? null,
      button_url: input.buttonUrl ?? null,
      variant: input.variant ?? "yellow",
      is_active: input.isActive,
      sort_order: input.sortOrder,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminUpdateBanner(
  id: string,
  input: {
    title: string;
    subtitle?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    variant?: string;
    isActive: boolean;
    sortOrder: number;
  },
) {
  await supabase
    .from("banners")
    .update({
      title: input.title,
      subtitle: input.subtitle ?? null,
      image_url: input.imageUrl ?? null,
      button_text: input.buttonText ?? null,
      button_url: input.buttonUrl ?? null,
      variant: input.variant ?? "yellow",
      is_active: input.isActive,
      sort_order: input.sortOrder,
    })
    .eq("id", id);
}

export async function adminDeleteBanner(id: string) {
  await supabase.from("banners").delete().eq("id", id);
}

/* ---------- admin: dashboard stats ---------- */

export async function getDashboardStats() {
  const { data: products } = await supabase
    .from("products")
    .select("id, stock, name, deleted_at, is_active, is_featured, is_trending, is_new, is_best_seller")
    .is("deleted_at", null);

  const activeProducts = (products ?? []).filter((p) => p.is_active);
  const totalProducts = (products ?? []).length;
  const lowStock = activeProducts.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length;
  const outOfStock = activeProducts.filter((p) => p.stock === 0).length;

  const { data: orders } = await supabase.from("orders").select("id, status, total_amount, created_at, customer_name, order_number, items:order_items(id)");

  const allOrders = orders ?? [];
  const totalOrders = allOrders.length;
  const newOrders = allOrders.filter((o) => o.status === "NEW").length;
  const confirmed = allOrders.filter((o) => o.status === "CONFIRMED").length;
  const processing = allOrders.filter((o) => o.status === "PROCESSING").length;
  const shipped = allOrders.filter((o) => o.status === "SHIPPED").length;
  const delivered = allOrders.filter((o) => o.status === "DELIVERED").length;
  const cancelled = allOrders.filter((o) => o.status === "CANCELLED").length;
  const totalSales = allOrders.filter((o) => o.status !== "CANCELLED").reduce((s, o) => s + (o.total_amount ?? 0), 0);

  const recentOrders = allOrders
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  const { data: lowStockRows } = await supabase
    .from("products")
    .select("*, images:product_images(*)")
    .is("deleted_at", null)
    .lte("stock", LOW_STOCK_THRESHOLD)
    .order("stock", { ascending: true })
    .limit(8);

  return {
    totalProducts,
    lowStock,
    outOfStock,
    totalOrders,
    newOrders,
    confirmed,
    processing,
    shipped,
    delivered,
    cancelled,
    totalSales,
    recentOrders,
    lowStockProducts: (lowStockRows ?? []) as unknown as { id: string; name: string; stock: number; images: { url: string }[] }[],
    lowStockThreshold: LOW_STOCK_THRESHOLD,
  };
}

export { LOW_STOCK_THRESHOLD };

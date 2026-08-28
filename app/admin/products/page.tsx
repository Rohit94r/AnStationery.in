import { ProductsTable } from "@/components/admin/products-table";
import { adminGetProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await adminGetProducts();
  return <ProductsTable products={products} />;
}

import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";
import { ProductSection } from "@/components/products/product-section";
import {
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/data";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  // prerender is handled at request time with revalidate; params derived from DB
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${SITE.name}`,
      description: product.description,
      images: [product.images[0]?.url ?? ""],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = await getCategoryBySlug(product.categorySlug);
  const related = (await getProductsByCategory(product.categorySlug)).filter(
    (p) => p.id !== product.id,
  );

  return (
    <>
      <ProductDetail product={product} />
      {related.length > 0 && (
        <ProductSection
          eyebrow={category ? category.name : "more cute things"}
          title="You May Also Like"
          products={related.slice(0, 4)}
          viewAllHref="/shop"
        />
      )}
    </>
  );
}

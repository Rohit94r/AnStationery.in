import { Hero } from "@/components/home/hero";
import { PromoBanners } from "@/components/home/promo-banners";
import { Categories } from "@/components/home/categories";
import { Stats } from "@/components/home/stats";
import { GiftFeature } from "@/components/home/gift-feature";
import { Benefits } from "@/components/home/benefits";
import { Reviews } from "@/components/home/reviews";
import { InstagramSection } from "@/components/home/instagram";
import { ProductSection } from "@/components/products/product-section";
import {
  getActiveBanners,
  getActiveReviews,
  getAllProducts,
  getBestSellers,
  getCategoryCounts,
  getFeatured,
  getNewArrivals,
  getPerfectGifts,
  getTrending,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    trending,
    bestSellers,
    newArrivals,
    freshDrops,
    gift,
    banners,
    reviews,
    counts,
    allProducts,
  ] = await Promise.all([
    getTrending(),
    getBestSellers(),
    getNewArrivals(),
    getFeatured(),
    getPerfectGifts(),
    getActiveBanners(),
    getActiveReviews(),
    getCategoryCounts(),
    getAllProducts(),
  ]);

  const totalCount = counts.reduce((s, c) => s + c.count, 0);
  const categoryCards = [
    { id: "all", name: "All Products", slug: "shop", emoji: "\ud83d\udecd\ufe0f", accent: "pastel-sky", count: totalCount },
    { id: "trending", name: "Trending", slug: "trending", emoji: "\ud83d\udd25", accent: "pastel-pink", count: trending.length },
    { id: "new", name: "New Arrivals", slug: "new", emoji: "\u2728", accent: "pastel-mint", count: newArrivals.length },
    ...counts.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      emoji: c.emoji,
      accent: c.accent,
      count: c.count,
    })),
  ];

  return (
    <>
      <Hero products={allProducts.slice(0, 3)} />
      <PromoBanners banners={banners} />
      <Categories cards={categoryCards} />

      <ProductSection
        eyebrow="trending right now"
        title="Trending Right Now"
        subtitle="What everyone is loving this week"
        products={trending.slice(0, 4)}
        viewAllHref="/trending"
      />

      <GiftFeature product={gift[0]} />

      <ProductSection
        eyebrow="fan favourites"
        title="Best Sellers"
        subtitle="Tried, tested & totally adored"
        products={bestSellers.slice(0, 4)}
        viewAllHref="/shop"
      />

      <ProductSection
        eyebrow="fresh in store"
        title="New Arrivals"
        subtitle="Just landed & waiting for you"
        products={newArrivals.slice(0, 4)}
        viewAllHref="/new"
      />

      <Stats />

      <ProductSection
        eyebrow="handpicked for you"
        title="Fresh Drops"
        subtitle="Featured picks you can&rsquo;t miss"
        products={freshDrops.slice(0, 4)}
        viewAllHref="/shop"
      />

      <Reviews reviews={reviews} />
      <Benefits />
      <InstagramSection />
    </>
  );
}

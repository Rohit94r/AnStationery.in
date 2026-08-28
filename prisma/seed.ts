import { PrismaClient } from "@prisma/client";
import {
  banners,
  categories,
  products,
  reviews,
} from "../lib/dummy-data";
import { SITE } from "../lib/constants";

const prisma = new PrismaClient();

async function main() {
  // Clean (reverse dependency order)
  await prisma.orderItem.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.review.deleteMany();
  await prisma.siteConfig.deleteMany();

  // Categories
  const catMap = new Map<string, string>();
  for (const c of categories) {
    const created = await prisma.category.create({
      data: {
        name: c.name,
        slug: c.slug,
        emoji: c.emoji,
        description: c.description,
        accent: c.accent,
        isActive: true,
      },
    });
    catMap.set(c.slug, created.id);
  }

  // Products + images (multi-image)
  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
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
        rating: p.rating,
        reviewCount: p.reviewCount,
        categoryId: catMap.get(p.categorySlug) ?? null,
        images: {
          create: p.images.map((im) => ({
            url: im.url,
            alt: im.alt,
            sortOrder: im.sortOrder,
            isPrimary: im.isPrimary,
          })),
        },
      },
    });
  }

  // Banners
  for (const b of banners) {
    await prisma.banner.create({
      data: {
        title: b.title,
        subtitle: b.subtitle,
        imageUrl: b.imageUrl ?? null,
        buttonText: b.buttonText,
        buttonUrl: b.buttonUrl,
        variant: b.variant,
        isActive: b.isActive,
        sortOrder: b.sortOrder,
      },
    });
  }

  // Reviews
  for (const r of reviews) {
    await prisma.review.create({
      data: {
        name: r.name,
        city: r.city,
        rating: r.rating,
        text: r.text,
        product: r.product,
        isActive: true,
      },
    });
  }

  // Site config (single source of truth)
  const config: Record<string, string> = {
    name: SITE.name,
    tagline: SITE.tagline,
    description: SITE.description,
    email: SITE.email,
    phone: SITE.phone,
    whatsapp: SITE.whatsapp,
    instagram: SITE.instagram,
    instagramHandle: SITE.instagramHandle,
    address: SITE.address,
    freeShippingThreshold: String(SITE.freeShippingThreshold),
    shippingFee: String(SITE.shippingFee),
  };
  for (const [key, value] of Object.entries(config)) {
    await prisma.siteConfig.create({ data: { key, value } });
  }

  console.log("Seed complete");
  console.log(`  categories: ${categories.length}`);
  console.log(`  products:   ${products.length}`);
  console.log(`  banners:    ${banners.length}`);
  console.log(`  reviews:    ${reviews.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

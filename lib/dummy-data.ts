import type { Banner, Category, Product, Review } from "@/types";

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const img = (
  id: string,
  alt: string,
  sortOrder: number,
  isPrimary = false,
  w = 900,
) => ({
  id: `${id}-${sortOrder}`,
  url: u(id, w),
  alt,
  sortOrder,
  isPrimary,
});

export const categories: Category[] = [
  {
    id: "cat-diaries",
    name: "Diaries",
    slug: "diaries",
    emoji: "\ud83d\udcd3",
    description: "Aesthetic journals & planners",
    accent: "pastel-pink",
  },
  {
    id: "cat-stationery",
    name: "Stationery",
    slug: "stationery",
    emoji: "\u270f\ufe0f",
    description: "Pens, pencils & desk cute",
    accent: "pastel-mint",
  },
  {
    id: "cat-gifts",
    name: "Gifts",
    slug: "gifts",
    emoji: "\ud83c\udf81",
    description: "Ready-to-gift cute boxes",
    accent: "pastel-lilac",
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    emoji: "\ud83c\udf92",
    description: "Stickers, pouches & more",
    accent: "pastel-peach",
  },
  {
    id: "cat-desk",
    name: "Desk",
    slug: "desk",
    emoji: "\ud83d\udcbb",
    description: "Workspace cuteness",
    accent: "pastel-sky",
  },
];

const P = (
  p: Omit<Product, "images"> & { imageIds: string[]; primaryIndex?: number },
): Product => {
  const { imageIds, primaryIndex = 0, ...rest } = p;
  return {
    ...rest,
    images: imageIds.map((id, i) =>
      img(id, `${p.name} view ${i + 1}`, i, i === primaryIndex),
    ),
  };
};

export const products: Product[] = [
  P({
    id: "p1",
    name: "Aesthetic Floral Journal",
    slug: "aesthetic-floral-journal",
    description:
      "A beautifully crafted A5 journal with hand-drawn floral cover, 160 GSM cream pages, ribbon bookmark and lay-flat binding. Perfect for journaling, notes and doodles.",
    price: 399,
    originalPrice: 499,
    stock: 25,
    sku: "C2C-DIARY-001",
    badge: "SALE",
    isActive: true,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    isBestSeller: true,
    categorySlug: "diaries",
    rating: 4.8,
    reviewCount: 106,
    createdAt: "2026-07-10T00:00:00.000Z",
    imageIds: [
      "1531346878377-a5be20888e57",
      "1455390582262-044cdead277a",
      "1517842645767-c639042777db",
      "1544816155-12df9643f363",
    ],
  }),
  P({
    id: "p2",
    name: "Pastel Dream Planner",
    slug: "pastel-dream-planner",
    description:
      "Undated daily planner with pastel section dividers, habit trackers, monthly goals and sticker sheet. Plan your cutest year yet.",
    price: 549,
    originalPrice: 699,
    stock: 18,
    sku: "C2C-DIARY-002",
    badge: "HOT",
    isActive: true,
    isFeatured: false,
    isTrending: true,
    isNew: true,
    isBestSeller: false,
    categorySlug: "diaries",
    rating: 4.7,
    reviewCount: 64,
    createdAt: "2026-08-01T00:00:00.000Z",
    imageIds: [
      "1455390582262-044cdead277a",
      "1503676263721-b1a42a1f5f0e",
      "1517842645767-c639042777db",
    ],
  }),
  P({
    id: "p3",
    name: "Cute Stationery Gift Box",
    slug: "cute-stationery-gift-box",
    description:
      "Complete aesthetic stationery set with binder, pens, stickers, washi tape and a handwritten note card. The perfect gift for someone special, ready to gift.",
    price: 799,
    originalPrice: 999,
    stock: 12,
    sku: "C2C-GIFT-001",
    badge: "BESTSELLER",
    isActive: true,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    isBestSeller: true,
    categorySlug: "gifts",
    rating: 4.9,
    reviewCount: 211,
    createdAt: "2026-06-20T00:00:00.000Z",
    imageIds: [
      "1513885535751-8b9238bd345a",
      "1503676263721-b1a42a1f5f0e",
      "1583485088034-694b469c0859",
      "1531346878377-a5be20888e57",
    ],
  }),
  P({
    id: "p4",
    name: "Rainbow Gel Pen Set",
    slug: "rainbow-gel-pen-set",
    description:
      "Set of 12 smooth-flow gel pens in pastel rainbow shades. Quick-drying, smudge-free ink that glides on paper.",
    price: 249,
    originalPrice: 349,
    stock: 40,
    sku: "C2C-STAT-001",
    badge: "NEW",
    isActive: true,
    isFeatured: false,
    isTrending: false,
    isNew: true,
    isBestSeller: false,
    categorySlug: "stationery",
    rating: 4.6,
    reviewCount: 38,
    createdAt: "2026-08-15T00:00:00.000Z",
    imageIds: [
      "1583485088034-694b469c0859",
      "1456735190827-d1262f71b8a3",
      "1517849845537-4d257902454a",
    ],
  }),
  P({
    id: "p5",
    name: "Kawaii Sticker Pack",
    slug: "kawaii-sticker-pack",
    description:
      "100+ waterproof cute stickers featuring doodles, stars, plants and smileys. Perfect for laptops, journals and phone cases.",
    price: 199,
    stock: 60,
    sku: "C2C-ACC-001",
    badge: "TRENDING",
    isActive: true,
    isFeatured: false,
    isTrending: true,
    isNew: true,
    isBestSeller: false,
    categorySlug: "accessories",
    rating: 4.8,
    reviewCount: 92,
    createdAt: "2026-08-10T00:00:00.000Z",
    imageIds: [
      "1611532736597-de2d4265fba3",
      "1635274322629-90e95c4b5f6a",
      "1503676263721-b1a42a1f5f0e",
    ],
  }),
  P({
    id: "p6",
    name: "Mini Doodle Notebook (Pack of 3)",
    slug: "mini-doodle-notebook-pack-3",
    description:
      "A pack of three pocket-sized doodle notebooks with cute covers. Ideal for on-the-go notes, lists and sketches.",
    price: 299,
    originalPrice: 399,
    stock: 33,
    sku: "C2C-DIARY-003",
    badge: "SALE",
    isActive: true,
    isFeatured: false,
    isTrending: false,
    isNew: true,
    isBestSeller: true,
    categorySlug: "diaries",
    rating: 4.7,
    reviewCount: 47,
    createdAt: "2026-08-05T00:00:00.000Z",
    imageIds: [
      "1544816155-12df9643f363",
      "1531346878377-a5be20888e57",
      "1503454537195-1dc81782c7c1",
    ],
  }),
  P({
    id: "p7",
    name: "Cloud Washi Tape Collection",
    slug: "cloud-washi-tape-collection",
    description:
      "Set of 8 decorative washi tapes in cloud, star and floral patterns. Add a cute touch to your journals and crafts.",
    price: 179,
    stock: 0,
    sku: "C2C-ACC-002",
    badge: "SOLD OUT",
    isActive: true,
    isFeatured: false,
    isTrending: true,
    isNew: false,
    isBestSeller: false,
    categorySlug: "accessories",
    rating: 4.9,
    reviewCount: 73,
    createdAt: "2026-07-25T00:00:00.000Z",
    imageIds: [
      "1635274322629-90e95c4b5f6a",
      "1611532736597-de2d4265fba3",
    ],
  }),
  P({
    id: "p8",
    name: "Star Dust Highlighters (6pc)",
    slug: "star-dust-highlighters-6pc",
    description:
      "Six soft pastel highlighters with a mild, gentle ink. Perfect for colour-coding notes without bleeding through pages.",
    price: 219,
    originalPrice: 299,
    stock: 7,
    sku: "C2C-STAT-002",
    badge: "HOT",
    isActive: true,
    isFeatured: false,
    isTrending: true,
    isNew: false,
    isBestSeller: false,
    categorySlug: "stationery",
    rating: 4.5,
    reviewCount: 29,
    createdAt: "2026-07-18T00:00:00.000Z",
    imageIds: [
      "1517849845537-4d257902454a",
      "1456735190827-d1262f71b8a3",
      "1583485088034-694b469c0859",
    ],
  }),
  P({
    id: "p9",
    name: "Cozy Desk Organiser Set",
    slug: "cozy-desk-organiser-set",
    description:
      "Pastel desk organiser with compartments for pens, sticky notes and clips. Keep your workspace tidy and cute.",
    price: 649,
    originalPrice: 799,
    stock: 15,
    sku: "C2C-DESK-001",
    badge: "NEW",
    isActive: true,
    isFeatured: true,
    isTrending: false,
    isNew: true,
    isBestSeller: false,
    categorySlug: "desk",
    rating: 4.7,
    reviewCount: 41,
    createdAt: "2026-08-12T00:00:00.000Z",
    imageIds: [
      "1503454537195-1dc81782c7c1",
      "1503676263721-b1a42a1f5f0e",
      "1517842645767-c639042777db",
    ],
  }),
  P({
    id: "p10",
    name: "Birthday Surprise Gift Hamper",
    slug: "birthday-surprise-gift-hamper",
    description:
      "A curated birthday hamper with a journal, pens, stickers, chocolates and a personalised note. Delivered gift-ready.",
    price: 1099,
    originalPrice: 1399,
    stock: 9,
    sku: "C2C-GIFT-002",
    badge: "BESTSELLER",
    isActive: true,
    isFeatured: true,
    isTrending: false,
    isNew: false,
    isBestSeller: true,
    categorySlug: "gifts",
    rating: 4.9,
    reviewCount: 158,
    createdAt: "2026-06-30T00:00:00.000Z",
    imageIds: [
      "1513885535751-8b9238bd345a",
      "1544816155-12df9643f363",
      "1531346878377-a5be20888e57",
      "1583485088034-694b469c0859",
    ],
  }),
  P({
    id: "p11",
    name: "Mint Green Pencil Pouch",
    slug: "mint-green-pencil-pouch",
    description:
      "Soft mint canvas pencil pouch with a cute smiley embroidered. Roomy enough for all your favourite pens.",
    price: 279,
    stock: 28,
    sku: "C2C-ACC-003",
    badge: "TRENDING",
    isActive: true,
    isFeatured: false,
    isTrending: true,
    isNew: true,
    isBestSeller: false,
    categorySlug: "accessories",
    rating: 4.6,
    reviewCount: 35,
    createdAt: "2026-08-08T00:00:00.000Z",
    imageIds: [
      "1503676263721-b1a42a1f5f0e",
      "1503454537195-1dc81782c7c1",
      "1456735190827-d1262f71b8a3",
    ],
  }),
  P({
    id: "p12",
    name: "Sunshine Sticky Note Bundle",
    slug: "sunshine-sticky-note-bundle",
    description:
      "Bundle of shaped sticky notes in sun, cloud and star designs. Brighten up your reminders and pages.",
    price: 159,
    originalPrice: 219,
    stock: 50,
    sku: "C2C-STAT-003",
    badge: "SALE",
    isActive: true,
    isFeatured: false,
    isTrending: false,
    isNew: true,
    isBestSeller: false,
    categorySlug: "stationery",
    rating: 4.4,
    reviewCount: 22,
    createdAt: "2026-08-14T00:00:00.000Z",
    imageIds: [
      "1635274322629-90e95c4b5f6a",
      "1611532736597-de2d4265fba3",
      "1503454537195-1dc81782c7c1",
    ],
  }),
];

export const banners: Banner[] = [
  {
    id: "b1",
    title: "New Drop",
    subtitle: "120+ cute products just landed \u2728",
    buttonText: "Shop New",
    buttonUrl: "/new",
    variant: "yellow",
    accent: "from-yellow to-yellow-deep",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "b2",
    title: "Gift Something Cute",
    subtitle: "Ready-to-gift hampers from \u20b9499 \ud83c\udf81",
    buttonText: "Shop Gifts",
    buttonUrl: "/gifts",
    variant: "pastel",
    accent: "pastel-lilac",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "b3",
    title: "20% Off Best Sellers",
    subtitle: "Limited time only \u2014 grab your favourites",
    buttonText: "Shop Trending",
    buttonUrl: "/trending",
    variant: "cream",
    accent: "cream-deep",
    isActive: true,
    sortOrder: 3,
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Ananya R.",
    city: "Bengaluru",
    rating: 5,
    text: "Absolutely love the products! The floral journal is even prettier in person. Packaging was super cute too.",
    product: "Aesthetic Floral Journal",
  },
  {
    id: "r2",
    name: "Karthik M.",
    city: "Chennai",
    rating: 5,
    text: "Gifted the stationery box to my sister and she was thrilled. Quality is premium and delivery was quick.",
    product: "Cute Stationery Gift Box",
  },
  {
    id: "r3",
    name: "Sneha P.",
    city: "Pune",
    rating: 5,
    text: "The pastel planner keeps me so organised and it looks adorable on my desk. Worth every rupee.",
    product: "Pastel Dream Planner",
  },
  {
    id: "r4",
    name: "Riya S.",
    city: "Delhi",
    rating: 4,
    text: "Cute stickers and fast shipping! My laptop looks so much happier now. Will order again.",
    product: "Kawaii Sticker Pack",
  },
];

export const instagramImages = [
  "1531346878377-a5be20888e57",
  "1503676263721-b1a42a1f5f0e",
  "1583485088034-694b469c0859",
  "1513885535751-8b9238bd345a",
  "1503454537195-1dc81782c7c1",
  "1544816155-12df9643f363",
].map((id, i) => ({ id: `ig-${i}`, url: u(id, 500) }));

/* ---------- selectors ---------- */

export function getAllProducts() {
  return products.filter((p) => p.isActive);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return getAllProducts().filter((p) => p.categorySlug === slug);
}

export function getTrending() {
  return getAllProducts().filter((p) => p.isTrending);
}

export function getNewArrivals() {
  return getAllProducts().filter((p) => p.isNew);
}

export function getBestSellers() {
  return getAllProducts().filter((p) => p.isBestSeller);
}

export function getFeatured() {
  return getAllProducts().filter((p) => p.isFeatured);
}

export function getPerfectGifts() {
  return getAllProducts().filter(
    (p) => p.categorySlug === "gifts" || p.isFeatured,
  );
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryCounts() {
  return categories.map((c) => ({
    ...c,
    count: getProductsByCategory(c.slug).length,
  }));
}

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.categorySlug.toLowerCase().includes(q),
  );
}

export function getActiveBanners() {
  return banners
    .filter((b) => b.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

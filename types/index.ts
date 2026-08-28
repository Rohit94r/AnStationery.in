export type Badge = "NEW" | "SALE" | "HOT" | "TRENDING" | "BESTSELLER" | "SOLD OUT";

export type Category = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  description: string;
  accent: string;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  sku?: string;
  badge?: Badge | null;
  isActive: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  categorySlug: string;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  createdAt: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  buttonText: string;
  buttonUrl: string;
  variant: "yellow" | "cream" | "photo" | "pastel";
  accent: string;
  isActive: boolean;
  sortOrder: number;
};

export type Review = {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  product: string;
};

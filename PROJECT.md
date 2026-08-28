# Crayon2Couture — Full-Stack E-Commerce Build Plan

> Cute, premium, gift-worthy stationery e-commerce store + Admin Dashboard.
> Visual reference: existing prototype (https://crayon2couture.netlify.app/) + MUJI India (https://muji.in/) for clean, modern minimalism.

---

## 1. Brand & Design Direction

**Identity:** Cute, premium, playful, clean, Instagram-friendly Indian aesthetic stationery/gifting brand.

**Color system**
| Token | Use |
|---|---|
| `--background` White `#FFFFFF` | Primary background everywhere |
| `--cream` `#FFF9F0` | Soft section backgrounds, cards |
| `--yellow` `#FFD23F` / `#FFC107` | Banners, announcement bar, CTAs, badges, highlight cards, sale callouts |
| `--ink` `#1A1A1A` | Primary text |
| `--muted` `#6B6B6B` | Secondary text |
| Pastel accents (pink, mint, lilac, peach) | Category cards, doodles, badges |

**Rule:** White is dominant. Yellow is used *strategically* for promotional moments — never the whole site.

**Typography (modern font libraries)**
- Display / Headings: **Plus Jakarta Sans** (geometric, friendly, premium)
- Body / UI: **Inter** (clean, legible)
- Accent / Cute stamps: **Caveat** (handwritten doodle labels) — used sparingly on banners/stickers

**Decorative details (controlled):** stars, sparkles, doodles, tape/paper motifs, cute icons, sticker badges — used on hero & banners only.

**Avoid:** excessive gradients, glassmorphism, dark enterprise UI, huge text blocks, generic SaaS look.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (App Router) + React + TypeScript | SSR/SSG for SEO + speed, modern React |
| Styling | Tailwind CSS | Rapid, consistent, responsive utility system |
| Database | PostgreSQL via Supabase | Managed Postgres, free tier, Storage included |
| ORM | Prisma | Type-safe DB access, migrations, intuitive schema |
| Storage | Supabase Storage | Hosts product/banner images; refs stored in Postgres |
| Auth | Secure admin auth (Supabase Auth / iron-session) | Protect admin routes server-side |
| Hosting | Vercel | Native Next.js deploys |
| Future | Razorpay (payments), Shiprocket (shipping) | Out of MVP scope |

---

## 3. Folder Structure

```
app/
  page.tsx                      # Homepage
  shop/page.tsx
  products/[slug]/page.tsx
  cart/page.tsx
  checkout/page.tsx
  order-confirmation/[orderNumber]/page.tsx
  gifts/ trending/ new/ about/ contact/
  admin/
    login/ dashboard/ products/ categories/ orders/ banners/ settings/
components/
  ui/ layout/ products/ cart/ checkout/ admin/ banners/
lib/
  db.ts auth.ts storage.ts validation.ts utils.ts constants.ts
prisma/
  schema.prisma  seed.ts
public/           # dummy images, doodles, icons
types/
.env.example
```

---

## 4. Database Entities

- **User** (admin)
- **Category** (name, slug, image, description, isActive)
- **Product** (name, slug, description, price, originalPrice, stock, isActive, isFeatured, isTrending, isNew, isBestSeller, badge, categoryId)
- **ProductImage** (productId, url, alt, sortOrder, isPrimary) — multi-image support
- **Order** (orderNumber, customerName/phone/email, address, city, state, pincode, subtotal, shippingAmount, totalAmount, status)
- **OrderItem** (orderId, productId, productNameSnapshot, priceSnapshot, quantity, subtotal) — snapshots preserve history
- **Shipment** (orderId, courierName, trackingNumber, trackingUrl, status) — manual shipping
- **Banner** (title, subtitle, imageUrl, buttonText, buttonUrl, isActive, sortOrder)
- **Review/Testimonial**, **SiteConfig** (business name, phone, WhatsApp, etc. — single source)

---

## 5. Phased Build Plan

### Phase 1 — Project Setup & Shell (current)
- Next.js + TypeScript + Tailwind init
- Font libraries (Plus Jakarta Sans, Inter, Caveat)
- Design tokens / Tailwind theme config (colors, fonts)
- Header (logo, nav, search, account, cart, mobile hamburger)
- Top announcement bar (yellow)
- Footer
- Mobile-responsive layout shell
- Dummy data + dummy images via placeholder services

### Phase 2 — Database & Data Layer
- Prisma schema (all entities above)
- Supabase PostgreSQL connection
- Migrations
- Seed data (categories + ~12 products with multi-images, banners, reviews)
- `lib/db.ts`, `lib/utils.ts`, validation helpers

### Phase 3 — Product System
- Product listing grid, cards, badges, stock status
- Product detail page with multi-image gallery
- Category pages

### Phase 4 — Storefront
- Homepage (hero, posters/banners, categories, trending, best sellers, new arrivals, gifts, stats, reviews, instagram, benefits)
- Shop with search/filter/sort
- Trending / New / Gifts pages

### Phase 5 — Cart
- Client-side cart (add/remove/qty/totals), stock validation, persistence

### Phase 6 — Checkout & Orders
- Customer details form + validation
- Server-side price/stock validation
- Order creation in a DB transaction, stock decrement
- Order confirmation page

### Phase 7 — Admin Auth
- Secure login, protected routes, server-side auth

### Phase 8 — Admin Dashboard
- Dashboard stats, products CRUD, multi-image upload (Supabase Storage), categories, orders, stock warnings, banners

### Phase 9 — Manual Shipping
- Courier/tracking entry, status updates, customer tracking timeline

### Phase 10–11 — Testing & Deployment

---

## 6. Key Business Rules
- Never trust frontend price/stock/total — validate server-side.
- Stock controlled server-side; transactions for order+stock.
- Historical orders keep price/name snapshots even if product edited/deleted.
- Soft-delete products to avoid breaking orders.
- Business config (phone, WhatsApp, policies) in one place — no duplication.
- WhatsApp number configurable.

---

## 7. Out of MVP Scope
Shiprocket automation, courier APIs, GST, customer accounts, coupons, reviews submission, loyalty, mobile apps, AI features, advanced analytics.

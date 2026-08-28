# Crayon2Couture

Cute, premium, gift-worthy stationery e-commerce store + Admin Dashboard.
White-dominant design with strategic yellow promotional banners, pastel accents,
and a playful Instagram-friendly aesthetic.

See [`PROJECT.md`](./PROJECT.md) for the full build plan and design direction.

## Tech Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS v4** (CSS-first design tokens)
- **Prisma** ORM + **PostgreSQL** via **Supabase**
- **Supabase Storage** for product/banner images
- Fonts: Plus Jakarta Sans (display), Inter (body), Caveat (accent)
- Validation: Zod

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Environment
Copy the template and fill in your Supabase credentials:
```bash
cp .env.example .env
```
Required: `DATABASE_URL` (PostgreSQL connection string from Supabase).

### 3. Database (Prisma)
```bash
npm run db:generate   # generate the Prisma client
npm run db:push       # create/sync tables (dev)  — or: npm run db:migrate
npm run db:seed       # seed categories, products (multi-image), banners, reviews, site config
```

### 4. Run
```bash
npm run dev
```
Open http://localhost:3000

### Admin Dashboard
Open http://localhost:3000/admin/login

**Demo credentials:** `admin@crayon2couture.in` / `admin123`
(override with `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` env vars)

The admin lets you manage everything:
- **Dashboard** — orders by status, total sales, low-stock & out-of-stock warnings, recent orders
- **Products** — full CRUD, multi-image upload (drag/drop, set primary, reorder), inline stock editing, soft-delete with confirmation
- **Categories** — create / edit / delete (products detach safely)
- **Orders** — list, view detail, update status, enter manual courier + tracking (auto-advances to SHIPPED)
- **Banners** — manage homepage promotional posters (title, CTA, variant, active, order)
- **Settings** — business config (phone, WhatsApp, email, shipping thresholds) in one place

## Scripts
| Script | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Sync schema to DB (dev) |
| `npm run db:migrate` | Create + apply a migration |
| `npm run db:seed` | Seed initial data |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure
```
app/
  page.tsx                  # homepage (Prisma-backed, revalidates 60s)
  shop/ trending/ new/ gifts/ about/ contact/ cart/ checkout/
  products/[slug]/          # multi-image product detail
  order-confirmation/[orderNumber]/
  admin/
    login/  dashboard/  products/  categories/  orders/  banners/  settings/
  api/
    orders/                 # checkout: server-side validation + transaction + stock decrement
    admin/
      login/ logout/ upload/        # auth + image upload
      products/ products/[id]/      # product CRUD
      categories/ categories/[id]/  # category CRUD
      orders/[id]/ orders/[id]/shipment/   # status + manual shipping
      banners/ banners/[id]/        # banner CRUD
      settings/                     # business config
components/
  ui/ layout/ products/ cart/ checkout/ home/ admin/
lib/
  db.ts data.ts auth.ts constants.ts utils.ts placeholder.ts dummy-data.ts
prisma/  schema.prisma  seed.ts
types/
```

## Database
- **Local demo:** SQLite (`prisma/dev.db`) — works instantly, no external service.
- **Production:** switch `schema.prisma` provider to `postgresql` and set `DATABASE_URL` to Supabase. The schema (String-based enum fields) is valid in Postgres too.

## Status
- Phase 1 (Storefront + homepage + shop/product/cart/checkout) — done
- Phase 2 (Prisma + SQLite DB + seed + lib/data.ts) — done & working
- Admin dashboard (auth, products CRUD + multi-image, categories, orders + manual shipping, banners, settings, stock management) — done & working
- Storefront reads live from the database; admin changes reflect on the storefront.

## Security notes
- Admin routes protected by middleware (HMAC-signed cookie session).
- All admin API routes check the session server-side.
- `POST /api/orders` re-validates prices, stock, and inputs **server-side** (never trusts the frontend), then persists the order + decrements stock inside a Prisma **transaction** (with a second in-transaction stock re-check to avoid race conditions).
- Historical orders keep price/name snapshots (`OrderItem`) so they stay accurate even if products are later edited or soft-deleted.
- Image upload validates file type and size; rejects oversized/unsupported files.
- For production: replace demo credentials with env vars and use bcrypt-hashed passwords + a `User` table.

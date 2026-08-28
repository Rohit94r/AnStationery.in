-- ============================================================
-- CRAYON2COUTURE — COMPLETE SUPABASE SCHEMA + SEED DATA
-- ============================================================
-- HOW TO USE:
--   1. Open Supabase Dashboard → SQL Editor
--   2. Paste this entire file
--   3. Click "Run"
--   4. All tables, policies, functions, and seed data are created
-- ============================================================

-- 0. CLEANUP (idempotent — safe to re-run)
DROP TABLE IF EXISTS site_config CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS create_order(text, text, text, text, text, text, text, jsonb, integer, integer);
DROP FUNCTION IF EXISTS update_updated_at();

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. UPDATED_AT helper
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 3. TABLES
-- ============================================================

-- USERS (admin)
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT DEFAULT 'ADMIN',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  emoji       TEXT,
  image       TEXT,
  description TEXT,
  accent      TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  slug           TEXT UNIQUE NOT NULL,
  description    TEXT NOT NULL,
  price          INTEGER NOT NULL,
  original_price INTEGER,
  stock          INTEGER DEFAULT 0,
  sku            TEXT,
  badge          TEXT,
  is_active      BOOLEAN DEFAULT TRUE,
  is_featured    BOOLEAN DEFAULT FALSE,
  is_trending    BOOLEAN DEFAULT FALSE,
  is_new         BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  rating         REAL DEFAULT 0,
  review_count   INTEGER DEFAULT 0,
  deleted_at     TIMESTAMPTZ,
  category_id    UUID REFERENCES categories(id),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT IMAGES (multi-image support)
CREATE TABLE product_images (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt        TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT UNIQUE NOT NULL,
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  customer_email  TEXT,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  pincode         TEXT NOT NULL,
  subtotal        INTEGER NOT NULL,
  shipping_amount INTEGER NOT NULL,
  total_amount    INTEGER NOT NULL,
  status          TEXT DEFAULT 'NEW',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS (with price/name snapshots for historical accuracy)
CREATE TABLE order_items (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id             UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id           UUID REFERENCES products(id),
  product_name_snapshot TEXT NOT NULL,
  price_snapshot       INTEGER NOT NULL,
  quantity             INTEGER NOT NULL,
  subtotal             INTEGER NOT NULL
);

-- SHIPMENTS (manual shipping)
CREATE TABLE shipments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  courier_name    TEXT,
  tracking_number TEXT,
  tracking_url    TEXT,
  status          TEXT DEFAULT 'PENDING',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- BANNERS (homepage promotional posters)
CREATE TABLE banners (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  subtitle    TEXT,
  image_url   TEXT,
  button_text TEXT,
  button_url  TEXT,
  variant     TEXT DEFAULT 'yellow',
  is_active   BOOLEAN DEFAULT TRUE,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- REVIEWS / TESTIMONIALS
CREATE TABLE reviews (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  city       TEXT,
  rating     INTEGER DEFAULT 5,
  text       TEXT NOT NULL,
  product    TEXT,
  product_id UUID REFERENCES products(id),
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE CONFIG (single source of truth for business settings)
CREATE TABLE site_config (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key   TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

-- ============================================================
-- 4. INDEXES
-- ============================================================
CREATE INDEX idx_products_category    ON products(category_id);
CREATE INDEX idx_products_trending    ON products(is_trending) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_new         ON products(is_new) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_bestseller  ON products(is_best_seller) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_featured    ON products(is_featured) WHERE deleted_at IS NULL;
CREATE INDEX idx_product_images_pid   ON product_images(product_id);
CREATE INDEX idx_orders_status        ON orders(status);
CREATE INDEX idx_orders_created       ON orders(created_at);
CREATE INDEX idx_order_items_order    ON order_items(order_id);

-- ============================================================
-- 5. TRIGGERS for updated_at
-- ============================================================
CREATE TRIGGER trg_categories_updated  BEFORE UPDATE ON categories  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated    BEFORE UPDATE ON products    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated      BEFORE UPDATE ON orders      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_shipments_updated   BEFORE UPDATE ON shipments   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_banners_updated     BEFORE UPDATE ON banners     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_users_updated       BEFORE UPDATE ON users       FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================
-- DEMO MODE: permissive policies so the publishable (anon) key
-- can read and write. For PRODUCTION, restrict writes to the
-- service role key or authenticated admin users.
-- ============================================================

ALTER TABLE categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config    ENABLE ROW LEVEL SECURITY;
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;

-- Allow all operations for the anon role (demo)
CREATE POLICY "anon_all_categories"   ON categories   FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "anon_all_products"     ON products     FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "anon_all_prod_images"  ON product_images FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "anon_all_orders"       ON orders        FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "anon_all_order_items"  ON order_items   FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "anon_all_shipments"    ON shipments     FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "anon_all_banners"      ON banners       FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "anon_all_reviews"      ON reviews       FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "anon_all_site_config"  ON site_config   FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "anon_no_users"         ON users         FOR ALL USING (FALSE) WITH CHECK (FALSE);

-- ============================================================
-- 7. CREATE_ORDER RPC (atomic order + stock decrement)
-- ============================================================
CREATE OR REPLACE FUNCTION create_order(
  p_customer_name    TEXT,
  p_customer_phone   TEXT,
  p_customer_email   TEXT,
  p_address          TEXT,
  p_city             TEXT,
  p_state            TEXT,
  p_pincode          TEXT,
  p_lines            JSONB,
  p_shipping_threshold INTEGER DEFAULT 499,
  p_shipping_fee        INTEGER DEFAULT 49
) RETURNS JSONB AS $$
DECLARE
  v_order_id    UUID;
  v_order_number TEXT;
  v_subtotal    INTEGER := 0;
  v_shipping    INTEGER;
  v_total       INTEGER;
  v_line        JSONB;
  v_product     RECORD;
  v_item_sub    INTEGER;
  v_items       JSONB := '[]'::JSONB;
  v_primary_url TEXT;
BEGIN
  -- Generate order number
  v_order_number := 'CC-' || LPAD((EXTRACT(EPOCH FROM NOW())::BIGINT % 1000000)::TEXT, 6, '0') || LPAD((RANDOM() * 90 + 10)::INT::TEXT, 2, '0');

  -- Validate stock and calculate subtotal
  FOR v_line IN SELECT * FROM jsonb_array_elements(p_lines)
  LOOP
    SELECT id, name, price, stock INTO v_product
    FROM products
    WHERE slug = v_line->>'slug' AND deleted_at IS NULL AND is_active = TRUE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product "%" is no longer available.', v_line->>'slug';
    END IF;

    IF v_product.stock < (v_line->>'quantity')::INTEGER THEN
      RAISE EXCEPTION 'Only % of "%" available.', v_product.stock, v_product.name;
    END IF;

    v_item_sub := v_product.price * (v_line->>'quantity')::INTEGER;
    v_subtotal := v_subtotal + v_item_sub;
  END LOOP;

  -- Calculate shipping
  IF v_subtotal >= p_shipping_threshold THEN
    v_shipping := 0;
  ELSE
    v_shipping := p_shipping_fee;
  END IF;
  v_total := v_subtotal + v_shipping;

  -- Create order
  INSERT INTO orders (order_number, customer_name, customer_phone, customer_email, address, city, state, pincode, subtotal, shipping_amount, total_amount, status)
  VALUES (v_order_number, p_customer_name, p_customer_phone, NULLIF(p_customer_email, ''), p_address, p_city, p_state, p_pincode, v_subtotal, v_shipping, v_total, 'NEW')
  RETURNING id INTO v_order_id;

  -- Create order items + decrement stock + build response
  FOR v_line IN SELECT * FROM jsonb_array_elements(p_lines)
  LOOP
    SELECT id, name, price INTO v_product
    FROM products
    WHERE slug = v_line->>'slug' AND deleted_at IS NULL;

    v_item_sub := v_product.price * (v_line->>'quantity')::INTEGER;

    INSERT INTO order_items (order_id, product_id, product_name_snapshot, price_snapshot, quantity, subtotal)
    VALUES (v_order_id, v_product.id, v_product.name, v_product.price, (v_line->>'quantity')::INTEGER, v_item_sub);

    -- Decrement stock (atomic within transaction)
    UPDATE products SET stock = stock - (v_line->>'quantity')::INTEGER WHERE id = v_product.id;

    -- Get primary image for response
    SELECT url INTO v_primary_url FROM product_images WHERE product_id = v_product.id AND is_primary = TRUE LIMIT 1;
    IF v_primary_url IS NULL THEN
      SELECT url INTO v_primary_url FROM product_images WHERE product_id = v_product.id ORDER BY sort_order ASC LIMIT 1;
    END IF;

    v_items := v_items || jsonb_build_object(
      'name', v_product.name,
      'price', v_product.price,
      'quantity', (v_line->>'quantity')::INTEGER,
      'image', COALESCE(v_primary_url, '')
    );
  END LOOP;

  RETURN jsonb_build_object(
    'orderNumber',     v_order_number,
    'customerName',    p_customer_name,
    'customerPhone',   p_customer_phone,
    'customerEmail',   NULLIF(p_customer_email, ''),
    'address',         p_address,
    'city',            p_city,
    'state',           p_state,
    'pincode',         p_pincode,
    'items',           v_items,
    'subtotal',        v_subtotal,
    'shippingAmount',  v_shipping,
    'totalAmount',     v_total,
    'status',          'NEW',
    'createdAt',       NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 8. SEED DATA
-- ============================================================

-- 8a. CATEGORIES
INSERT INTO categories (name, slug, emoji, description, accent, is_active) VALUES
('Diaries',      'diaries',      '📓', 'Aesthetic journals & planners',  'pastel-pink',  TRUE),
('Stationery',   'stationery',   '✏️', 'Pens, pencils & desk cute',      'pastel-mint',  TRUE),
('Gifts',        'gifts',        '🎁', 'Ready-to-gift cute boxes',       'pastel-lilac', TRUE),
('Accessories',  'accessories',  '🎒', 'Stickers, pouches & more',       'pastel-peach', TRUE),
('Desk',         'desk',         '💻', 'Workspace cuteness',              'pastel-sky',   TRUE);

-- 8b. PRODUCTS
INSERT INTO products (name, slug, description, price, original_price, stock, sku, badge, is_active, is_featured, is_trending, is_new, is_best_seller, rating, review_count, category_id) VALUES
('Aesthetic Floral Journal', 'aesthetic-floral-journal',
 'A beautifully crafted A5 journal with hand-drawn floral cover, 160 GSM cream pages, ribbon bookmark and lay-flat binding. Perfect for journaling, notes and doodles.',
 399, 499, 25, 'C2C-DIARY-001', 'SALE', TRUE, TRUE, TRUE, FALSE, TRUE, 4.8, 106,
 (SELECT id FROM categories WHERE slug='diaries')),

('Pastel Dream Planner', 'pastel-dream-planner',
 'Undated daily planner with pastel section dividers, habit trackers, monthly goals and sticker sheet. Plan your cutest year yet.',
 549, 699, 18, 'C2C-DIARY-002', 'HOT', TRUE, FALSE, TRUE, TRUE, FALSE, 4.7, 64,
 (SELECT id FROM categories WHERE slug='diaries')),

('Cute Stationery Gift Box', 'cute-stationery-gift-box',
 'Complete aesthetic stationery set with binder, pens, stickers, washi tape and a handwritten note card. The perfect gift for someone special, ready to gift.',
 799, 999, 12, 'C2C-GIFT-001', 'BESTSELLER', TRUE, TRUE, TRUE, FALSE, TRUE, 4.9, 211,
 (SELECT id FROM categories WHERE slug='gifts')),

('Rainbow Gel Pen Set', 'rainbow-gel-pen-set',
 'Set of 12 smooth-flow gel pens in pastel rainbow shades. Quick-drying, smudge-free ink that glides on paper.',
 249, 349, 40, 'C2C-STAT-001', 'NEW', TRUE, FALSE, FALSE, TRUE, FALSE, 4.6, 38,
 (SELECT id FROM categories WHERE slug='stationery')),

('Kawaii Sticker Pack', 'kawaii-sticker-pack',
 '100+ waterproof cute stickers featuring doodles, stars, plants and smileys. Perfect for laptops, journals and phone cases.',
 199, NULL, 60, 'C2C-ACC-001', 'TRENDING', TRUE, FALSE, TRUE, TRUE, FALSE, 4.8, 92,
 (SELECT id FROM categories WHERE slug='accessories')),

('Mini Doodle Notebook (Pack of 3)', 'mini-doodle-notebook-pack-3',
 'A pack of three pocket-sized doodle notebooks with cute covers. Ideal for on-the-go notes, lists and sketches.',
 299, 399, 33, 'C2C-DIARY-003', 'SALE', TRUE, FALSE, FALSE, TRUE, TRUE, 4.7, 47,
 (SELECT id FROM categories WHERE slug='diaries')),

('Cloud Washi Tape Collection', 'cloud-washi-tape-collection',
 'Set of 8 decorative washi tapes in cloud, star and floral patterns. Add a cute touch to your journals and crafts.',
 179, NULL, 0, 'C2C-ACC-002', 'SOLD OUT', TRUE, FALSE, TRUE, FALSE, FALSE, 4.9, 73,
 (SELECT id FROM categories WHERE slug='accessories')),

('Star Dust Highlighters (6pc)', 'star-dust-highlighters-6pc',
 'Six soft pastel highlighters with a mild, gentle ink. Perfect for colour-coding notes without bleeding through pages.',
 219, 299, 7, 'C2C-STAT-002', 'HOT', TRUE, FALSE, TRUE, FALSE, FALSE, 4.5, 29,
 (SELECT id FROM categories WHERE slug='stationery')),

('Cozy Desk Organiser Set', 'cozy-desk-organiser-set',
 'Pastel desk organiser with compartments for pens, sticky notes and clips. Keep your workspace tidy and cute.',
 649, 799, 15, 'C2C-DESK-001', 'NEW', TRUE, TRUE, FALSE, TRUE, FALSE, 4.7, 41,
 (SELECT id FROM categories WHERE slug='desk')),

('Birthday Surprise Gift Hamper', 'birthday-surprise-gift-hamper',
 'A curated birthday hamper with a journal, pens, stickers, chocolates and a personalised note. Delivered gift-ready.',
 1099, 1399, 9, 'C2C-GIFT-002', 'BESTSELLER', TRUE, TRUE, FALSE, FALSE, TRUE, 4.9, 158,
 (SELECT id FROM categories WHERE slug='gifts')),

('Mint Green Pencil Pouch', 'mint-green-pencil-pouch',
 'Soft mint canvas pencil pouch with a cute smiley embroidered. Roomy enough for all your favourite pens.',
 279, NULL, 28, 'C2C-ACC-003', 'TRENDING', TRUE, FALSE, TRUE, TRUE, FALSE, 4.6, 35,
 (SELECT id FROM categories WHERE slug='accessories')),

('Sunshine Sticky Note Bundle', 'sunshine-sticky-note-bundle',
 'Bundle of shaped sticky notes in sun, cloud and star designs. Brighten up your reminders and pages.',
 159, 219, 50, 'C2C-STAT-003', 'SALE', TRUE, FALSE, FALSE, TRUE, FALSE, 4.4, 22,
 (SELECT id FROM categories WHERE slug='stationery'));

-- 8c. PRODUCT IMAGES (multi-image per product)
-- p1: Aesthetic Floral Journal
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='aesthetic-floral-journal'), 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80', 'Aesthetic Floral Journal view 1', 0, TRUE),
((SELECT id FROM products WHERE slug='aesthetic-floral-journal'), 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80', 'Aesthetic Floral Journal view 2', 1, FALSE),
((SELECT id FROM products WHERE slug='aesthetic-floral-journal'), 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80', 'Aesthetic Floral Journal view 3', 2, FALSE),
((SELECT id FROM products WHERE slug='aesthetic-floral-journal'), 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80', 'Aesthetic Floral Journal view 4', 3, FALSE);

-- p2: Pastel Dream Planner
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='pastel-dream-planner'), 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80', 'Pastel Dream Planner view 1', 0, TRUE),
((SELECT id FROM products WHERE slug='pastel-dream-planner'), 'https://images.unsplash.com/photo-1503676263721-b1a42a1f5f0e?auto=format&fit=crop&w=900&q=80', 'Pastel Dream Planner view 2', 1, FALSE),
((SELECT id FROM products WHERE slug='pastel-dream-planner'), 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80', 'Pastel Dream Planner view 3', 2, FALSE);

-- p3: Cute Stationery Gift Box
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='cute-stationery-gift-box'), 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80', 'Cute Stationery Gift Box view 1', 0, TRUE),
((SELECT id FROM products WHERE slug='cute-stationery-gift-box'), 'https://images.unsplash.com/photo-1503676263721-b1a42a1f5f0e?auto=format&fit=crop&w=900&q=80', 'Cute Stationery Gift Box view 2', 1, FALSE),
((SELECT id FROM products WHERE slug='cute-stationery-gift-box'), 'https://images.unsplash.com/photo-1583485088034-694b469c0859?auto=format&fit=crop&w=900&q=80', 'Cute Stationery Gift Box view 3', 2, FALSE),
((SELECT id FROM products WHERE slug='cute-stationery-gift-box'), 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80', 'Cute Stationery Gift Box view 4', 3, FALSE);

-- p4: Rainbow Gel Pen Set
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='rainbow-gel-pen-set'), 'https://images.unsplash.com/photo-1583485088034-694b469c0859?auto=format&fit=crop&w=900&q=80', 'Rainbow Gel Pen Set view 1', 0, TRUE),
((SELECT id FROM products WHERE slug='rainbow-gel-pen-set'), 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=900&q=80', 'Rainbow Gel Pen Set view 2', 1, FALSE),
((SELECT id FROM products WHERE slug='rainbow-gel-pen-set'), 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80', 'Rainbow Gel Pen Set view 3', 2, FALSE);

-- p5: Kawaii Sticker Pack
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='kawaii-sticker-pack'), 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80', 'Kawaii Sticker Pack view 1', 0, TRUE),
((SELECT id FROM products WHERE slug='kawaii-sticker-pack'), 'https://images.unsplash.com/photo-1635274322629-90e95c4b5f6a?auto=format&fit=crop&w=900&q=80', 'Kawaii Sticker Pack view 2', 1, FALSE),
((SELECT id FROM products WHERE slug='kawaii-sticker-pack'), 'https://images.unsplash.com/photo-1503676263721-b1a42a1f5f0e?auto=format&fit=crop&w=900&q=80', 'Kawaii Sticker Pack view 3', 2, FALSE);

-- p6: Mini Doodle Notebook
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='mini-doodle-notebook-pack-3'), 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80', 'Mini Doodle Notebook view 1', 0, TRUE),
((SELECT id FROM products WHERE slug='mini-doodle-notebook-pack-3'), 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80', 'Mini Doodle Notebook view 2', 1, FALSE),
((SELECT id FROM products WHERE slug='mini-doodle-notebook-pack-3'), 'https://images.unsplash.com/photo-1503454537195-1dc81782c7c1?auto=format&fit=crop&w=900&q=80', 'Mini Doodle Notebook view 3', 2, FALSE);

-- p7: Cloud Washi Tape
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='cloud-washi-tape-collection'), 'https://images.unsplash.com/photo-1635274322629-90e95c4b5f6a?auto=format&fit=crop&w=900&q=80', 'Cloud Washi Tape view 1', 0, TRUE),
((SELECT id FROM products WHERE slug='cloud-washi-tape-collection'), 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80', 'Cloud Washi Tape view 2', 1, FALSE);

-- p8: Star Dust Highlighters
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='star-dust-highlighters-6pc'), 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80', 'Star Dust Highlighters view 1', 0, TRUE),
((SELECT id FROM products WHERE slug='star-dust-highlighters-6pc'), 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=900&q=80', 'Star Dust Highlighters view 2', 1, FALSE),
((SELECT id FROM products WHERE slug='star-dust-highlighters-6pc'), 'https://images.unsplash.com/photo-1583485088034-694b469c0859?auto=format&fit=crop&w=900&q=80', 'Star Dust Highlighters view 3', 2, FALSE);

-- p9: Cozy Desk Organiser Set
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='cozy-desk-organiser-set'), 'https://images.unsplash.com/photo-1503454537195-1dc81782c7c1?auto=format&fit=crop&w=900&q=80', 'Cozy Desk Organiser view 1', 0, TRUE),
((SELECT id FROM products WHERE slug='cozy-desk-organiser-set'), 'https://images.unsplash.com/photo-1503676263721-b1a42a1f5f0e?auto=format&fit=crop&w=900&q=80', 'Cozy Desk Organiser view 2', 1, FALSE),
((SELECT id FROM products WHERE slug='cozy-desk-organiser-set'), 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80', 'Cozy Desk Organiser view 3', 2, FALSE);

-- p10: Birthday Surprise Gift Hamper
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='birthday-surprise-gift-hamper'), 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80', 'Birthday Gift Hamper view 1', 0, TRUE),
((SELECT id FROM products WHERE slug='birthday-surprise-gift-hamper'), 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80', 'Birthday Gift Hamper view 2', 1, FALSE),
((SELECT id FROM products WHERE slug='birthday-surprise-gift-hamper'), 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80', 'Birthday Gift Hamper view 3', 2, FALSE),
((SELECT id FROM products WHERE slug='birthday-surprise-gift-hamper'), 'https://images.unsplash.com/photo-1583485088034-694b469c0859?auto=format&fit=crop&w=900&q=80', 'Birthday Gift Hamper view 4', 3, FALSE);

-- p11: Mint Green Pencil Pouch
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='mint-green-pencil-pouch'), 'https://images.unsplash.com/photo-1503676263721-b1a42a1f5f0e?auto=format&fit=crop&w=900&q=80', 'Mint Green Pencil Pouch view 1', 0, TRUE),
((SELECT id FROM products WHERE slug='mint-green-pencil-pouch'), 'https://images.unsplash.com/photo-1503454537195-1dc81782c7c1?auto=format&fit=crop&w=900&q=80', 'Mint Green Pencil Pouch view 2', 1, FALSE),
((SELECT id FROM products WHERE slug='mint-green-pencil-pouch'), 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=900&q=80', 'Mint Green Pencil Pouch view 3', 2, FALSE);

-- p12: Sunshine Sticky Note Bundle
INSERT INTO product_images (product_id, url, alt, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='sunshine-sticky-note-bundle'), 'https://images.unsplash.com/photo-1635274322629-90e95c4b5f6a?auto=format&fit=crop&w=900&q=80', 'Sunshine Sticky Note view 1', 0, TRUE),
((SELECT id FROM products WHERE slug='sunshine-sticky-note-bundle'), 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80', 'Sunshine Sticky Note view 2', 1, FALSE),
((SELECT id FROM products WHERE slug='sunshine-sticky-note-bundle'), 'https://images.unsplash.com/photo-1503454537195-1dc81782c7c1?auto=format&fit=crop&w=900&q=80', 'Sunshine Sticky Note view 3', 2, FALSE);

-- 8d. BANNERS
INSERT INTO banners (title, subtitle, button_text, button_url, variant, is_active, sort_order) VALUES
('New Drop',             '120+ cute products just landed ✨',  'Shop New',      '/new',       'yellow',  TRUE, 1),
('Gift Something Cute',  'Ready-to-gift hampers from ₹499 🎁','Shop Gifts',    '/gifts',     'pastel',  TRUE, 2),
('20% Off Best Sellers', 'Limited time only — grab your favourites', 'Shop Trending', '/trending', 'cream', TRUE, 3);

-- 8e. REVIEWS
INSERT INTO reviews (name, city, rating, text, product, is_active) VALUES
('Ananya R.', 'Bengaluru', 5, 'Absolutely love the products! The floral journal is even prettier in person. Packaging was super cute too.', 'Aesthetic Floral Journal', TRUE),
('Karthik M.', 'Chennai', 5, 'Gifted the stationery box to my sister and she was thrilled. Quality is premium and delivery was quick.', 'Cute Stationery Gift Box', TRUE),
('Sneha P.', 'Pune', 5, 'The pastel planner keeps me so organised and it looks adorable on my desk. Worth every rupee.', 'Pastel Dream Planner', TRUE),
('Riya S.', 'Delhi', 4, 'Cute stickers and fast shipping! My laptop looks so much happier now. Will order again.', 'Kawaii Sticker Pack', TRUE);

-- 8f. SITE CONFIG
INSERT INTO site_config (key, value) VALUES
('name',                  'Crayon2Couture'),
('tagline',               'Small Things. Big Smiles.'),
('description',           'Discover trending, aesthetic and gift-worthy stationery made to brighten your everyday moments.'),
('email',                 'hello@crayon2couture.in'),
('phone',                 '+91 98765 43210'),
('whatsapp',              '919876543210'),
('instagram',             'https://instagram.com/crayon2couture'),
('instagramHandle',       '@crayon2couture'),
('address',               'Mumbai, India'),
('freeShippingThreshold', '499'),
('shippingFee',           '49');

-- ============================================================
-- DONE! Your database is ready.
-- Tables: categories, products, product_images, orders,
--         order_items, shipments, banners, reviews, site_config
-- RPC:    create_order() for atomic checkout
-- RLS:    Permissive (demo). Restrict for production.
-- ============================================================

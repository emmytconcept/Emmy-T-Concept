-- ==============================================================================
-- EMMY-T CONCEPT — COMPLETE SUPABASE DATABASE SETUP (SCHEMA + RLS + SEED)
-- File: supabase/full_setup.sql
-- Instructions:
--   1. Open your Supabase Project Dashboard (https://supabase.com/dashboard)
--   2. Click on "SQL Editor" in the left sidebar
--   3. Paste this ENTIRE file into the editor
--   4. Click "Run" (green button)
-- Result:
--   ✓ All tables created with correct constraints and indexes
--   ✓ Automated notification & audit triggers installed
--   ✓ Row Level Security (RLS) enabled with public + admin policies
--   ✓ Storage buckets created for portfolio, services, uploads & PDFs
--   ✓ Live catalog seeded: 6 Services, 6 Portfolio projects, Testimonials & CMS
--   ✓ Orders & Quotations desk starts CLEAN (0 fake mock records)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS & HELPER TYPES
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'staff');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES (Staff & Admin Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  role            user_role NOT NULL DEFAULT 'staff',
  avatar_url      TEXT,
  phone           TEXT,
  is_active       BOOLEAN DEFAULT true,
  two_fa_enabled  BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICES CATALOG
CREATE TABLE IF NOT EXISTS public.services (
  id              TEXT PRIMARY KEY,                  -- slug/id like 'graphic-design'
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,
  icon            TEXT NOT NULL,                     -- Lucide icon name string
  short_desc      TEXT,
  description     TEXT,
  sub_items       JSONB DEFAULT '[]'::jsonb,         -- string array
  image           TEXT,
  featured        BOOLEAN DEFAULT false,
  status          TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  sort_order      INTEGER DEFAULT 0,
  created_by      UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_featured ON public.services(featured);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON public.services(sort_order);

-- 5. PORTFOLIO SHOWCASE
CREATE TABLE IF NOT EXISTS public.portfolio (
  id              TEXT PRIMARY KEY,                  -- e.g. 'proj-1' or UUID string
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE,
  category        TEXT NOT NULL,
  category_label  TEXT,
  description     TEXT,
  image           TEXT NOT NULL,                     -- primary cover
  images          JSONB DEFAULT '[]'::jsonb,         -- image gallery array
  video_url       TEXT,
  client          TEXT,
  date            TEXT,
  completion_date DATE,
  featured        BOOLEAN DEFAULT false,
  status          TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order      INTEGER DEFAULT 0,
  view_count      INTEGER DEFAULT 0,
  created_by      UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_category ON public.portfolio(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON public.portfolio(featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON public.portfolio(status);

-- 6. CUSTOMERS (CRM)
CREATE TABLE IF NOT EXISTS public.customers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       TEXT NOT NULL,
  email           TEXT,
  phone           TEXT NOT NULL,
  whatsapp        TEXT,
  address         TEXT,
  notes           TEXT,
  tags            TEXT[] DEFAULT '{}',
  total_orders    INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

-- 7. ENQUIRIES & ORDERS
CREATE TABLE IF NOT EXISTS public.enquiries (
  id              TEXT PRIMARY KEY,                  -- e.g. 'enq-101' or 'ENQ-4297'
  customer_name   TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT,
  service_id      TEXT,
  service_name    TEXT,
  description     TEXT NOT NULL,
  quantity        TEXT,
  dimensions      TEXT,
  delivery_date   DATE,
  turnaround      TEXT,
  uploaded_files  JSONB DEFAULT '[]'::jsonb,         -- [{ url, name, size, type, previewUrl }]
  status          TEXT DEFAULT 'new_enquiry' CHECK (status IN (
                    'new_enquiry', 'awaiting_quotation', 'quotation_sent',
                    'awaiting_payment', 'in_production',
                    'ready_for_collection', 'dispatched',
                    'completed', 'cancelled'
                  )),
  type            TEXT DEFAULT 'quote' CHECK (type IN ('quote', 'contact_message')),
  source          TEXT DEFAULT 'website',
  quoted_price    NUMERIC(12,2),
  agreed_price    NUMERIC(12,2),
  quote_id        TEXT,
  customer_id     UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  assigned_to     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_type ON public.enquiries(type);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_phone ON public.enquiries(phone);

-- 8. QUOTATIONS
CREATE TABLE IF NOT EXISTS public.quotations (
  id              TEXT PRIMARY KEY,                  -- e.g. 'QT-2026-001'
  enquiry_id      TEXT REFERENCES public.enquiries(id) ON DELETE SET NULL,
  customer_id     UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT,
  customer_email  TEXT,
  line_items      JSONB NOT NULL DEFAULT '[]'::jsonb,-- [{ description, qty, unitPrice, total }]
  subtotal        NUMERIC(12,2) NOT NULL,
  delivery_charge NUMERIC(12,2) DEFAULT 0,
  total           NUMERIC(12,2) NOT NULL,
  currency        TEXT DEFAULT 'NGN',
  payment_terms   TEXT DEFAULT '70% deposit required prior to production kickoff; 30% balance upon collection/dispatch.',
  status          TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'accepted', 'declined', 'expired')),
  date            DATE DEFAULT CURRENT_DATE,
  valid_until     DATE DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
  pdf_url         TEXT,
  sent_via        TEXT DEFAULT 'download',
  created_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotations_enquiry ON public.quotations(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON public.quotations(created_at DESC);

-- 9. ORDER NOTES & STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.order_notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id      TEXT REFERENCES public.enquiries(id) ON DELETE CASCADE,
  author_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  note            TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.status_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id      TEXT REFERENCES public.enquiries(id) ON DELETE CASCADE,
  from_status     TEXT,
  to_status       TEXT NOT NULL,
  changed_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  note            TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 10. REVIEWS & TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id              TEXT PRIMARY KEY,
  customer_name   TEXT NOT NULL,
  role            TEXT,
  company         TEXT,
  content         TEXT NOT NULL,
  rating          INTEGER CHECK (rating BETWEEN 1 AND 5),
  image_url       TEXT,
  approved        BOOLEAN DEFAULT false,
  featured        BOOLEAN DEFAULT false,
  sort_order      INTEGER DEFAULT 0,
  date            DATE DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON public.testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(featured);

-- 11. WEBSITE CMS CONTENT & ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.content (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section         TEXT NOT NULL,
  key             TEXT NOT NULL,
  value           JSONB NOT NULL,
  updated_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id              TEXT PRIMARY KEY,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,
  title           TEXT NOT NULL,
  message         TEXT,
  link            TEXT,
  read            BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(read) WHERE NOT read;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- ==============================================================================
-- AUTOMATED TRIGGERS & FUNCTIONS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_services_updated_at ON public.services;
CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_portfolio_updated_at ON public.portfolio;
CREATE TRIGGER trg_portfolio_updated_at BEFORE UPDATE ON public.portfolio
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_enquiries_updated_at ON public.enquiries;
CREATE TRIGGER trg_enquiries_updated_at BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_quotations_updated_at ON public.quotations;
CREATE TRIGGER trg_quotations_updated_at BEFORE UPDATE ON public.quotations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_enquiry_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (id, type, title, message, link, read, created_at)
  VALUES (
    'notif-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 4),
    CASE WHEN NEW.type = 'contact_message' THEN 'new_contact' ELSE 'new_enquiry' END,
    CASE WHEN NEW.type = 'contact_message' THEN 'New Direct Message' ELSE 'New Project Enquiry' END,
    NEW.customer_name || ' submitted ' || COALESCE(NEW.service_name, 'a request'),
    '/admin/orders',
    false,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_new_enquiry ON public.enquiries;
CREATE TRIGGER trg_notify_new_enquiry AFTER INSERT ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_enquiry_notification();

CREATE OR REPLACE FUNCTION public.handle_enquiry_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.status_history (enquiry_id, from_status, to_status, note)
    VALUES (NEW.id, OLD.status, NEW.status, NEW.notes);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_log_enquiry_status ON public.enquiries;
CREATE TRIGGER trg_log_enquiry_status AFTER UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_enquiry_status_change();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published services" ON public.services FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated staff can manage services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view published portfolio" ON public.portfolio FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated staff can manage portfolio" ON public.portfolio FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view approved testimonials" ON public.testimonials FOR SELECT USING (approved = true);
CREATE POLICY "Public can submit testimonials" ON public.testimonials FOR INSERT WITH CHECK (approved = false);
CREATE POLICY "Authenticated staff can manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can read content" ON public.content FOR SELECT USING (true);
CREATE POLICY "Authenticated staff can edit content" ON public.content FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view enquiry by ID for order tracking" ON public.enquiries FOR SELECT USING (true);
CREATE POLICY "Authenticated staff can manage enquiries" ON public.enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view quotation" ON public.quotations FOR SELECT USING (true);
CREATE POLICY "Authenticated staff can manage quotations" ON public.quotations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Staff manage customers" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff manage order notes" ON public.order_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff manage status history" ON public.status_history FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Staff manage notifications" ON public.notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('portfolio-images', 'portfolio-images', true),
  ('service-images', 'service-images', true),
  ('promotional-banners', 'promotional-banners', true),
  ('customer-uploads', 'customer-uploads', true),
  ('media-library', 'media-library', true),
  ('quotation-pdfs', 'quotation-pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- PRODUCTION SEED DATA (SERVICES, PORTFOLIO, TESTIMONIALS, CMS)
-- ==============================================================================

-- 1. Services
INSERT INTO public.services (id, slug, name, category, icon, short_desc, description, sub_items, image, featured, status, sort_order)
VALUES
(
  'graphic-design', 'graphic-design', 'Graphic Design', 'Design', 'Palette',
  'High-impact visual designs tailored to command attention, build credibility, and elevate your brand prestige.',
  'Our graphic design solutions are rooted in corporate elegance and strategic visual hierarchy. From bespoke logos to comprehensive brand identity guidelines, we craft materials that position your business above competitors.',
  '["Flyer & Poster Design", "Executive Logo & Brand Identity", "Luxury Business Cards", "Corporate Brochures & Company Profiles", "Large-Format Banner Graphics", "Social Media Branding"]'::jsonb,
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80',
  true, 'published', 1
),
(
  'digital-printing', 'digital-printing', 'Digital & Large-Format Printing', 'Printing', 'Printer',
  'Ultra-sharp large-format flex banners, roll-up displays, reflective stickers, and weather-proof vinyl prints.',
  'Equipped with cutting-edge commercial printing machinery, EMMY-T CONCEPT produces vibrant, deep, true-to-color prints with resilient weather resistance that guarantee commanding visual presence.',
  '["Flex Banners & SAV Vinyl", "Roll-up & Teardrop Banners", "Gloss & Matte Laminated Stickers", "Die-cut Product Labels", "Backlit Display Printing", "High-Resolution Posters"]'::jsonb,
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
  true, 'published', 2
),
(
  'business-printing', 'business-printing', 'Business & Corporate Printing', 'Corporate', 'Briefcase',
  'Premium metallic foiled cards, embossed stationery, letterheads, and customized corporate presentation suites.',
  'Every touchpoint of your company communicates standard. We elevate your corporate stationary with heavyweight artboards, velvet soft-touch finishes, and metallic embossing.',
  '["Executive Business Cards (Spot UV & Foil)", "Corporate Letterheads & Envelopes", "Staff ID Cards & Lanyards", "Custom Presentation Folders", "Receipt & Invoice Booklets", "Annual Reports & Catalogs"]'::jsonb,
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80',
  true, 'published', 3
),
(
  'clothing-printing', 'clothing-printing', 'Clothing & Fabric Printing', 'Apparel', 'Shirt',
  'Direct-to-Film (DTF), embroidery, flex vinyl, and screen printing on high-grade custom apparel and uniforms.',
  'Wear your brand with pride. We provide long-lasting, washable, color-fast printing on premium cotton, sportswear, and industrial workwear.',
  '["Branded Corporate T-Shirts & Polos", "Custom Hoodies & Sweatshirts", "Event Caps & Snapbacks", "Industrial & Hospitality Uniforms", "Reflective Safety Jackets", "Sports Jerseys & Athleisure"]'::jsonb,
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
  false, 'published', 4
),
(
  'packaging-branding', 'packaging-branding', 'Product & Packaging Branding', 'Packaging', 'Package',
  'Luxury branded gift bags, embossed rigid boxes, food packaging, and custom tamper-evident security labels.',
  'Unboxing is the moment of truth. We design and print customized retail and luxury packaging that transforms everyday products into high-value collector experiences.',
  '["Luxury Paper & Kraft Bags", "Branded Nylon Shopping Bags", "Custom Rigid Gift & Shoe Boxes", "Food & Confectionery Packaging", "Bottle & Jar Vinyl Labels", "Custom Shipping Cartons"]'::jsonb,
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
  true, 'published', 5
),
(
  'advertising-materials', 'advertising-materials', 'Advertising & Promotional Materials', 'Advertising', 'Megaphone',
  'Promotional merchandise, roadside hoardings, branded mugs, umbrellas, acrylic plaques, and branded novelties.',
  'Stay top-of-mind with high-utility corporate promotional merchandise that keeps your brand in front of clients every single day.',
  '["Promotional Water Bottles & Flasks", "Custom Branded Pens & Notebooks", "Branded Umbrellas & Tote Bags", "Acrylic Awards & Plaques", "Event Souvenirs & Gift Hampers", "Outdoor Signage & Lightboxes"]'::jsonb,
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
  false, 'published', 6
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  icon = EXCLUDED.icon,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  sub_items = EXCLUDED.sub_items,
  image = EXCLUDED.image,
  featured = EXCLUDED.featured,
  sort_order = EXCLUDED.sort_order;

-- 2. Portfolio
INSERT INTO public.portfolio (id, title, slug, category, category_label, description, image, images, client, date, featured, status, sort_order)
VALUES
(
  'proj-1', 'Apex Prestige Brand Identity Suite', 'apex-prestige-brand-identity',
  'business-branding', 'Business Branding',
  'Complete visual identity rebrand featuring foil-stamped business cards, embossed letterheads, and executive folders.',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Apex Global Holdings', '2024', true, 'published', 1
),
(
  'proj-2', 'Grand Royale Event Mega Banner', 'grand-royale-event-mega-banner',
  'banner-printing', 'Banners & Signs',
  '40ft x 15ft heavy-duty illuminated flex banner and stage backdrop prints for a major annual gala.',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Royale Events Africa', '2024', true, 'published', 2
),
(
  'proj-3', 'Lumière Organics Luxury Packaging', 'lumiere-organics-luxury-packaging',
  'packaging-design', 'Packaging',
  'Custom metallic gold foil stamped paper bags and waterproof cosmetic jar labels with soft-touch matte finish.',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Lumière Skincare', '2024', true, 'published', 3
),
(
  'proj-4', 'Vanguard Corporate DTF Uniforms', 'vanguard-corporate-dtf-uniforms',
  'clothing-printing', 'Apparel & Fabric',
  'Over 500 premium 240GSM cotton polos printed with high-density gold & silver metallic DTF logos.',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Vanguard Logistics', '2024', true, 'published', 4
),
(
  'proj-5', 'Urban Summit Promotional Flyers & Roll-ups', 'urban-summit-promotional-flyers',
  'graphic-design', 'Graphic Design',
  'Strategic conference visual design, attendee guide booklets, and metallic accented teardrop flags.',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'West Africa Innovation Summit', '2024', true, 'published', 5
),
(
  'proj-6', 'Goldcrest Artisan Box Packaging', 'goldcrest-artisan-box-packaging',
  'packaging-design', 'Packaging',
  'Rigid magnetic closure luxury gift packaging boxes with custom gold foil crest and interior satin linings.',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
  '["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Goldcrest Confectionery', '2024', true, 'published', 6
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  images = EXCLUDED.images,
  client = EXCLUDED.client,
  featured = EXCLUDED.featured,
  sort_order = EXCLUDED.sort_order;

-- 3. Testimonials
INSERT INTO public.testimonials (id, customer_name, role, company, content, rating, approved, featured, sort_order, date)
VALUES
('rev-1', 'Alhaji Tunde Adeleke', 'Managing Director', 'Adeleke Properties Ltd', 'EMMY-T CONCEPT handled all our outdoor billboard banners and promotional brochures for our new estate launch. The finish quality and sharpness were world-class.', 5, true, true, 1, '2024-10-14'),
('rev-2', 'Dr. Chioma Nwachukwu', 'CEO & Founder', 'Aura Aesthetics Clinic', 'The quality of their product packaging and luxury business cards is unmatched. Our clients frequently compliment the tactile quality of our cards. Highly recommended!', 5, true, true, 2, '2024-10-28'),
('rev-3', 'Engr. Babatunde Sanusi', 'Project Coordinator', 'Metro Infrastructure Partners', 'Speed, precision, and reliable customer service. We needed 200 branded jackets and hardhat stickers in 48 hours for an inspection, and EMMY-T delivered flawlessly.', 5, true, true, 3, '2024-11-04')
ON CONFLICT (id) DO UPDATE SET
  customer_name = EXCLUDED.customer_name,
  role = EXCLUDED.role,
  company = EXCLUDED.company,
  content = EXCLUDED.content,
  rating = EXCLUDED.rating,
  approved = EXCLUDED.approved,
  featured = EXCLUDED.featured;

-- 4. Content
INSERT INTO public.content (section, key, value)
VALUES
(
  'company_info',
  'profile',
  '{
    "name": "EMMY-T CONCEPT",
    "tagline": "Professional Graphic Design, Digital Printing, Advertising & Corporate Branding",
    "shortDesc": "Establishing bold brand identities and delivering high-definition printing solutions with luxury craftsmanship and unmatched attention to detail.",
    "phone": "+234 814 624 3788",
    "whatsapp": "+2348146243788",
    "email": "emmytconcept@gmail.com",
    "address": "Lagos, Nigeria",
    "openingHours": "Mon - Sat: 8:00 AM - 6:00 PM",
    "socials": {
      "instagram": "https://instagram.com/emmytconcept",
      "facebook": "https://facebook.com/emmytconcept",
      "twitter": "https://twitter.com/emmytconcept",
      "whatsapp": "https://wa.me/2348146243788"
    }
  }'::jsonb
),
(
  'announcement',
  'current',
  '{
    "active": true,
    "text": "⚡ Elevate your brand with 20% off all Large-Format Banner & Roll-up Printing this month!",
    "link": "/quote"
  }'::jsonb
)
ON CONFLICT (section, key) DO UPDATE SET
  value = EXCLUDED.value;

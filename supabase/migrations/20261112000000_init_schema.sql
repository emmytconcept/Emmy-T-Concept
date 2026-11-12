-- ==============================================================================
-- EMMY-T CONCEPT — Production Supabase Schema Migration
-- Migration: 20261112000000_init_schema.sql
-- Description: Core tables, RLS policies, automated triggers, and storage buckets.
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
  id              TEXT PRIMARY KEY,                  -- string/uuid e.g. 'rev-1' or '1'
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
  section         TEXT NOT NULL,                     -- 'company_info', 'announcement', 'hero', 'about'
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

-- 1. Auto-update updated_at timestamp
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

-- 2. Auto-notification on new enquiry / contact message
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

-- 3. Auto status history tracking
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

-- SERVICES: Anyone can view published services; staff can manage
CREATE POLICY "Public can view published services"
  ON public.services FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated staff can manage services"
  ON public.services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- PORTFOLIO: Anyone can view published projects; staff can manage
CREATE POLICY "Public can view published portfolio"
  ON public.portfolio FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated staff can manage portfolio"
  ON public.portfolio FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- TESTIMONIALS: Public can view approved; Anyone can submit a review
CREATE POLICY "Public can view approved testimonials"
  ON public.testimonials FOR SELECT
  USING (approved = true);

CREATE POLICY "Public can submit testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (approved = false);

CREATE POLICY "Authenticated staff can manage testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- CONTENT & ANNOUNCEMENTS: Public can view; staff can edit
CREATE POLICY "Public can read content"
  ON public.content FOR SELECT
  USING (true);

CREATE POLICY "Authenticated staff can edit content"
  ON public.content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ENQUIRIES: Public can insert their own quote/contact requests; Anyone can view by ID (for order tracking); Staff full access
CREATE POLICY "Public can insert enquiries"
  ON public.enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view enquiry by ID for order tracking"
  ON public.enquiries FOR SELECT
  USING (true);

CREATE POLICY "Authenticated staff can manage enquiries"
  ON public.enquiries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- QUOTATIONS: Authenticated staff can manage; Public can view by ID/enquiryId
CREATE POLICY "Public can view quotation"
  ON public.quotations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated staff can manage quotations"
  ON public.quotations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- CUSTOMERS, ORDER NOTES, NOTIFICATIONS: Staff access only
CREATE POLICY "Staff manage customers"
  ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Staff manage order notes"
  ON public.order_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Staff manage status history"
  ON public.status_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Staff manage notifications"
  ON public.notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS CONFIGURATION
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


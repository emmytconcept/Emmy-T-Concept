-- ==============================================================================
-- EMMY-T CONCEPT — Storage RLS Policies & LinkedIn Integration
-- Migration: 20261112000003_storage_policies_and_linkedin.sql
-- Description: Configures row-level security policies on storage.objects for
--              public/admin bucket access, and adds LinkedIn to company profile.
-- ==============================================================================

-- 1. Ensure all standard buckets are present and marked public
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('portfolio-images', 'portfolio-images', true),
  ('service-images', 'service-images', true),
  ('promotional-banners', 'promotional-banners', true),
  ('customer-uploads', 'customer-uploads', true),
  ('media-library', 'media-library', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage Policies on storage.objects
DROP POLICY IF EXISTS "Public Access to Public Buckets" ON storage.objects;
CREATE POLICY "Public Access to Public Buckets"
ON storage.objects FOR SELECT
USING (bucket_id IN ('portfolio-images', 'service-images', 'promotional-banners', 'customer-uploads', 'media-library'));

DROP POLICY IF EXISTS "Allow public uploads to customer-uploads" ON storage.objects;
CREATE POLICY "Allow public uploads to customer-uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'customer-uploads');

DROP POLICY IF EXISTS "Allow authenticated full access to storage" ON storage.objects;
CREATE POLICY "Allow authenticated full access to storage"
ON storage.objects FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Add LinkedIn to company profile socials in content table
UPDATE public.content
SET value = jsonb_set(
  value,
  '{socials,linkedin}',
  '"https://linkedin.com/company/emmytconcept"'
)
WHERE section = 'company_info' AND key = 'profile';


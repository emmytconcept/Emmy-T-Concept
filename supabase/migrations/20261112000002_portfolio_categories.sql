-- ==============================================================================
-- EMMY-T CONCEPT — Portfolio Categories Dynamic CMS Migration
-- Migration: 20261112000002_portfolio_categories.sql
-- Description: Seeds the dynamic portfolio categories into the content table
--              so administrators can add, edit, and manage categories directly.
-- ==============================================================================

INSERT INTO public.content (section, key, value)
VALUES
(
  'portfolio',
  'categories',
  '[
    {"id": "all", "label": "All Projects"},
    {"id": "graphic-design", "label": "Graphic Design"},
    {"id": "banner-printing", "label": "Banners & Signs"},
    {"id": "business-branding", "label": "Business Branding"},
    {"id": "packaging-design", "label": "Packaging"},
    {"id": "clothing-printing", "label": "Apparel & Fabric"}
  ]'::jsonb
)
ON CONFLICT (section, key) DO UPDATE SET
  value = EXCLUDED.value;


-- ==============================================================================
-- EMMY-T CONCEPT — Production Database Seed Data
-- File: supabase/seed.sql
-- Description: Seeds the official company services, portfolio showcase, 
--              approved client testimonials, and CMS content.
-- Note: Real empty start for enquiries/orders (no mock fake orders seeded).
-- ==============================================================================

-- 1. SEED SERVICES (6 Official EMMY-T Offerings)
INSERT INTO public.services (id, slug, name, category, icon, short_desc, description, sub_items, image, featured, status, sort_order)
VALUES
(
  'graphic-design',
  'graphic-design',
  'Graphic Design',
  'Design',
  'Palette',
  'High-impact visual designs tailored to command attention, build credibility, and elevate your brand prestige.',
  'Our graphic design solutions are rooted in corporate elegance and strategic visual hierarchy. From bespoke logos to comprehensive brand identity guidelines, we craft materials that position your business above competitors.',
  '["Flyer & Poster Design", "Executive Logo & Brand Identity", "Luxury Business Cards", "Corporate Brochures & Company Profiles", "Large-Format Banner Graphics", "Social Media Branding"]'::jsonb,
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80',
  true,
  'published',
  1
),
(
  'digital-printing',
  'digital-printing',
  'Digital & Large-Format Printing',
  'Printing',
  'Printer',
  'Ultra-sharp large-format flex banners, roll-up displays, reflective stickers, and weather-proof vinyl prints.',
  'Equipped with cutting-edge commercial printing machinery, EMMY-T CONCEPT produces vibrant, deep, true-to-color prints with resilient weather resistance that guarantee commanding visual presence.',
  '["Flex Banners & SAV Vinyl", "Roll-up & Teardrop Banners", "Gloss & Matte Laminated Stickers", "Die-cut Product Labels", "Backlit Display Printing", "High-Resolution Posters"]'::jsonb,
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
  true,
  'published',
  2
),
(
  'business-printing',
  'business-printing',
  'Business & Corporate Printing',
  'Corporate',
  'Briefcase',
  'Premium metallic foiled cards, embossed stationery, letterheads, and customized corporate presentation suites.',
  'Every touchpoint of your company communicates standard. We elevate your corporate stationary with heavyweight artboards, velvet soft-touch finishes, and metallic embossing.',
  '["Executive Business Cards (Spot UV & Foil)", "Corporate Letterheads & Envelopes", "Staff ID Cards & Lanyards", "Custom Presentation Folders", "Receipt & Invoice Booklets", "Annual Reports & Catalogs"]'::jsonb,
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80',
  true,
  'published',
  3
),
(
  'clothing-printing',
  'clothing-printing',
  'Clothing & Fabric Printing',
  'Apparel',
  'Shirt',
  'Direct-to-Film (DTF), embroidery, flex vinyl, and screen printing on high-grade custom apparel and uniforms.',
  'Wear your brand with pride. We provide long-lasting, washable, color-fast printing on premium cotton, sportswear, and industrial workwear.',
  '["Branded Corporate T-Shirts & Polos", "Custom Hoodies & Sweatshirts", "Event Caps & Snapbacks", "Industrial & Hospitality Uniforms", "Reflective Safety Jackets", "Sports Jerseys & Athleisure"]'::jsonb,
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
  false,
  'published',
  4
),
(
  'packaging-branding',
  'packaging-branding',
  'Product & Packaging Branding',
  'Packaging',
  'Package',
  'Luxury branded gift bags, embossed rigid boxes, food packaging, and custom tamper-evident security labels.',
  'Unboxing is the moment of truth. We design and print customized retail and luxury packaging that transforms everyday products into high-value collector experiences.',
  '["Luxury Paper & Kraft Bags", "Branded Nylon Shopping Bags", "Custom Rigid Gift & Shoe Boxes", "Food & Confectionery Packaging", "Bottle & Jar Vinyl Labels", "Custom Shipping Cartons"]'::jsonb,
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
  true,
  'published',
  5
),
(
  'advertising-materials',
  'advertising-materials',
  'Advertising & Promotional Materials',
  'Advertising',
  'Megaphone',
  'Promotional merchandise, roadside hoardings, branded mugs, umbrellas, acrylic plaques, and branded novelties.',
  'Stay top-of-mind with high-utility corporate promotional merchandise that keeps your brand in front of clients every single day.',
  '["Promotional Water Bottles & Flasks", "Custom Branded Pens & Notebooks", "Branded Umbrellas & Tote Bags", "Acrylic Awards & Plaques", "Event Souvenirs & Gift Hampers", "Outdoor Signage & Lightboxes"]'::jsonb,
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
  false,
  'published',
  6
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

-- 2. SEED PORTFOLIO (6 Flagship Completed Projects)
INSERT INTO public.portfolio (id, title, slug, category, category_label, description, image, images, client, date, featured, status, sort_order)
VALUES
(
  'proj-1',
  'Apex Prestige Brand Identity Suite',
  'apex-prestige-brand-identity',
  'business-branding',
  'Business Branding',
  'Complete visual identity rebrand featuring foil-stamped business cards, embossed letterheads, and executive folders.',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  '[
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80"
  ]'::jsonb,
  'Apex Global Holdings',
  '2024',
  true,
  'published',
  1
),
(
  'proj-2',
  'Grand Royale Event Mega Banner',
  'grand-royale-event-mega-banner',
  'banner-printing',
  'Banners & Signs',
  '40ft x 15ft heavy-duty illuminated flex banner and stage backdrop prints for a major annual gala.',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80',
  '[
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80"
  ]'::jsonb,
  'Royale Events Africa',
  '2024',
  true,
  'published',
  2
),
(
  'proj-3',
  'Lumière Organics Luxury Packaging',
  'lumiere-organics-luxury-packaging',
  'packaging-design',
  'Packaging',
  'Custom metallic gold foil stamped paper bags and waterproof cosmetic jar labels with soft-touch matte finish.',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  '[
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=80"
  ]'::jsonb,
  'Lumière Skincare',
  '2024',
  true,
  'published',
  3
),
(
  'proj-4',
  'Vanguard Corporate DTF Uniforms',
  'vanguard-corporate-dtf-uniforms',
  'clothing-printing',
  'Apparel & Fabric',
  'Over 500 premium 240GSM cotton polos printed with high-density gold & silver metallic DTF logos.',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  '[
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80"
  ]'::jsonb,
  'Vanguard Logistics',
  '2024',
  true,
  'published',
  4
),
(
  'proj-5',
  'Urban Summit Promotional Flyers & Roll-ups',
  'urban-summit-promotional-flyers',
  'graphic-design',
  'Graphic Design',
  'Strategic conference visual design, attendee guide booklets, and metallic accented teardrop flags.',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80',
  '[
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80"
  ]'::jsonb,
  'West Africa Innovation Summit',
  '2024',
  true,
  'published',
  5
),
(
  'proj-6',
  'Goldcrest Artisan Box Packaging',
  'goldcrest-artisan-box-packaging',
  'packaging-design',
  'Packaging',
  'Rigid magnetic closure luxury gift packaging boxes with custom gold foil crest and interior satin linings.',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
  '[
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80"
  ]'::jsonb,
  'Goldcrest Confectionery',
  '2024',
  true,
  'published',
  6
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

-- 3. SEED TESTIMONIALS (Approved Client Reviews)
INSERT INTO public.testimonials (id, customer_name, role, company, content, rating, approved, featured, sort_order, date)
VALUES
(
  'rev-1',
  'Alhaji Tunde Adeleke',
  'Managing Director',
  'Adeleke Properties Ltd',
  'EMMY-T CONCEPT handled all our outdoor billboard banners and promotional brochures for our new estate launch. The finish quality and sharpness were world-class.',
  5,
  true,
  true,
  1,
  '2024-10-14'
),
(
  'rev-2',
  'Dr. Chioma Nwachukwu',
  'CEO & Founder',
  'Aura Aesthetics Clinic',
  'The quality of their product packaging and luxury business cards is unmatched. Our clients frequently compliment the tactile quality of our cards. Highly recommended!',
  5,
  true,
  true,
  2,
  '2024-10-28'
),
(
  'rev-3',
  'Engr. Babatunde Sanusi',
  'Project Coordinator',
  'Metro Infrastructure Partners',
  'Speed, precision, and reliable customer service. We needed 200 branded jackets and hardhat stickers in 48 hours for an inspection, and EMMY-T delivered flawlessly.',
  5,
  true,
  true,
  3,
  '2024-11-04'
)
ON CONFLICT (id) DO UPDATE SET
  customer_name = EXCLUDED.customer_name,
  role = EXCLUDED.role,
  company = EXCLUDED.company,
  content = EXCLUDED.content,
  rating = EXCLUDED.rating,
  approved = EXCLUDED.approved,
  featured = EXCLUDED.featured;

-- 4. SEED CMS CONTENT (Company Info & Announcements)
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

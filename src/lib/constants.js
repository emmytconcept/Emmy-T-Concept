export const COMPANY_INFO = {
  name: "EMMY-T CONCEPT",
  tagline: "Professional Graphic Design, Digital Printing, Advertising & Corporate Branding",
  shortDesc: "Establishing bold brand identities and delivering high-definition printing solutions with luxury craftsmanship and unmatched attention to detail.",
  phone: "+234 814 624 3788", // Editable via CMS / Env
  whatsapp: "+2348146243788",
  email: "emmytconcept@gmail.com",
  address: "Lagos, Nigeria",
  openingHours: "Mon - Sat: 8:00 AM - 6:00 PM",
  socials: {
    instagram: "https://instagram.com/emmytconcept",
    facebook: "https://facebook.com/emmytconcept",
    twitter: "https://twitter.com/emmytconcept",
    whatsapp: "https://wa.me/2348146243788",
  },
  colors: {
    black: "#080808",
    gold: "#d9a323",
    silver: "#c6c8cc",
    white: "#ffffff",
  }
};

export const INITIAL_SERVICES = [
  {
    id: "graphic-design",
    slug: "graphic-design",
    name: "Graphic Design",
    category: "Design",
    icon: "Palette",
    shortDesc: "High-impact visual designs tailored to command attention, build credibility, and elevate your brand prestige.",
    featured: true,
    sortOrder: 1,
    subItems: [
      "Flyer & Poster Design",
      "Executive Logo & Brand Identity",
      "Luxury Business Cards",
      "Corporate Brochures & Company Profiles",
      "Large-Format Banner Graphics",
      "Social Media Branding"
    ],
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80",
    description: "Our graphic design solutions are rooted in corporate elegance and strategic visual hierarchy. From bespoke logos to comprehensive brand identity guidelines, we craft materials that position your business above competitors."
  },
  {
    id: "digital-printing",
    slug: "digital-printing",
    name: "Digital & Large-Format Printing",
    category: "Printing",
    icon: "Printer",
    shortDesc: "Ultra-sharp large-format flex banners, roll-up displays, reflective stickers, and weather-proof vinyl prints.",
    featured: true,
    sortOrder: 2,
    subItems: [
      "Flex Banners & SAV Vinyl",
      "Roll-up & Teardrop Banners",
      "Gloss & Matte Laminated Stickers",
      "Die-cut Product Labels",
      "Backlit Display Printing",
      "High-Resolution Posters"
    ],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
    description: "Equipped with cutting-edge commercial printing machinery, EMMY-T CONCEPT produces vibrant, deep, true-to-color prints with resilient weather resistance that guarantee commanding visual presence."
  },
  {
    id: "business-printing",
    slug: "business-printing",
    name: "Business & Corporate Printing",
    category: "Corporate",
    icon: "Briefcase",
    shortDesc: "Premium metallic foiled cards, embossed stationery, letterheads, and customized corporate presentation suites.",
    featured: true,
    sortOrder: 3,
    subItems: [
      "Executive Business Cards (Spot UV & Foil)",
      "Corporate Letterheads & Envelopes",
      "Staff ID Cards & Lanyards",
      "Custom Presentation Folders",
      "Receipt & Invoice Booklets",
      "Annual Reports & Catalogs"
    ],
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80",
    description: "Every touchpoint of your company communicates standard. We elevate your corporate stationary with heavyweight artboards, velvet soft-touch finishes, and metallic embossing."
  },
  {
    id: "clothing-printing",
    slug: "clothing-printing",
    name: "Clothing & Fabric Printing",
    category: "Apparel",
    icon: "Shirt",
    shortDesc: "Direct-to-Film (DTF), embroidery, flex vinyl, and screen printing on high-grade custom apparel and uniforms.",
    featured: false,
    sortOrder: 4,
    subItems: [
      "Branded Corporate T-Shirts & Polos",
      "Custom Hoodies & Sweatshirts",
      "Event Caps & Snapbacks",
      "Industrial & Hospitality Uniforms",
      "Reflective Safety Jackets",
      "Sports Jerseys & Athleisure"
    ],
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
    description: "Wear your brand with pride. We provide long-lasting, washable, color-fast printing on premium cotton, sportswear, and industrial workwear."
  },
  {
    id: "packaging-branding",
    slug: "packaging-branding",
    name: "Product & Packaging Branding",
    category: "Packaging",
    icon: "Package",
    shortDesc: "Luxury branded gift bags, embossed rigid boxes, food packaging, and custom tamper-evident security labels.",
    featured: true,
    sortOrder: 5,
    subItems: [
      "Luxury Paper & Kraft Bags",
      "Branded Nylon Shopping Bags",
      "Custom Rigid Gift & Shoe Boxes",
      "Food & Confectionery Packaging",
      "Bottle & Jar Vinyl Labels",
      "Custom Shipping Cartons"
    ],
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80",
    description: "Unboxing is the moment of truth. We design and print customized retail and luxury packaging that transforms everyday products into high-value collector experiences."
  },
  {
    id: "advertising-materials",
    slug: "advertising-materials",
    name: "Advertising & Promotional Materials",
    category: "Advertising",
    icon: "Megaphone",
    shortDesc: "Promotional merchandise, roadside hoardings, branded mugs, umbrellas, acrylic plaques, and branded novelties.",
    featured: false,
    sortOrder: 6,
    subItems: [
      "Promotional Water Bottles & Flasks",
      "Custom Branded Pens & Notebooks",
      "Branded Umbrellas & Tote Bags",
      "Acrylic Awards & Plaques",
      "Event Souvenirs & Gift Hampers",
      "Outdoor Signage & Lightboxes"
    ],
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80",
    description: "Stay top-of-mind with high-utility corporate promotional merchandise that keeps your brand in front of clients every single day."
  }
];

export const PORTFOLIO_CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "graphic-design", label: "Graphic Design" },
  { id: "banner-printing", label: "Banners & Signs" },
  { id: "business-branding", label: "Business Branding" },
  { id: "packaging-design", label: "Packaging" },
  { id: "clothing-printing", label: "Apparel & Fabric" },
];

export const INITIAL_PORTFOLIO = [
  {
    id: "proj-1",
    title: "Apex Prestige Brand Identity Suite",
    category: "business-branding",
    categoryLabel: "Business Branding",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Complete visual identity rebrand featuring foil-stamped business cards, embossed letterheads, and executive folders.",
    client: "Apex Global Holdings",
    date: "2024",
    featured: true,
  },
  {
    id: "proj-2",
    title: "Grand Royale Event Mega Banner",
    category: "banner-printing",
    categoryLabel: "Banners & Signs",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "40ft x 15ft heavy-duty illuminated flex banner and stage backdrop prints for a major annual gala.",
    client: "Royale Events Africa",
    date: "2024",
    featured: true,
  },
  {
    id: "proj-3",
    title: "Lumière Organics Luxury Packaging",
    category: "packaging-design",
    categoryLabel: "Packaging",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Custom metallic gold foil stamped paper bags and waterproof cosmetic jar labels with soft-touch matte finish.",
    client: "Lumière Skincare",
    date: "2024",
    featured: true,
  },
  {
    id: "proj-4",
    title: "Vanguard Corporate DTF Uniforms",
    category: "clothing-printing",
    categoryLabel: "Apparel & Fabric",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Over 500 premium 240GSM cotton polos printed with high-density gold & silver metallic DTF logos.",
    client: "Vanguard Logistics",
    date: "2024",
    featured: true,
  },
  {
    id: "proj-5",
    title: "Urban Summit Promotional Flyers & Roll-ups",
    category: "graphic-design",
    categoryLabel: "Graphic Design",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Strategic conference visual design, attendee guide booklets, and metallic accented teardrop flags.",
    client: "West Africa Innovation Summit",
    date: "2024",
    featured: true,
  },
  {
    id: "proj-6",
    title: "Goldcrest Artisan Box Packaging",
    category: "packaging-design",
    categoryLabel: "Packaging",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Rigid magnetic closure luxury gift packaging boxes with custom gold foil crest and interior satin linings.",
    client: "Goldcrest Confectionery",
    date: "2024",
    featured: true,
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Alhaji Tunde Adeleke",
    role: "Managing Director",
    company: "Adeleke Properties Ltd",
    content: "EMMY-T CONCEPT handled all our outdoor billboard banners and promotional brochures for our new estate launch. The finish quality and sharpness were world-class.",
    rating: 5,
    approved: true,
    featured: true,
    date: "2024-10-14",
  },
  {
    id: 2,
    name: "Dr. Chioma Nwachukwu",
    role: "CEO & Founder",
    company: "Aura Aesthetics Clinic",
    content: "The quality of their product packaging and luxury business cards is unmatched. Our clients frequently compliment the tactile quality of our cards. Highly recommended!",
    rating: 5,
    approved: true,
    featured: true,
    date: "2024-10-28",
  },
  {
    id: 3,
    name: "Engr. Babatunde Sanusi",
    role: "Project Coordinator",
    company: "Metro Infrastructure Partners",
    content: "Speed, precision, and reliable customer service. We needed 200 branded jackets and hardhat stickers in 48 hours for an inspection, and EMMY-T delivered flawlessly.",
    rating: 5,
    approved: true,
    featured: true,
    date: "2024-11-04",
  }
];

export const ORDER_STATUSES = {
  new_enquiry: { label: "New Enquiry", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  awaiting_quotation: { label: "Awaiting Quote", bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  quotation_sent: { label: "Quote Sent", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  awaiting_payment: { label: "Awaiting Payment", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  in_production: { label: "In Production", bg: "bg-[#d9a323]/15", text: "text-[#d9a323]", border: "border-[#d9a323]/40" },
  ready_for_collection: { label: "Ready for Pickup", bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/30" },
  dispatched: { label: "Dispatched", bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  completed: { label: "Completed", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  cancelled: { label: "Cancelled", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
};


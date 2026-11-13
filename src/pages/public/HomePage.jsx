import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Edit3,
  ShieldCheck,
  Zap,
  Award,
  Layers,
  CheckCircle2,
  Palette,
  Printer,
  Briefcase,
  Shirt,
  Package,
  Megaphone,
  Star,
  Quote as QuoteIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Images,
  Eye
} from 'lucide-react'
import { WhatsAppIcon } from '../../components/shared/SocialIcons'
import { useAppStore } from '../../store/useAppStore'

const iconMap = {
  Palette,
  Printer,
  Briefcase,
  Shirt,
  Package,
  Megaphone
}

export default function HomePage() {
  const { services, portfolio, portfolioCategories, testimonials, companyInfo, submitCustomerReview } = useAppStore()
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeModalProject, setActiveModalProject] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Review form state
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
  })

  const approvedTestimonials = testimonials.filter((t) => t.approved !== false)

  const featuredServices = services.slice(0, 6)
  const filteredPortfolio = activeCategory === 'all'
    ? portfolio.slice(0, 6)
    : portfolio.filter(p => p.category === activeCategory).slice(0, 6)

  const handleOpenModal = (project) => {
    setActiveModalProject(project)
    setActiveImageIndex(0)
  }

  const currentImages = activeModalProject
    ? (activeModalProject.images && activeModalProject.images.length > 0
        ? activeModalProject.images
        : [activeModalProject.image])
    : []

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation()
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1))
  }

  const handleNextImage = (e) => {
    if (e) e.stopPropagation()
    setActiveImageIndex((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0))
  }

  const cleanWhatsApp = (companyInfo.whatsapp || '').replace(/[^0-9]/g, '')

  return (
    <div className="relative">
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Inspired by Minimalist Fashion/Design Stage) */}
      {/* ======================================================== */}
      <section className="relative pt-12 sm:pt-20 pb-20 overflow-hidden border-b border-white/5">
        {/* Subtle Architectural Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          
          {/* Studio Category Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#d9a323] mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#d9a323] animate-pulse" />
            <span>Design Studio · Commercial Press · Corporate Branding</span>
          </motion.div>

          {/* Bold, Confident Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-sans font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto"
          >
            Where Brand Vision Meets Precision Print.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#9ca3af] max-w-2xl mx-auto font-normal leading-relaxed pt-5"
          >
            <strong className="text-white font-medium">EMMY-T CONCEPT</strong> engineers luxury visual identities, high-definition large-format displays, bespoke packaging, and branded executive apparel that command commercial authority.
          </motion.p>

          {/* Sleek Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-8"
          >
            <Link
              to="/quote"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#d9a323] hover:bg-[#e5b338] text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-[#d9a323]/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <span>Request A Quote</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/portfolio"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-white/15 hover:border-white/40 bg-white/[0.03] hover:bg-white/[0.08] text-white text-xs font-semibold tracking-wider uppercase hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
            >
              Explore Portfolio
            </Link>

            <Link
              to="/track"
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg border border-[#d9a323]/30 hover:border-[#d9a323] bg-[#d9a323]/5 hover:bg-[#d9a323]/10 text-[#d9a323] text-xs font-semibold tracking-wider uppercase hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>
          </motion.div>

          {/* ======================================================== */}
          {/* PANORAMIC CURVED SHOWCASE STAGE (Inspired by Reference) */}
          {/* ======================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pt-14 sm:pt-20"
          >
            <div className="flex items-center justify-between text-xs text-[#8e9196] font-mono uppercase tracking-wider mb-6 px-3 max-w-6xl mx-auto">
              <span>// RECENT COMMISSIONS ARCHIVE</span>
              <span className="text-[11px] text-[#d9a323]">TAP ANY WORK TO INSPECT</span>
            </div>

            {/* Desktop Panoramic Arc (6 images, sm and up) */}
            <div className="hidden sm:flex items-end justify-center gap-3 lg:gap-4 max-w-6xl mx-auto px-4 [perspective:1200px] min-h-[360px] pb-4">
              {portfolio.slice(0, 6).map((proj, idx) => {
                const configs = [
                  { rotate: '-12deg', y: '16px', scale: '0.94' },
                  { rotate: '-6deg', y: '6px', scale: '0.98' },
                  { rotate: '-1.5deg', y: '-6px', scale: '1.02' },
                  { rotate: '1.5deg', y: '-6px', scale: '1.02' },
                  { rotate: '6deg', y: '6px', scale: '0.98' },
                  { rotate: '12deg', y: '16px', scale: '0.94' },
                ]
                const conf = configs[idx] || configs[0]

                return (
                  <div
                    key={proj.id}
                    onClick={() => handleOpenModal(proj)}
                    style={{
                      transform: `perspective(1200px) rotateY(${conf.rotate}) translateY(${conf.y}) scale(${conf.scale})`,
                    }}
                    className="group relative flex-1 aspect-[9/14] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#d9a323] cursor-pointer shadow-2xl transition-all duration-300 ease-out hover:z-30 hover:scale-105 hover:!translate-y-[-12px] hover:!rotate-0 hover:shadow-[0_20px_40px_rgba(217,163,35,0.3)]"
                  >
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Clean Full-Bleed Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                    {/* Bottom Info Pill */}
                    <div className="absolute inset-x-0 bottom-0 p-3 text-left space-y-0.5">
                      <p className="text-[9px] font-mono font-bold tracking-wider uppercase text-[#d9a323]">
                        {proj.categoryLabel || proj.category}
                      </p>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#d9a323] transition-colors leading-tight line-clamp-1">
                        {proj.title}
                      </h4>
                      <p className="text-[10px] text-[#8e9196] truncate font-mono pt-0.5">
                        {proj.client}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mobile Mini Panoramic Arc (3 curated images on the exact same curved stage, < sm) */}
            <div className="flex sm:hidden items-end justify-center gap-2 max-w-sm mx-auto px-2 [perspective:800px] min-h-[280px] pb-4">
              {portfolio.slice(0, 3).map((proj, idx) => {
                if (!proj) return null
                const mobileConfigs = [
                  { rotate: '-14deg', y: '12px', scale: '0.92', zIndex: 'z-0' },
                  { rotate: '0deg', y: '-8px', scale: '1.06', zIndex: 'z-10' },
                  { rotate: '14deg', y: '12px', scale: '0.92', zIndex: 'z-0' },
                ]
                const conf = mobileConfigs[idx] || mobileConfigs[0]

                return (
                  <div
                    key={proj.id}
                    onClick={() => handleOpenModal(proj)}
                    style={{
                      transform: `perspective(800px) rotateY(${conf.rotate}) translateY(${conf.y}) scale(${conf.scale})`,
                    }}
                    className={`group relative flex-1 aspect-[9/15] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#d9a323] cursor-pointer shadow-2xl transition-all duration-300 ease-out active:scale-105 active:!rotate-0 ${conf.zIndex}`}
                  >
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Clean Full-Bleed Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Bottom Info Pill */}
                    <div className="absolute inset-x-0 bottom-0 p-2.5 text-left space-y-0.5">
                      <p className="text-[8px] font-mono font-bold tracking-wider uppercase text-[#d9a323]">
                        {proj.categoryLabel || proj.category}
                      </p>
                      <h4 className="text-[11px] font-bold text-white leading-tight line-clamp-1">
                        {proj.title}
                      </h4>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Studio Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-center text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="font-heading text-xl font-bold text-white">500+</p>
                <p className="text-[10px] text-[#8e9196] uppercase font-mono tracking-wider mt-0.5">Corporate Commissions</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="font-heading text-xl font-bold text-[#d9a323]">24-48h</p>
                <p className="text-[10px] text-[#8e9196] uppercase font-mono tracking-wider mt-0.5">Express Production</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="font-heading text-xl font-bold text-white">100%</p>
                <p className="text-[10px] text-[#8e9196] uppercase font-mono tracking-wider mt-0.5">Pantone Proof Fidelity</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="font-heading text-xl font-bold text-[#d9a323]">Lagos HQ</p>
                <p className="text-[10px] text-[#8e9196] uppercase font-mono tracking-wider mt-0.5">Nationwide Dispatch</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. FEATURED SERVICES SECTION */}
      {/* ======================================================== */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-mono tracking-[0.25em] text-[#d9a323] uppercase">
              // 01 · CORE CAPABILITIES
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Comprehensive Creative & Printing Solutions
            </h2>
            <div className="w-16 h-1 bg-[#d9a323] mx-auto rounded-full" />
            <p className="text-sm text-[#8e9196] leading-relaxed pt-2">
              From bespoke visual identities and large-format banners to luxury retail packaging, explore our full suite of precision production capabilities.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, idx) => {
              const IconComponent = iconMap[service.icon] || Layers
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group"
                >
                  {/* Service Image Header */}
                  <div className="relative h-48 overflow-hidden bg-neutral-900">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                    
                    {/* Floating Icon Badge */}
                    <div className="absolute top-4 right-4 w-11 h-11 rounded-xl bg-[#080808]/90 border border-[#d9a323]/40 flex items-center justify-center text-[#d9a323] shadow-lg group-hover:bg-[#d9a323] group-hover:text-black transition-colors duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-white group-hover:text-[#d9a323] transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-xs text-[#8e9196] mt-2 leading-relaxed">
                        {service.shortDesc}
                      </p>

                      {/* Sub-items Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {service.subItems?.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#c6c8cc]"
                          >
                            {item}
                          </span>
                        ))}
                        {service.subItems?.length > 3 && (
                          <span className="text-[11px] px-1.5 py-0.5 text-[#d9a323]">
                            +{service.subItems.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <Link
                        to={`/services/${service.slug}`}
                        className="text-xs font-semibold text-[#d9a323] hover:underline flex items-center gap-1 group/link"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-link-hover:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        to={`/quote?service=${service.slug}`}
                        className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded bg-white/5 hover:bg-[#d9a323] hover:text-black border border-white/10 text-white transition-all"
                      >
                        Get Quote
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* View All CTA */}
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border border-[#d9a323]/50 text-[#d9a323] hover:bg-[#d9a323] hover:text-black text-xs font-bold uppercase tracking-wider transition-all duration-300"
            >
              <span>Browse All Services & Options</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SELECTED PORTFOLIO SHOWCASE */}
      {/* ======================================================== */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <p className="text-xs font-mono tracking-[0.25em] text-[#d9a323] uppercase">
                // 02 · COMMISSIONS ARCHIVE
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                Selected Portfolio Projects
              </h2>
              <div className="w-16 h-1 bg-[#d9a323] rounded-full" />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {(portfolioCategories && portfolioCategories.length > 0
                ? portfolioCategories.slice(0, 5)
                : [
                    { id: 'all', label: 'All' },
                    { id: 'business-branding', label: 'Branding' },
                    { id: 'banner-printing', label: 'Banners & Stickers' },
                    { id: 'packaging-design', label: 'Packaging' },
                    { id: 'clothing-printing', label: 'Apparel' },
                  ]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all ${
                    activeCategory === tab.id
                      ? 'bg-[#d9a323] border-[#d9a323] text-black font-bold shadow'
                      : 'bg-white/5 border-white/10 text-[#8e9196] hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolio.map((project, idx) => {
              const projectPhotosCount = project.images?.length || 1

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleOpenModal(project)}
                  className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-[#d9a323]/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-900 relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Hover Quick View Pill */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                      <span className="px-3.5 py-1.5 rounded-full bg-[#080808]/90 border border-[#d9a323] text-xs font-bold text-[#d9a323] flex items-center gap-1.5 shadow-2xl backdrop-blur-md">
                        <Eye className="w-3.5 h-3.5" /> View ({projectPhotosCount} Photos)
                      </span>
                    </div>

                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#080808]/90 border border-white/10 text-[#d9a323] backdrop-blur-sm">
                      {project.categoryLabel}
                    </span>

                    {projectPhotosCount > 1 && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded bg-black/80 text-white border border-white/20 flex items-center gap-1 backdrop-blur-md">
                        <Images className="w-3 h-3 text-[#d9a323]" /> {projectPhotosCount}
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#8e9196]">
                      <span>Client: {project.client}</span>
                      <span>{project.date}</span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#d9a323] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#8e9196] line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="pt-3 flex items-center justify-between text-xs border-t border-white/5">
                      <span className="text-[11px] text-[#d9a323] font-semibold">
                        Click to view photos
                      </span>
                      <ArrowRight className="w-3 h-3 text-[#d9a323]" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Modal Multi-Image Lightbox for Homepage */}
          {activeModalProject && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-fade-in overflow-y-auto"
              onClick={() => setActiveModalProject(null)}
            >
              <div
                className="glass-panel rounded-3xl max-w-4xl w-full border border-[#d9a323]/40 overflow-hidden shadow-2xl shadow-black relative my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center hover:bg-[#d9a323] hover:text-black transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Photo Counter */}
                {currentImages.length > 1 && (
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/80 border border-[#d9a323]/50 text-xs font-mono font-bold text-[#d9a323] backdrop-blur-md">
                    Photo {activeImageIndex + 1} of {currentImages.length}
                  </div>
                )}

                {/* Main Image with side arrows */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-black flex items-center justify-center select-none overflow-hidden group">
                  <img
                    key={activeImageIndex}
                    src={currentImages[activeImageIndex]}
                    alt={`${activeModalProject.title} - View ${activeImageIndex + 1}`}
                    className="w-full h-full object-contain max-h-[65vh] transition-all duration-300"
                  />

                  {currentImages.length > 1 && (
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-[#d9a323] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
                      title="Previous Photo"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}

                  {currentImages.length > 1 && (
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-[#d9a323] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
                      title="Next Photo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {currentImages.length > 1 && (
                  <div className="p-3 bg-[#0a0a0a] border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto">
                    {currentImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIndex === idx
                            ? 'border-[#d9a323] scale-105 shadow-md shadow-[#d9a323]/30'
                            : 'border-white/20 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Modal Details */}
                <div className="p-6 sm:p-8 space-y-4 bg-[#0a0a0a]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#d9a323] px-2.5 py-1 rounded bg-[#d9a323]/10 border border-[#d9a323]/30">
                      {activeModalProject.categoryLabel || activeModalProject.category}
                    </span>
                    <span className="text-xs text-[#8e9196]">
                      Production Year: {activeModalProject.date}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-white">
                    {activeModalProject.title}
                  </h3>

                  <p className="text-xs text-[#8e9196]">
                    Client / Brand: <strong className="text-white">{activeModalProject.client}</strong>
                  </p>

                  <p className="text-sm text-[#c6c8cc] leading-relaxed">
                    {activeModalProject.description}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <Link
                      to={`/quote?service=${activeModalProject.category}`}
                      onClick={() => setActiveModalProject(null)}
                      className="px-6 py-3 bg-[#d9a323] hover:bg-[#e5b338] text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                      Request Similar Project
                    </Link>

                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=Hello%20EMMY-T,%20I%20saw%20the%20${encodeURIComponent(activeModalProject.title)}%20in%20your%20portfolio%20and%20would%20like%20to%20order%20something%20similar.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 rounded-lg bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-md"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-white" />
                      <span>Discuss on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span>Explore All Finished Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. WHY CHOOSE US */}
      {/* ======================================================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-xs font-mono tracking-[0.25em] text-[#d9a323] uppercase">
                // 03 · PRODUCTION INFRASTRUCTURE
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
                Why Corporate Brands & Leaders Trust Us
              </h2>
              <div className="w-16 h-1 bg-[#d9a323] rounded-full" />
              <p className="text-sm text-[#8e9196] leading-relaxed">
                We bridge the gap between creative visual artistry and heavy-duty printing infrastructure. When your branding must communicate prestige, compromise is not an option.
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#d9a323] hover:underline"
                >
                  <span>Learn More About Our Company Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Features Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass-panel rounded-2xl p-6 space-y-3 border-l-2 border-l-[#d9a323]">
                <div className="w-10 h-10 rounded-xl bg-[#d9a323]/10 text-[#d9a323] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-white">Commercial Print Fidelity</h3>
                <p className="text-xs text-[#8e9196] leading-relaxed">
                  We utilize industrial-grade solvent, UV, and DTF machines that render exact Pantone matches and rich, deep blacks.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 space-y-3 border-l-2 border-l-[#c6c8cc]">
                <div className="w-10 h-10 rounded-xl bg-white/5 text-[#c6c8cc] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-white">Guaranteed Turnaround</h3>
                <p className="text-xs text-[#8e9196] leading-relaxed">
                  No missed event deadlines. We understand time-sensitive marketing schedules and offer prioritized rapid delivery.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 space-y-3 border-l-2 border-l-[#c6c8cc]">
                <div className="w-10 h-10 rounded-xl bg-white/5 text-[#c6c8cc] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-white">Luxury Specialty Finishes</h3>
                <p className="text-xs text-[#8e9196] leading-relaxed">
                  Precision foil stamping, spot UV gloss, thermal lamination, and premium heavyweight paperboards.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 space-y-3 border-l-2 border-l-[#d9a323]">
                <div className="w-10 h-10 rounded-xl bg-[#d9a323]/10 text-[#d9a323] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-white">Transparent Formal Quotes</h3>
                <p className="text-xs text-[#8e9196] leading-relaxed">
                  Detailed cost estimates and digital PDF quotations with no hidden surprises, tailored for corporate accounting.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. TESTIMONIALS */}
      {/* ======================================================== */}
      <section className="py-24 bg-[#070707] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="space-y-3 max-w-xl text-center sm:text-left">
              <p className="text-xs font-bold tracking-[0.25em] text-[#d9a323] uppercase">
                Client Feedback & Reviews
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                Endorsed by Business Owners
              </h2>
              <div className="w-16 h-1 bg-[#d9a323] rounded-full mx-auto sm:mx-0" />
              <p className="text-xs sm:text-sm text-[#8e9196] pt-1">
                Hear what corporate clients and project managers say about our print fidelity, speed, and premium finishes.
              </p>
            </div>

            <div className="flex justify-center sm:justify-end">
              <button
                onClick={() => {
                  setReviewSubmitted(false)
                  setReviewModalOpen(true)
                }}
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-[#d9a323] text-white hover:text-black border border-[#d9a323]/40 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
              >
                <Edit3 className="w-4 h-4 text-[#d9a323]" />
                <span>Write A Customer Review</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {approvedTestimonials.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col bg-[#0f0f0f] rounded-xl p-7 group transition-colors duration-300 hover:bg-[#111111]"
              >
                {/* Corner bracket — top-left */}
                <span className="pointer-events-none absolute top-0 left-0 w-5 h-5 border-t border-l border-[#d9a323]/50 rounded-tl-xl" />
                {/* Corner bracket — top-right */}
                <span className="pointer-events-none absolute top-0 right-0 w-5 h-5 border-t border-r border-[#d9a323]/50 rounded-tr-xl" />
                {/* Corner bracket — bottom-left */}
                <span className="pointer-events-none absolute bottom-0 left-0 w-5 h-5 border-b border-l border-[#d9a323]/50 rounded-bl-xl" />
                {/* Corner bracket — bottom-right */}
                <span className="pointer-events-none absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[#d9a323]/50 rounded-br-xl" />

                {/* Large gold quotation mark — hero design element */}
                <span
                  aria-hidden="true"
                  className="block font-serif text-[96px] leading-none text-[#d9a323] select-none mb-1 -mt-3"
                  style={{ fontFamily: 'Georgia, serif', lineHeight: 1 }}
                >
                  &ldquo;
                </span>

                {/* Quote body */}
                <p className="text-sm text-[#c6c8cc] leading-relaxed flex-1">
                  {t.content}
                </p>

                {/* Stars + Attribution */}
                <div className="mt-7 space-y-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#d9a323] text-[#d9a323]" />
                    ))}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-white tracking-wide">{t.name}</p>
                    <p className="text-[11px] text-[#8e9196] mt-0.5">
                      {t.role}{t.company ? <>, <span className="text-[#d9a323]">{t.company}</span></> : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Customer Review Submission Modal */}
        {reviewModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
            onClick={() => setReviewModalOpen(false)}
          >
            <div
              className="glass-panel rounded-3xl max-w-lg w-full border border-[#d9a323]/40 p-6 sm:p-8 space-y-5 shadow-2xl my-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setReviewModalOpen(false)}
                className="absolute top-5 right-5 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {reviewSubmitted ? (
                <div className="text-center py-8 space-y-4 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white">
                    Thank You For Your Review!
                  </h3>
                  <p className="text-xs text-[#8e9196] max-w-sm mx-auto leading-relaxed">
                    Your testimonial has been submitted to the admin desk for moderation. Once reviewed and approved, it will be published live on the website!
                  </p>
                  <button
                    onClick={() => setReviewModalOpen(false)}
                    className="px-6 py-2.5 rounded-lg bg-[#d9a323] text-black font-bold uppercase tracking-wider text-xs"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    submitCustomerReview(reviewForm)
                    setReviewSubmitted(true)
                    setReviewForm({
                      name: '',
                      role: '',
                      company: '',
                      content: '',
                      rating: 5,
                    })
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="border-b border-white/10 pb-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#d9a323]">
                      Customer Feedback
                    </span>
                    <h3 className="font-heading text-xl font-bold text-white mt-0.5">
                      Share Your Experience with EMMY-T
                    </h3>
                    <p className="text-[11px] text-[#8e9196] mt-1">
                      Your honest review will help other business owners and event organizers.
                    </p>
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[#8e9196] font-semibold">Your Rating *</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="p-1 text-neutral-600 hover:text-[#d9a323] transition-colors"
                        >
                          <Star
                            className={`w-7 h-7 transition-all ${
                              star <= reviewForm.rating
                                ? 'fill-[#d9a323] text-[#d9a323] scale-110'
                                : 'text-neutral-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono font-bold text-[#d9a323] ml-2">
                        {reviewForm.rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[#8e9196]">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      placeholder="e.g. Chief Adebayo Adeleke"
                      className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Role */}
                    <div className="space-y-1">
                      <label className="text-[#8e9196]">Role / Designation</label>
                      <input
                        type="text"
                        value={reviewForm.role}
                        onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                        placeholder="e.g. CEO, Marketing Director"
                        className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                      />
                    </div>

                    {/* Company */}
                    <div className="space-y-1">
                      <label className="text-[#8e9196]">Company / Brand Name</label>
                      <input
                        type="text"
                        value={reviewForm.company}
                        onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                        placeholder="e.g. Primrose Estates Ltd"
                        className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                      />
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-1">
                    <label className="text-[#8e9196]">Your Review / Feedback *</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewForm.content}
                      onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                      placeholder="Describe what you ordered, print quality, turnaround speed, and your experience..."
                      className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                    />
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setReviewModalOpen(false)}
                      className="px-4 py-2.5 rounded-lg bg-white/5 text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#d9a323] text-black font-bold uppercase tracking-wider rounded-lg shadow hover:brightness-110"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 7. HIGH CONVERSION CTA */}
      {/* ======================================================== */}
      <section className="py-20 relative overflow-hidden bg-[#0c0c0c] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#d9a323]">
            // INITIATE COMMISSION
          </p>

          <h2 className="text-3xl sm:text-5xl font-sans font-extrabold text-white tracking-tight">
            Ready to Elevate Your Brand's Physical Presence?
          </h2>

          <p className="text-sm sm:text-base text-[#9ca3af] max-w-xl mx-auto leading-relaxed">
            Submit your project specifications online or connect directly with our production desk on WhatsApp for instant quote turnaround.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/quote"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#d9a323] hover:bg-[#e5b338] text-black font-bold uppercase tracking-wider text-xs rounded-lg shadow-lg hover:shadow-[#d9a323]/25 transition-all"
            >
              Request A Quote Now
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-white/15 hover:border-white/40 bg-white/[0.03] text-white hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Contact Our Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


import React, { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Award,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Images
} from 'lucide-react'
import { WhatsAppIcon } from '../../components/shared/SocialIcons'
import { useAppStore } from '../../store/useAppStore'

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const { services, portfolio, companyInfo } = useAppStore()

  const [activeModalProject, setActiveModalProject] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const service = services.find((s) => s.slug === slug || s.id === slug)

  if (services.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-white">
        <div className="w-8 h-8 border-2 border-[#d9a323] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-widest text-[#8e9196]">
          Loading Service Specifications...
        </p>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="font-heading text-3xl font-bold text-white">Service Not Found</h1>
        <p className="text-[#8e9196] text-sm">The requested service could not be located.</p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#d9a323] text-black font-bold uppercase text-xs rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Back To All Services
        </Link>
      </div>
    )
  }

  // Related portfolio projects (matching by category or slug, or fallback to top 3 projects)
  const matchedProjects = portfolio.filter(
    (p) =>
      p.category === service.slug ||
      p.category === service.id ||
      (service.category && p.categoryLabel?.toLowerCase() === service.category.toLowerCase())
  )
  const relatedProjects = matchedProjects.length > 0 ? matchedProjects.slice(0, 3) : portfolio.slice(0, 3)

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
    <div className="py-12">
      {/* Back button & Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8e9196] hover:text-[#d9a323] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back To All Services
        </Link>
      </div>

      {/* Main Service Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#d9a323]">
                {service.category || 'Specialized Service'}
              </span>
              <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
                {service.name}
              </h1>
              <div className="w-16 h-1 bg-[#d9a323] rounded-full" />
            </div>

            {/* Featured Image Banner */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-neutral-900 border border-white/10">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-60" />
            </div>

            {/* Long Description */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-4">
              <h2 className="font-heading text-xl font-bold text-white">
                Service Overview & Standards
              </h2>
              <p className="text-sm text-[#c6c8cc] leading-relaxed">
                {service.description || service.shortDesc}
              </p>
              <p className="text-sm text-[#8e9196] leading-relaxed">
                At EMMY-T CONCEPT, our production process utilizes premium substrates, industrial calibrated UV and solvent inks, and meticulous finishing inspections. Whether preparing a small custom run or commercial quantity production, we maintain consistent high-definition clarity.
              </p>
            </div>

            {/* Sub-Offerings Checklist */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
              <h3 className="font-heading text-lg font-bold text-white">
                Specific Products & Solutions Under This Category:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.subItems?.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-[#d9a323] shrink-0 mt-0.5" />
                    <span className="text-sm text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clickable Related Portfolio Completed Works */}
            {relatedProjects.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white">
                      Sample Completed Works in {service.name}
                    </h3>
                    <p className="text-xs text-[#8e9196]">
                      Click any project below to view full details, high-res photos, and multi-angle shots
                    </p>
                  </div>
                  <Link
                    to="/portfolio"
                    className="text-xs text-[#d9a323] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleOpenModal(p)}
                      className="rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-[#d9a323]/50 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden relative bg-neutral-900">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1.5 rounded-full bg-black/80 border border-[#d9a323] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                            <Eye className="w-3.5 h-3.5 text-[#d9a323]" /> View Project
                          </span>
                        </div>
                        {p.images?.length > 1 && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white border border-white/20 flex items-center gap-1">
                            <Images className="w-3 h-3 text-[#d9a323]" /> {p.images.length}
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-1">
                        <p className="text-xs font-bold text-white group-hover:text-[#d9a323] transition-colors truncate">
                          {p.title}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-[#8e9196]">
                          <span>{p.client}</span>
                          <span className="text-[#d9a323] font-medium flex items-center gap-0.5">
                            Details <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Quote Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 glass-panel p-8 rounded-3xl border border-[#d9a323]/30 space-y-6 shadow-2xl">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#d9a323]">
                  Direct Pricing
                </span>
                <h3 className="font-heading text-2xl font-bold text-white mt-1">
                  Ready To Order?
                </h3>
                <p className="text-xs text-[#8e9196] mt-2 leading-relaxed">
                  Request a formalized quote with your custom dimensions, quantities, and delivery timeframe.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-[#c6c8cc]">
                  <ShieldCheck className="w-4 h-4 text-[#d9a323] shrink-0" />
                  <span>Formalized PDF Quotation with Breakdown</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#c6c8cc]">
                  <Zap className="w-4 h-4 text-[#d9a323] shrink-0" />
                  <span>Fast Quote Response within 1-2 Hours</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#c6c8cc]">
                  <Award className="w-4 h-4 text-[#d9a323] shrink-0" />
                  <span>Full Substrate & Finishing Options</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Link
                  to={`/quote?service=${service.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#d9a323] hover:bg-[#e5b338] text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <span>Request Quote For {service.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=Hello%20EMMY-T,%20I%20am%20interested%20in%20${encodeURIComponent(service.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Clickable Lightbox Modal with Multi-Image Side Navigation */}
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
                  href={`https://wa.me/${cleanWhatsApp}?text=Hello%20EMMY-T,%20I%20saw%20${encodeURIComponent(activeModalProject.title)}%20under%20${encodeURIComponent(service.name)}%20and%20would%20like%20to%20order%20something%20similar.`}
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
    </div>
  )
}

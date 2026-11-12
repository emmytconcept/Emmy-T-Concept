import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Images
} from 'lucide-react'
import { WhatsAppIcon } from '../../components/shared/SocialIcons'
import { useAppStore } from '../../store/useAppStore'
import { PORTFOLIO_CATEGORIES } from '../../lib/constants'

export default function PortfolioPage() {
  const { portfolio, companyInfo } = useAppStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeModalProject, setActiveModalProject] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const filteredProjects = selectedCategory === 'all'
    ? portfolio
    : portfolio.filter((p) => p.category === selectedCategory)

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

  // Keyboard navigation for arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeModalProject) return
      if (e.key === 'ArrowLeft') handlePrevImage()
      if (e.key === 'ArrowRight') handleNextImage()
      if (e.key === 'Escape') setActiveModalProject(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModalProject, currentImages.length])

  const cleanWhatsApp = (companyInfo.whatsapp || '').replace(/[^0-9]/g, '')

  return (
    <div className="py-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
        <p className="text-xs font-mono tracking-[0.25em] text-[#d9a323] uppercase mb-3">
          // CURATED ARCHIVE
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Executive Portfolio & Completed Projects
        </h1>
        <div className="w-20 h-1 bg-[#d9a323] mx-auto rounded-full my-6" />
        <p className="max-w-3xl mx-auto text-[#9ca3af] text-base sm:text-lg leading-relaxed">
          Examine our completed designs, large-format outdoor displays, retail packaging, and customized corporate apparel. Click on any project to view multi-photo galleries.
        </p>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-8">
          {PORTFOLIO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#d9a323] text-black font-bold shadow-md shadow-[#d9a323]/25'
                  : 'bg-white/5 text-[#8e9196] hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {portfolio.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-8 h-8 border-2 border-[#d9a323] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono uppercase tracking-widest text-[#8e9196]">
              Connecting to Database Portfolio...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
            const projectPhotosCount = project.images?.length || 1

            return (
              <div
                key={project.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
                onClick={() => handleOpenModal(project)}
              >
                {/* Thumbnail Container */}
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-neutral-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />

                  {/* Hover Quick View Pill */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-4 py-2 rounded-full bg-[#080808]/90 border border-[#d9a323] text-xs font-bold text-[#d9a323] flex items-center gap-1.5 shadow-2xl backdrop-blur-md">
                      <Eye className="w-3.5 h-3.5" /> View Gallery ({projectPhotosCount} Photos)
                    </span>
                  </div>

                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded bg-[#080808]/90 text-[#d9a323] border border-white/10 uppercase tracking-wider backdrop-blur-md">
                    {project.categoryLabel || project.category}
                  </span>

                  {projectPhotosCount > 1 && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded bg-black/80 text-white border border-white/20 flex items-center gap-1 backdrop-blur-md">
                      <Images className="w-3 h-3 text-[#d9a323]" /> {projectPhotosCount}
                    </span>
                  )}
                </div>

                {/* Information */}
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

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-[#d9a323] font-semibold flex items-center gap-1">
                      <span>Click to view photos</span>
                      {projectPhotosCount > 1 && <span>({projectPhotosCount})</span>}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#d9a323]" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        )}
      </section>

      {/* Modal Multi-Image Lightbox */}
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
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo Counter Badge */}
            {currentImages.length > 1 && (
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/80 border border-[#d9a323]/50 text-xs font-mono font-bold text-[#d9a323] backdrop-blur-md">
                Photo {activeImageIndex + 1} of {currentImages.length}
              </div>
            )}

            {/* Main Active Image with Left / Right Arrows */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-black flex items-center justify-center select-none overflow-hidden group">
              <img
                key={activeImageIndex}
                src={currentImages[activeImageIndex]}
                alt={`${activeModalProject.title} - View ${activeImageIndex + 1}`}
                className="w-full h-full object-contain max-h-[65vh] transition-all duration-300"
              />

              {/* Left Arrow Button */}
              {currentImages.length > 1 && (
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-[#d9a323] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
                  title="Previous Photo (Left Arrow)"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Right Arrow Button */}
              {currentImages.length > 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-[#d9a323] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
                  title="Next Photo (Right Arrow)"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Thumbnail Navigation Strip (when multiple pictures exist) */}
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
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
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
                  className="px-6 py-3 bg-gradient-to-r from-[#d9a323] to-[#b88613] text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:scale-105 transition-all"
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
    </div>
  )
}

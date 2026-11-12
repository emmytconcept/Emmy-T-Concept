import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Star, Eye, UploadCloud, X, CheckCircle2, Images } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { PORTFOLIO_CATEGORIES } from '../../lib/constants'
import ImageDropzone from '../../components/shared/ImageDropzone'

export default function AdminPortfolioPage() {
  const { portfolio, addPortfolioProject, updatePortfolioProject, deletePortfolioProject } = useAppStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    category: 'business-branding',
    categoryLabel: 'Business Branding',
    image: '',
    images: [],
    description: '',
    client: '',
    date: new Date().getFullYear().toString(),
    featured: true,
  })

  const handleOpenAdd = () => {
    setEditingProject(null)
    setFormData({
      title: '',
      category: 'banner-printing',
      categoryLabel: 'Banners & Signs',
      image: '',
      images: [],
      description: '',
      client: '',
      date: new Date().getFullYear().toString(),
      featured: true,
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (proj) => {
    setEditingProject(proj)
    const existingList = proj.images && proj.images.length > 0 ? proj.images : (proj.image ? [proj.image] : [])
    setFormData({
      title: proj.title,
      category: proj.category,
      categoryLabel: proj.categoryLabel || proj.category,
      image: proj.image || (existingList[0] || ''),
      images: existingList,
      description: proj.description,
      client: proj.client,
      date: proj.date,
      featured: proj.featured || false,
    })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const foundCat = PORTFOLIO_CATEGORIES.find((c) => c.id === formData.category)

    const galleryList = Array.isArray(formData.images) && formData.images.length > 0
      ? formData.images
      : (formData.image ? [formData.image] : [])

    const coverPhoto = formData.image || galleryList[0] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80'

    const payload = {
      title: formData.title,
      category: formData.category,
      categoryLabel: foundCat ? foundCat.label : formData.category,
      image: coverPhoto,
      images: galleryList.length > 0 ? galleryList : [coverPhoto],
      description: formData.description,
      client: formData.client || 'Corporate Client',
      date: formData.date || new Date().getFullYear().toString(),
      featured: formData.featured,
    }

    if (editingProject) {
      updatePortfolioProject(editingProject.id, payload)
    } else {
      addPortfolioProject(payload)
    }

    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">Portfolio & Showcase Management</h2>
          <p className="text-xs text-[#8e9196] mt-0.5">
            Add completed projects to prove craftsmanship and inspire new client orders
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#d9a323] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Upload New Project
        </button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((proj) => (
          <div
            key={proj.id}
            className="glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] relative bg-neutral-900">
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded bg-black/80 text-[#d9a323] border border-white/10 uppercase">
                  {proj.categoryLabel || proj.category}
                </span>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {proj.images?.length > 1 && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-black/85 text-white border border-white/20 flex items-center gap-1 shadow">
                      <Images className="w-3 h-3 text-[#d9a323]" /> {proj.images.length} Photos
                    </span>
                  )}
                  {proj.featured && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#d9a323] text-black flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-black" /> Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#8e9196]">
                  <span>Client: {proj.client || 'Client'}</span>
                  <span>{proj.date}</span>
                </div>
                <h3 className="font-heading font-bold text-base text-white">{proj.title}</h3>
                <p className="text-xs text-[#8e9196] line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-[#25D366] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Published
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(proj)}
                  className="p-1.5 rounded bg-white/10 hover:bg-[#d9a323] hover:text-black text-white transition-colors"
                  title="Edit Project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${proj.title}" from portfolio?`)) {
                      deletePortfolioProject(proj.id)
                    }
                  }}
                  className="p-1.5 rounded bg-white/10 hover:bg-red-500 text-white transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal with Drag & Drop */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="glass-panel rounded-3xl max-w-2xl w-full border border-[#d9a323]/40 p-6 sm:p-8 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading text-xl font-bold text-white">
                {editingProject ? 'Edit Portfolio Project' : 'Upload New Portfolio Project'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              <div className="space-y-1">
                <label className="text-[#8e9196]">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Apex Corporate Identity & Roll-up Banners"
                  className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#8e9196]">Category Group *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                  >
                    {PORTFOLIO_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#8e9196]">Client Name / Brand</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Royale Hotel Ltd"
                    className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                  />
                </div>
              </div>

              {/* Cover Photo Drag & Drop */}
              <ImageDropzone
                multiple={false}
                value={formData.image}
                onChange={(val) => {
                  setFormData((prev) => ({
                    ...prev,
                    image: val,
                    // If no gallery images yet, also seed gallery
                    images: prev.images.length === 0 && val ? [val] : prev.images,
                  }))
                }}
                label="Primary Cover Photo (Tap to select or Drag & Drop)"
                helperText="Primary image shown on portfolio cards"
              />

              {/* Multiple Gallery Photos Drag & Drop */}
              <ImageDropzone
                multiple={true}
                value={formData.images}
                onChange={(list) => {
                  setFormData((prev) => ({
                    ...prev,
                    images: list,
                    image: prev.image || list[0] || '',
                  }))
                }}
                label="Multi-Angle Gallery Photos (Tap to select or Drag & Drop multiple)"
                helperText="Allows visitors to browse with side navigation arrows"
              />

              <div className="space-y-1">
                <label className="text-[#8e9196]">Project Summary / Specifications</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the substrate, dimensions, finishes, and outcome..."
                  className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-proj"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-[#d9a323] rounded focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featured-proj" className="text-[#c6c8cc] cursor-pointer">
                  Feature on Homepage Portfolio Section
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#d9a323] text-black font-bold uppercase tracking-wider rounded-lg shadow hover:brightness-110"
                >
                  {editingProject ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

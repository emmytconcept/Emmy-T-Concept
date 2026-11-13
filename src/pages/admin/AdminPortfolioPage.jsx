import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Star, Eye, UploadCloud, X, CheckCircle2, Images, Tag } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import ImageDropzone from '../../components/shared/ImageDropzone'

export default function AdminPortfolioPage() {
  const {
    portfolio,
    addPortfolioProject,
    updatePortfolioProject,
    deletePortfolioProject,
    portfolioCategories,
    addPortfolioCategory,
    updatePortfolioCategory,
    deletePortfolioCategory,
  } = useAppStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  // Category Manager modal state
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [newCatLabel, setNewCatLabel] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingCategoryLabel, setEditingCategoryLabel] = useState('')

  const activeCategories = portfolioCategories && portfolioCategories.length > 0
    ? portfolioCategories
    : [
        { id: 'all', label: 'All Projects' },
        { id: 'graphic-design', label: 'Graphic Design' },
        { id: 'banner-printing', label: 'Banners & Stickers' },
        { id: 'business-branding', label: 'Business Branding' },
        { id: 'packaging-design', label: 'Packaging' },
        { id: 'clothing-printing', label: 'Apparel & Fabric' },
      ]

  const selectableCategories = activeCategories.filter((c) => c.id !== 'all')

  const [formData, setFormData] = useState({
    title: '',
    category: selectableCategories[0]?.id || 'banner-printing',
    categoryLabel: selectableCategories[0]?.label || 'Banners & Stickers',
    image: '',
    images: [],
    description: '',
    client: '',
    date: new Date().getFullYear().toString(),
    featured: true,
  })

  const handleOpenAdd = () => {
    setEditingProject(null)
    const defaultCat = selectableCategories[0] || { id: 'banner-printing', label: 'Banners & Stickers' }
    setFormData({
      title: '',
      category: defaultCat.id,
      categoryLabel: defaultCat.label,
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
    const foundCat = activeCategories.find((c) => c.id === formData.category)

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

  const handleAddCategory = (e) => {
    e.preventDefault()
    const trimmed = newCatLabel.trim()
    if (!trimmed) return
    const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (activeCategories.some((c) => c.id === id)) {
      alert('A category with this ID already exists.')
      return
    }
    addPortfolioCategory({ id, label: trimmed })
    setNewCatLabel('')
  }

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id)
    setEditingCategoryLabel(category.label)
  }

  const handleSaveCategory = (categoryId) => {
    const label = editingCategoryLabel.trim()
    if (!label) return
    updatePortfolioCategory(categoryId, { label })
    setEditingCategoryId(null)
    setEditingCategoryLabel('')
  }

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null)
    setEditingCategoryLabel('')
  }

  const handleDeleteCategory = (catId) => {
    if (catId === 'all') return
    if (confirm(`Are you sure you want to delete this category?`)) {
      deletePortfolioCategory(catId)
    }
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

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCatModalOpen(true)}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Tag className="w-3.5 h-3.5 text-[#d9a323]" /> Manage Categories ({selectableCategories.length})
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-[#d9a323] hover:bg-[#e5b338] text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Upload New Project
          </button>
        </div>
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

            <div className="p-4 border-t border-white/5 flex items-center justify-end gap-2 bg-white/[0.02]">
              <button
                onClick={() => handleOpenEdit(proj)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                title="Edit Project"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${proj.title}"?`)) deletePortfolioProject(proj.id)
                }}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================
          MODAL: Manage Categories
      ========================================================= */}
      {catModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setCatModalOpen(false)}
        >
          <div
            className="glass-panel rounded-3xl max-w-md w-full border border-[#d9a323]/40 p-6 sm:p-7 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#d9a323]" />
                <h3 className="font-heading text-lg font-bold text-white">
                  Portfolio Categories
                </h3>
              </div>
              <button onClick={() => setCatModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Categories List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {activeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                >
                  {editingCategoryId === cat.id ? (
                    <>
                      <input
                        type="text"
                        autoFocus
                        required
                        value={editingCategoryLabel}
                        onChange={(e) => setEditingCategoryLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveCategory(cat.id)
                          if (e.key === 'Escape') handleCancelEditCategory()
                        }}
                        className="flex-1 min-w-0 bg-[#111111] border border-white/10 rounded-lg px-2 py-1.5 text-white outline-none focus:border-[#d9a323]"
                        aria-label={`Category name for ${cat.id}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveCategory(cat.id)}
                        className="p-1 rounded text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        title="Save Category Name"
                        aria-label="Save category name"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditCategory}
                        className="p-1 rounded text-white/60 hover:bg-white/10 transition-colors"
                        title="Cancel"
                        aria-label="Cancel category edit"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="min-w-0">
                        <span className="font-bold text-white">{cat.label}</span>
                        <span className="text-[10px] text-[#8e9196] font-mono ml-2">({cat.id})</span>
                      </div>
                      {cat.id !== 'all' && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditCategory(cat)}
                            className="p-1 rounded text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                            title="Edit Category Name"
                            aria-label={`Edit ${cat.label}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Remove Category"
                            aria-label={`Remove ${cat.label}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Category Form */}
            <form onSubmit={handleAddCategory} className="pt-3 border-t border-white/10 space-y-2 text-xs">
              <label className="text-[#8e9196] block font-medium">Add New Category</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  placeholder="e.g. Vehicle Branding"
                  className="flex-1 bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#d9a323]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#d9a323] hover:bg-[#e5b338] text-black font-bold uppercase tracking-wider text-[11px] rounded-lg shadow"
                >
                  Add
                </button>
              </div>
              <p className="text-[10px] text-[#8e9196]">
                Categories sync instantly with Supabase and update across the public portfolio filters.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: Add / Edit Project
      ========================================================= */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="glass-panel rounded-3xl max-w-2xl w-full border border-[#d9a323]/40 p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading text-xl font-bold text-white">
                {editingProject ? 'Edit Portfolio Project' : 'Upload New Portfolio Showcase'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#8e9196]">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Apex Prestige Brand Identity Suite"
                  className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#8e9196]">Category Group *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                  >
                    {selectableCategories.map((cat) => (
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
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Project Cover Photo *"
              />

              {/* Multi-Photo Gallery Drag & Drop */}
              <ImageDropzone
                multiple={true}
                value={formData.images}
                onChange={(urls) => setFormData({ ...formData, images: urls })}
                label="Full Gallery Photos (Upload multiple angles & finishes)"
              />

              <div className="space-y-1">
                <label className="text-[#8e9196]">Description & Craftsmanship Notes</label>
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
                  className="px-6 py-2.5 bg-[#d9a323] hover:bg-[#e5b338] text-black font-bold uppercase tracking-wider rounded-lg shadow-md active:scale-95 transition-all"
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

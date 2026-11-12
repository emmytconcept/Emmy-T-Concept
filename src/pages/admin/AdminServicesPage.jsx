import React, { useState } from 'react'
import { Plus, Edit2, Trash2, CheckCircle2, Star, Image, X } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import ImageDropzone from '../../components/shared/ImageDropzone'

export default function AdminServicesPage() {
  const { services, addService, updateService, deleteService } = useAppStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    shortDesc: '',
    description: '',
    image: '',
    icon: 'Layers',
    subItemsText: '',
    featured: false,
  })

  const handleOpenAdd = () => {
    setEditingService(null)
    setFormData({
      name: '',
      slug: '',
      category: 'Printing',
      shortDesc: '',
      description: '',
      image: '',
      icon: 'Printer',
      subItemsText: '',
      featured: true,
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      slug: service.slug,
      category: service.category || '',
      shortDesc: service.shortDesc || '',
      description: service.description || '',
      image: service.image || '',
      icon: service.icon || 'Layers',
      subItemsText: service.subItems?.join('\n') || '',
      featured: service.featured || false,
    })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const subItems = formData.subItemsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    const slug =
      formData.slug ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')

    const payload = {
      name: formData.name,
      slug,
      category: formData.category,
      shortDesc: formData.shortDesc,
      description: formData.description,
      image: formData.image || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
      icon: formData.icon,
      subItems,
      featured: formData.featured,
    }

    if (editingService) {
      updateService(editingService.id, payload)
    } else {
      addService(payload)
    }

    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">Services Catalog Manager</h2>
          <p className="text-xs text-[#8e9196] mt-0.5">
            Manage your service offerings, descriptions, offerings lists, and preview imagery
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#d9a323] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="aspect-video relative bg-neutral-900">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded bg-black/80 text-[#d9a323] border border-white/10 uppercase">
                  {service.category || 'Printing'}
                </span>
                {service.featured && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded bg-[#d9a323] text-black flex items-center gap-1 shadow">
                    <Star className="w-3 h-3 fill-black" /> Featured
                  </span>
                )}
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-heading font-bold text-base text-white">{service.name}</h3>
                <p className="text-xs text-[#8e9196] line-clamp-2 leading-relaxed">
                  {service.shortDesc}
                </p>

                {service.subItems && service.subItems.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1">
                    {service.subItems.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#c6c8cc] border border-white/10"
                      >
                        {item}
                      </span>
                    ))}
                    {service.subItems.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#8e9196]">
                        +{service.subItems.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-[#25D366] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Catalog
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="p-1.5 rounded bg-white/10 hover:bg-[#d9a323] hover:text-black text-white transition-colors"
                  title="Edit Service"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete service "${service.name}"?`)) {
                      deleteService(service.id)
                    }
                  }}
                  className="p-1.5 rounded bg-white/10 hover:bg-red-500 text-white transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="glass-panel rounded-3xl max-w-xl w-full border border-[#d9a323]/40 p-6 sm:p-8 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading text-xl font-bold text-white">
                {editingService ? 'Edit Service' : 'Add New Corporate Service'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#8e9196]">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Graphic Design"
                    className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#8e9196]">Category Group</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Printing, Design, Corporate"
                    className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                  />
                </div>
              </div>

              {/* Tap-to-select and Drag & Drop Image */}
              <ImageDropzone
                multiple={false}
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
                label="Service Header Image (Tap to select or Drag & Drop)"
                helperText="Displayed on service cards and service detail banner"
              />

              <div className="space-y-1">
                <label className="text-[#8e9196]">Short Card Summary</label>
                <input
                  type="text"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="Brief summary for homepage cards..."
                  className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#8e9196]">Full Detailed Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full in-depth service overview..."
                  className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#8e9196]">Sub-Items / Offerings (One per line)</label>
                <textarea
                  rows={4}
                  value={formData.subItemsText}
                  onChange={(e) => setFormData({ ...formData, subItemsText: e.target.value })}
                  placeholder="Flyer Design&#10;Logo Design&#10;Business Card Design"
                  className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-[#d9a323] rounded focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featured-toggle" className="text-[#c6c8cc] cursor-pointer">
                  Feature on Homepage Services Grid
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
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

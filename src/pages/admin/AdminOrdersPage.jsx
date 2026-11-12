import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Filter,
  FileText,
  DollarSign,
  Eye,
  X,
  Calendar,
  ImageIcon,
  File,
  Download,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  StickyNote,
  CheckCircle2,
  Clock,
  Printer,
} from 'lucide-react'
import { WhatsAppIcon } from '../../components/shared/SocialIcons'
import { useAppStore } from '../../store/useAppStore'
import { ORDER_STATUSES } from '../../lib/constants'

// ----- Utility -----
const formatDate = (str) => {
  if (!str) return null
  try {
    return new Date(str).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return str
  }
}

const isOverdue = (dateStr) => {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export default function AdminOrdersPage() {
  const navigate = useNavigate()
  const { enquiries, updateEnquiryStatus, updateEnquiryPricing } = useAppStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [editPriceModal, setEditPriceModal] = useState(null)
  const [lightboxFile, setLightboxFile] = useState(null) // { url, name, isPdf }
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Pricing form state
  const [quotedPrice, setQuotedPrice] = useState('')
  const [agreedPrice, setAgreedPrice] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.phone || '').includes(searchTerm) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleOpenPriceModal = (enq) => {
    setEditPriceModal(enq)
    setQuotedPrice(enq.quotedPrice || '')
    setAgreedPrice(enq.agreedPrice || '')
    setAdminNotes(enq.notes || '')
  }

  const handleSavePricing = () => {
    if (editPriceModal) {
      updateEnquiryPricing(
        editPriceModal.id,
        quotedPrice ? parseFloat(quotedPrice) : null,
        agreedPrice ? parseFloat(agreedPrice) : null
      )
      if (adminNotes !== editPriceModal.notes) {
        updateEnquiryStatus(editPriceModal.id, editPriceModal.status, adminNotes)
      }
      setEditPriceModal(null)
    }
  }

  // Lightbox helpers – only for image files
  const imageFiles = selectedEnquiry?.uploadedFiles?.filter((f) => f.isImage) || []
  const openLightbox = (file) => {
    if (!file.isImage) return // PDFs handled inline
    const idx = imageFiles.findIndex((f) => f.id === file.id || f.name === file.name)
    setLightboxIndex(idx >= 0 ? idx : 0)
    setLightboxFile(file)
  }
  const prevLightbox = () => {
    const next = (lightboxIndex - 1 + imageFiles.length) % imageFiles.length
    setLightboxIndex(next)
    setLightboxFile(imageFiles[next])
  }
  const nextLightbox = () => {
    const next = (lightboxIndex + 1) % imageFiles.length
    setLightboxIndex(next)
    setLightboxFile(imageFiles[next])
  }

  // Stat counts
  const stats = {
    total: enquiries.length,
    pending: enquiries.filter((e) => e.status === 'new_enquiry').length,
    production: enquiries.filter((e) => e.status === 'in_production').length,
    unquoted: enquiries.filter((e) => !e.quotedPrice).length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header + Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">Order & Enquiry Desk</h2>
          <p className="text-xs text-[#8e9196] mt-0.5">
            Manage incoming requests, update status, set pricing and generate formal quotations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#c6c8cc]">
            Total <strong className="text-white ml-1">{stats.total}</strong>
          </span>
          {stats.pending > 0 && (
            <span className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="w-3 h-3 inline mr-1" />
              {stats.pending} new
            </span>
          )}
          {stats.production > 0 && (
            <span className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Printer className="w-3 h-3 inline mr-1" />
              {stats.production} in press
            </span>
          )}
          {stats.unquoted > 0 && (
            <span className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              {stats.unquoted} unquoted
            </span>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-[#8e9196] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, ref ID or service…"
            className="w-full bg-[#111111] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-600 outline-none focus:border-[#d9a323] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#8e9196]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#111111] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#d9a323] flex-1 sm:flex-none"
          >
            <option value="all">All Statuses</option>
            {Object.entries(ORDER_STATUSES).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#8e9196] uppercase tracking-wider text-[10px] bg-white/5">
                <th className="py-3 px-4 font-semibold">Ref / Date</th>
                <th className="py-3 px-4 font-semibold">Client</th>
                <th className="py-3 px-4 font-semibold">Service</th>
                <th className="py-3 px-4 font-semibold">Delivery</th>
                <th className="py-3 px-4 font-semibold">Quote / Agreed</th>
                <th className="py-3 px-4 font-semibold">Stage</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#8e9196]">
                    No enquiries match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => {
                  const statusMeta = ORDER_STATUSES[enq.status] || {
                    label: enq.status,
                    bg: 'bg-neutral-800',
                    text: 'text-neutral-300',
                    border: 'border-white/10',
                  }
                  const hasFiles = enq.uploadedFiles?.length > 0
                  const overdue = isOverdue(enq.deliveryDate) && !['completed', 'cancelled'].includes(enq.status)

                  return (
                    <tr key={enq.id} className="hover:bg-white/[0.03] transition-colors group">
                      {/* Ref + Date */}
                      <td className="py-3 px-4">
                        <p className="font-mono font-bold text-[#d9a323] uppercase text-xs">{enq.id}</p>
                        <p className="text-[10px] text-[#8e9196] mt-0.5">{formatDate(enq.createdAt)}</p>
                        {hasFiles && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[9px] text-[#c6c8cc] bg-white/5 px-1.5 py-0.5 rounded">
                            <Paperclip className="w-2.5 h-2.5" />
                            {enq.uploadedFiles.length} file{enq.uploadedFiles.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </td>

                      {/* Client */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{enq.customerName}</p>
                        <p className="text-[10px] text-[#8e9196] font-mono">{enq.phone}</p>
                      </td>

                      {/* Service + spec summary */}
                      <td className="py-3 px-4 max-w-[160px]">
                        <p className="font-medium text-white leading-tight line-clamp-1">{enq.serviceName}</p>
                        {(enq.quantity || enq.dimensions) && (
                          <p className="text-[10px] text-[#8e9196] mt-0.5 line-clamp-1">
                            {[enq.quantity, enq.dimensions].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </td>

                      {/* Delivery date */}
                      <td className="py-3 px-4">
                        {enq.deliveryDate ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className={`w-3 h-3 shrink-0 ${overdue ? 'text-red-400' : 'text-[#d9a323]'}`} />
                            <span className={`font-mono text-xs ${overdue ? 'text-red-400 font-bold' : 'text-white'}`}>
                              {enq.deliveryDate}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#8e9196] text-[10px] italic">Flexible</span>
                        )}
                        {overdue && (
                          <p className="text-[9px] text-red-400 font-bold uppercase mt-0.5">Overdue</p>
                        )}
                      </td>

                      {/* Financials */}
                      <td className="py-3 px-4">
                        {enq.quotedPrice ? (
                          <div className="space-y-0.5">
                            <p className="font-mono font-bold text-white">
                              ₦{Number(enq.quotedPrice).toLocaleString()}
                            </p>
                            {enq.agreedPrice && (
                              <p className="font-mono text-[10px] text-emerald-400">
                                ✓ ₦{Number(enq.agreedPrice).toLocaleString()}
                              </p>
                            )}
                            {enq.quoteId && (
                              <p className="text-[9px] text-[#d9a323] font-mono">{enq.quoteId}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-400 italic">Unquoted</span>
                        )}
                      </td>

                      {/* Stage dropdown */}
                      <td className="py-3 px-4">
                        <select
                          value={enq.status}
                          onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                          className={`text-[10px] font-bold py-1 px-2 rounded-lg border outline-none cursor-pointer leading-none ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                        >
                          {Object.entries(ORDER_STATUSES).map(([val, item]) => (
                            <option key={val} value={val} className="bg-[#111111] text-white">
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Generate / view formal quote */}
                          <button
                            onClick={() => navigate('/admin/quotations', { state: { fromEnquiry: enq } })}
                            className="p-1.5 rounded bg-[#d9a323]/10 hover:bg-[#d9a323] text-[#d9a323] hover:text-black border border-[#d9a323]/20 transition-all"
                            title={enq.quoteId ? `Quotation ${enq.quoteId}` : 'Create Formal Quotation'}
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Set price / notes */}
                          <button
                            onClick={() => handleOpenPriceModal(enq)}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-white transition-all"
                            title="Set Price & Notes"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>

                          {/* Full details */}
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-white transition-all"
                            title="View Full Specifications"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/${(enq.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.customerName)},%20this%20is%20EMMY-T%20CONCEPT%20regarding%20your%20order%20(${enq.id.toUpperCase()}).`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"
                            title="WhatsApp Client"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366] group-hover:fill-white" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          MODAL: Full Order Specification + File Viewer
      ========================================================= */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="glass-panel rounded-2xl max-w-2xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-[#0d0d0d] border-b border-white/10 px-6 py-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#d9a323]/15 text-[#d9a323] border border-[#d9a323]/30 font-bold uppercase">
                    {selectedEnquiry.id}
                  </span>
                  {(() => {
                    const sm = ORDER_STATUSES[selectedEnquiry.status]
                    return sm ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${sm.bg} ${sm.text} ${sm.border}`}>
                        {sm.label}
                      </span>
                    ) : null
                  })()}
                </div>
                <h3 className="font-heading text-lg font-bold text-white mt-1.5 leading-tight">
                  {selectedEnquiry.serviceName}
                </h3>
                <p className="text-xs text-[#8e9196] mt-0.5">
                  Logged {formatDate(selectedEnquiry.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Details */}
              <section className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#d9a323]">// CLIENT DETAILS</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Full Name', val: selectedEnquiry.customerName },
                    { label: 'Phone', val: selectedEnquiry.phone, mono: true },
                    { label: 'Email', val: selectedEnquiry.email || 'Not provided' },
                  ].map(({ label, val, mono }) => (
                    <div key={label} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                      <p className="text-[9px] uppercase font-mono text-[#8e9196]">{label}</p>
                      <p className={`text-xs font-semibold text-white leading-tight ${mono ? 'font-mono' : ''}`}>{val}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Job Specifications */}
              <section className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#d9a323]">// JOB SPECIFICATION</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Quantity / Volume', val: selectedEnquiry.quantity || 'Standard run' },
                    { label: 'Dimensions / Format', val: selectedEnquiry.dimensions || 'As per brief' },
                    {
                      label: 'Target Delivery',
                      val: selectedEnquiry.deliveryDate || 'Flexible',
                      accent: isOverdue(selectedEnquiry.deliveryDate) && !['completed', 'cancelled'].includes(selectedEnquiry.status),
                    },
                    {
                      label: 'Quoted Price',
                      val: selectedEnquiry.quotedPrice ? `₦${Number(selectedEnquiry.quotedPrice).toLocaleString()}` : 'Not yet quoted',
                      mono: true,
                    },
                    {
                      label: 'Agreed Price',
                      val: selectedEnquiry.agreedPrice ? `₦${Number(selectedEnquiry.agreedPrice).toLocaleString()}` : '—',
                      mono: true,
                      green: !!selectedEnquiry.agreedPrice,
                    },
                    {
                      label: 'Formal Quote Ref',
                      val: selectedEnquiry.quoteId || 'None issued',
                      mono: true,
                    },
                  ].map(({ label, val, mono, accent, green }) => (
                    <div key={label} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                      <p className="text-[9px] uppercase font-mono text-[#8e9196]">{label}</p>
                      <p
                        className={`text-xs font-semibold leading-tight ${
                          accent ? 'text-red-400 font-bold' : green ? 'text-emerald-400' : 'text-white'
                        } ${mono ? 'font-mono' : ''}`}
                      >
                        {val}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Client Project Brief */}
              <section className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#d9a323]">// CLIENT PROJECT BRIEF</p>
                <div className="p-4 rounded-xl bg-[#111111] border border-white/10 text-xs text-[#c6c8cc] leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.description || 'No description provided.'}
                </div>
              </section>

              {/* Internal Admin Notes */}
              {selectedEnquiry.notes && (
                <section className="space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#d9a323] flex items-center gap-1.5">
                    <StickyNote className="w-3 h-3" /> // INTERNAL PRODUCTION NOTES
                  </p>
                  <div className="p-4 rounded-xl bg-[#d9a323]/8 border border-[#d9a323]/20 text-xs text-[#f5d061] leading-relaxed whitespace-pre-wrap">
                    {selectedEnquiry.notes}
                  </div>
                </section>
              )}

              {/* ---- Uploaded Files / Artwork Section ---- */}
              {selectedEnquiry.uploadedFiles?.length > 0 && (
                <section className="space-y-3">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#d9a323] flex items-center gap-1.5">
                    <Paperclip className="w-3 h-3" /> // ATTACHED FILES & ARTWORK ({selectedEnquiry.uploadedFiles.length})
                  </p>

                  {/* Image Grid */}
                  {selectedEnquiry.uploadedFiles.some((f) => f.isImage) && (
                    <div>
                      <p className="text-[10px] text-[#8e9196] mb-2">Reference Images — Click to enlarge</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {selectedEnquiry.uploadedFiles
                          .filter((f) => f.isImage)
                          .map((f, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => openLightbox(f)}
                              className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#d9a323] transition-all"
                            >
                              <img
                                src={f.previewUrl || f.url}
                                alt={f.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ZoomIn className="w-5 h-5 text-white" />
                              </div>
                              <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-[9px] text-white truncate">{f.name}</p>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* PDF / Doc List */}
                  {selectedEnquiry.uploadedFiles.some((f) => !f.isImage) && (
                    <div>
                      <p className="text-[10px] text-[#8e9196] mb-2">Document Files</p>
                      <div className="space-y-2">
                        {selectedEnquiry.uploadedFiles
                          .filter((f) => !f.isImage)
                          .map((f, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 rounded-xl bg-[#111111] border border-white/10 hover:border-white/20 transition-colors"
                            >
                              <div className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center shrink-0 font-bold text-[9px] ${f.isPdf ? 'bg-red-500/15 border border-red-500/30 text-red-400' : 'bg-white/5 border border-white/10 text-[#8e9196]'}`}>
                                {f.isPdf ? (
                                  <>
                                    <File className="w-4 h-4" />
                                    <span className="leading-none mt-0.5">PDF</span>
                                  </>
                                ) : (
                                  <File className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white truncate">{f.name}</p>
                                <p className="text-[10px] text-[#8e9196]">{f.size}</p>
                              </div>
                              {(f.previewUrl || f.url) && (
                                <a
                                  href={f.previewUrl || f.url}
                                  download={f.name}
                                  className="p-1.5 text-[#8e9196] hover:text-[#d9a323] rounded-lg hover:bg-white/5 transition-colors shrink-0"
                                  title="Download file"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="sticky bottom-0 bg-[#0d0d0d] border-t border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  const enq = selectedEnquiry
                  setSelectedEnquiry(null)
                  navigate('/admin/quotations', { state: { fromEnquiry: enq } })
                }}
                className="px-4 py-2.5 rounded-lg bg-[#d9a323] hover:bg-[#e5b338] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                {selectedEnquiry.quoteId ? `View Quote (${selectedEnquiry.quoteId})` : 'Create Formal Quotation'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                >
                  Close
                </button>
                <a
                  href={`https://wa.me/${(selectedEnquiry.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedEnquiry.customerName)},%20this%20is%20EMMY-T%20CONCEPT%20regarding%20your%20request%20(${selectedEnquiry.id.toUpperCase()}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" /> Reply
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          LIGHTBOX: Full-screen image viewer
      ========================================================= */}
      {lightboxFile && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={() => setLightboxFile(null)}
        >
          <button
            onClick={() => setLightboxFile(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {imageFiles.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevLightbox() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextLightbox() }}
                className="absolute right-16 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center gap-3 px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxFile.previewUrl || lightboxFile.url}
              alt={lightboxFile.name}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="flex items-center gap-4 text-xs text-[#8e9196]">
              <span className="font-mono">{lightboxFile.name}</span>
              {lightboxFile.size && <span>{lightboxFile.size}</span>}
              {imageFiles.length > 1 && (
                <span>{lightboxIndex + 1} / {imageFiles.length}</span>
              )}
              {(lightboxFile.previewUrl || lightboxFile.url) && (
                <a
                  href={lightboxFile.previewUrl || lightboxFile.url}
                  download={lightboxFile.name}
                  className="text-[#d9a323] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: Set Price & Notes
      ========================================================= */}
      {editPriceModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setEditPriceModal(null)}
        >
          <div
            className="glass-panel rounded-2xl max-w-md w-full border border-[#d9a323]/30 p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-white">
                  Set Financials & Notes
                </h3>
                <p className="text-[10px] font-mono text-[#d9a323] mt-0.5">
                  {editPriceModal.id.toUpperCase()} · {editPriceModal.customerName}
                </p>
              </div>
              <button onClick={() => setEditPriceModal(null)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#8e9196]">Initial Quoted Price (₦ NGN)</label>
                <input
                  type="number"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  placeholder="e.g. 150000"
                  className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white font-mono outline-none focus:border-[#d9a323]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#8e9196]">Agreed Final Price (₦ NGN — after client negotiation)</label>
                <input
                  type="number"
                  value={agreedPrice}
                  onChange={(e) => setAgreedPrice(e.target.value)}
                  placeholder="e.g. 140000"
                  className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white font-mono outline-none focus:border-[#d9a323]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#8e9196]">Internal Production Notes</label>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. 50% deposit received. Artwork approved. Paper stock ordered from Apapa supplier..."
                  className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#d9a323] leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setEditPriceModal(null)}
                className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePricing}
                className="px-5 py-2.5 bg-[#d9a323] hover:bg-[#e5b338] text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

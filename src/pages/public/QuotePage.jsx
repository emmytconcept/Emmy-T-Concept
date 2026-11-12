import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams, Link } from 'react-router-dom'
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Layers,
  Phone,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Package,
  X,
  File,
  Zap,
  Clock
} from 'lucide-react'
import { WhatsAppIcon } from '../../components/shared/SocialIcons'
import { useAppStore } from '../../store/useAppStore'

export default function QuotePage() {
  const [searchParams] = useSearchParams()
  const initialService = searchParams.get('service') || ''
  const { services, addEnquiry, companyInfo } = useAppStore()

  const [submittedData, setSubmittedData] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [activeDeadlineTag, setActiveDeadlineTag] = useState('')
  const dateInputRef = useRef(null)

  const todayDate = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      serviceId: initialService,
      deliveryDate: '',
    },
  })

  const watchedDeliveryDate = watch('deliveryDate')

  const handleQuickDeadline = (days, label) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    const formatted = d.toISOString().split('T')[0]
    setValue('deliveryDate', formatted)
    setActiveDeadlineTag(label)
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    files.forEach((file) => {
      const isImage = file.type.startsWith('image/')
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

      if (isImage) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setUploadedFiles((prev) => [
            ...prev,
            {
              id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              type: file.type,
              isImage: true,
              isPdf: false,
              previewUrl: event.target.result,
            },
          ])
        }
        reader.readAsDataURL(file)
      } else {
        setUploadedFiles((prev) => [
          ...prev,
          {
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            type: file.type,
            isImage: false,
            isPdf,
            previewUrl: null,
          },
        ])
      }
    })
  }

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const onSubmit = async (data) => {
    // Find matching service name
    const foundService = services.find((s) => s.slug === data.serviceId || s.id === data.serviceId)
    const payload = {
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      serviceId: data.serviceId,
      serviceName: foundService ? foundService.name : data.serviceId,
      description: data.description,
      quantity: data.quantity || 'Standard',
      dimensions: data.dimensions || 'Standard',
      deliveryDate: data.deliveryDate || '',
      uploadedFiles,
    }

    const saved = addEnquiry(payload)
    setSubmittedData(saved)
    reset()
    setUploadedFiles([])
    setActiveDeadlineTag('')
  }

  return (
    <div className="py-12 relative overflow-hidden">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center pb-12">
        <p className="text-xs font-mono tracking-[0.25em] text-[#d9a323] uppercase mb-3">
          // ESTIMATION DESK
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Request A Commercial Quotation
        </h1>
        <div className="w-20 h-1 bg-[#d9a323] mx-auto rounded-full my-6" />
        <p className="text-[#9ca3af] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Provide your project specifications below. Our production estimators will analyze your request and issue an itemized formal quote.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {submittedData ? (
          /* Submission Success View */
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#d9a323] text-center space-y-6 animate-fade-in shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#d9a323]/20 text-[#d9a323] flex items-center justify-center mx-auto border border-[#d9a323]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Enquiry Successfully Logged!
              </h2>
              <p className="text-xs uppercase tracking-wider text-[#d9a323] font-semibold">
                Reference ID: <span className="font-mono text-white">{submittedData.id}</span>
              </p>
              <p className="text-sm text-[#8e9196] max-w-lg mx-auto pt-2">
                Thank you, <strong className="text-white">{submittedData.customerName}</strong>. Our production desk has received your request for{' '}
                <strong className="text-[#d9a323]">{submittedData.serviceName}</strong>. We will contact you shortly via phone or WhatsApp.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/track?ref=${submittedData.id}`}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#d9a323] hover:bg-[#e5b338] text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Package className="w-4 h-4" /> Track Order Status Live
              </Link>

              <a
                href={`https://wa.me/${(companyInfo.whatsapp || '').replace(/[^0-9]/g, '')}?text=Hello%20EMMY-T,%20I%20just%20submitted%20Quote%20Request%20(${submittedData.id})%20for%20${encodeURIComponent(submittedData.serviceName)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" /> Expedite on WhatsApp
              </a>

              <button
                onClick={() => setSubmittedData(null)}
                className="w-full sm:w-auto px-6 py-3.5 bg-white/5 border border-white/20 text-[#c6c8cc] hover:text-white text-xs font-semibold uppercase tracking-wider rounded-lg"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          /* Main Quotation Form */
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 shadow-2xl"
          >
            {/* Section 1: Contact Information */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <User className="w-4 h-4 text-[#d9a323]" />
                <span>1. Customer & Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#c6c8cc]">
                    Full Name <span className="text-[#d9a323]">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('customerName', { required: 'Name is required' })}
                    placeholder="e.g. Chief Adeleke Johnson"
                    className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                  />
                  {errors.customerName && (
                    <p className="text-[11px] text-red-400">{errors.customerName.message}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#c6c8cc]">
                    Phone Number (WhatsApp Preferred) <span className="text-[#d9a323]">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone is required' })}
                    placeholder="e.g. +234 803 000 0000"
                    className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-400">{errors.phone.message}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#c6c8cc]">
                    Official / Business Email <span className="text-[#d9a323]">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    placeholder="e.g. info@company.com"
                    className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Project Specifications */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Layers className="w-4 h-4 text-[#d9a323]" />
                <span>2. Project Specifications</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Service Select */}
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-medium text-[#c6c8cc]">
                    Primary Service Category <span className="text-[#d9a323]">*</span>
                  </label>
                  <select
                    {...register('serviceId', { required: 'Please select a service' })}
                    className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition-colors"
                  >
                    <option value="">Select Service...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.slug || s.id}>
                        {s.name}
                      </option>
                    ))}
                    <option value="custom">Other / Custom Requirement</option>
                  </select>
                  {errors.serviceId && (
                    <p className="text-[11px] text-red-400">{errors.serviceId.message}</p>
                  )}
                </div>

                {/* Required Quantity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#c6c8cc]">
                    Estimated Quantity
                  </label>
                  <input
                    type="text"
                    {...register('quantity')}
                    placeholder="e.g. 500 pcs, 4 units, 1,000 bags"
                    className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                  />
                </div>

                {/* Dimensions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#c6c8cc]">
                    Dimensions / Size (if applicable)
                  </label>
                  <input
                    type="text"
                    {...register('dimensions')}
                    placeholder="e.g. 8x4ft, A5, 60x120cm"
                    className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Delivery Date & File Upload Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Delivery Date with Date Picker & Quick Tags */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-medium text-[#c6c8cc] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#d9a323]" />
                      <span>Preferred Delivery Date</span>
                    </label>
                    {watchedDeliveryDate && (
                      <span className="text-[11px] text-[#d9a323] font-mono">
                        Selected: {watchedDeliveryDate}
                      </span>
                    )}
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="date"
                      min={todayDate}
                      {...register('deliveryDate')}
                      ref={(e) => {
                        register('deliveryDate').ref(e)
                        dateInputRef.current = e
                      }}
                      onClick={() => {
                        try {
                          dateInputRef.current?.showPicker?.()
                        } catch (err) {}
                      }}
                      onChange={(e) => {
                        setValue('deliveryDate', e.target.value)
                        setActiveDeadlineTag('')
                      }}
                      className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-lg pl-3.5 pr-11 py-2.5 text-sm text-white outline-none transition-colors cursor-pointer [color-scheme:dark]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          dateInputRef.current?.showPicker?.()
                        } catch (err) {}
                      }}
                      className="absolute right-2 p-1.5 text-[#8e9196] hover:text-[#d9a323] rounded transition-colors"
                      title="Open Calendar Date Picker"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Deadline Tap Tags (Clean, No Emojis) */}
                  <div className="pt-1 space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#8e9196] block">
                      Quick Turnaround Tags (Tap to set):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: '24h Expedited', days: 1 },
                        { label: '2–3 Days (Rush)', days: 3 },
                        { label: '1 Week (Standard)', days: 7 },
                        { label: '2 Weeks (Flexible)', days: 14 },
                      ].map((tag) => (
                        <button
                          key={tag.label}
                          type="button"
                          onClick={() => handleQuickDeadline(tag.days, tag.label)}
                          className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                            activeDeadlineTag === tag.label
                              ? 'bg-[#d9a323] text-black border-[#d9a323] font-bold shadow'
                              : 'bg-white/5 border-white/10 text-[#c6c8cc] hover:text-white hover:border-[#d9a323]/50'
                          }`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* File Upload with Image & PDF Previews */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#c6c8cc] flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5 text-[#d9a323]" />
                    <span>Upload Reference / Artwork / PDF (Optional)</span>
                  </label>

                  {/* Dropzone Trigger */}
                  <label className="border border-dashed border-white/20 hover:border-[#d9a323] bg-[#111111] rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <UploadCloud className="w-5 h-5 text-[#8e9196] group-hover:text-[#d9a323] transition-colors mb-1" />
                    <p className="text-xs font-semibold text-white">
                      Click to browse or drag & drop files
                    </p>
                    <p className="text-[10px] text-[#8e9196]">
                      Images (PNG, JPG) or PDF documents up to 25MB
                    </p>
                  </label>

                  {/* Uploaded File Previews (Images with thumbnail, PDFs with document badge) */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 pt-1 max-h-48 overflow-y-auto">
                      <div className="flex items-center justify-between text-[10px] text-[#8e9196]">
                        <span>Attached Files ({uploadedFiles.length}):</span>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles([])}
                          className="text-red-400 hover:underline"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {uploadedFiles.map((f) => (
                          <div
                            key={f.id}
                            className="relative group rounded-xl p-2 bg-[#161616] border border-white/10 flex items-center gap-2.5 overflow-hidden"
                          >
                            {/* Image Thumbnail Preview */}
                            {f.isImage ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-900 border border-white/10">
                                <img
                                  src={f.previewUrl}
                                  alt={f.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : f.isPdf ? (
                              /* PDF Preview Badge */
                              <div className="w-10 h-10 rounded-lg shrink-0 bg-red-500/15 border border-red-500/30 flex flex-col items-center justify-center text-red-400 font-bold">
                                <FileText className="w-4 h-4" />
                                <span className="text-[8px] font-mono leading-none mt-0.5">PDF</span>
                              </div>
                            ) : (
                              /* Other File Icon */
                              <div className="w-10 h-10 rounded-lg shrink-0 bg-white/5 border border-white/10 flex items-center justify-center text-[#d9a323]">
                                <File className="w-4 h-4" />
                              </div>
                            )}

                            {/* Name & Size */}
                            <div className="flex-1 min-w-0 pr-4">
                              <p className="text-[11px] font-medium text-white truncate" title={f.name}>
                                {f.name}
                              </p>
                              <p className="text-[9px] text-[#8e9196]">{f.size}</p>
                            </div>

                            {/* Remove Icon */}
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(f.id)}
                              className="text-neutral-500 hover:text-red-400 p-1 rounded transition-colors shrink-0"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#c6c8cc]">
                  Detailed Project Description & Notes <span className="text-[#d9a323]">*</span>
                </label>
                <textarea
                  rows={4}
                  {...register('description', { required: 'Please describe your project requirements' })}
                  placeholder="Detail your exact requirements: substrate (e.g., flex banner, matte paper, DTF t-shirt), colors, finishing (e.g., gold foil, eyelets), and any specific deadline notes..."
                  className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-lg p-3.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                />
                {errors.description && (
                  <p className="text-[11px] text-red-400">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#8e9196]">
                <ShieldCheck className="w-4 h-4 text-[#d9a323] shrink-0" />
                <span>Your information is protected & will only be used to generate your quote.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-3.5 bg-[#d9a323] hover:bg-[#e5b338] text-black font-bold uppercase tracking-wider text-xs rounded-lg shadow-lg hover:shadow-[#d9a323]/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Quote Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}


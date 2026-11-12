import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Printer,
  FileText,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Copy,
  Check,
  Building,
  Calendar,
  Layers,
  PhoneCall
} from 'lucide-react'
import { WhatsAppIcon } from '../../components/shared/SocialIcons'
import { useAppStore } from '../../store/useAppStore'
import { ORDER_STATUSES } from '../../lib/constants'

// Logical production milestones
const TRACKING_STAGES = [
  {
    key: 'new_enquiry',
    title: 'Enquiry Received',
    desc: 'Specifications logged in production queue',
    icon: FileText,
  },
  {
    key: 'quotation_sent',
    title: 'Quote Issued',
    desc: 'Formal pricing and material options calculated',
    icon: DollarSign,
  },
  {
    key: 'awaiting_payment',
    title: 'Order Confirmed',
    desc: 'Deposit confirmed & artwork approved for prepress',
    icon: ShieldCheck,
  },
  {
    key: 'in_production',
    title: 'In Production',
    desc: 'Press active, UV curing, die-cutting & finishing',
    icon: Printer,
  },
  {
    key: 'ready_for_collection',
    title: 'Quality Check & Ready',
    desc: 'Packaged, inspected and ready for pickup/dispatch',
    icon: Truck,
  },
  {
    key: 'completed',
    title: 'Delivered',
    desc: 'Job successfully delivered and signed off',
    icon: CheckCircle2,
  },
]

function getStageIndex(statusKey) {
  switch (statusKey) {
    case 'new_enquiry':
      return 0
    case 'awaiting_quotation':
    case 'quotation_sent':
      return 1
    case 'awaiting_payment':
      return 2
    case 'in_production':
      return 3
    case 'ready_for_collection':
    case 'dispatched':
      return 4
    case 'completed':
      return 5
    case 'cancelled':
      return -1
    default:
      return 0
  }
}

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { enquiries, companyInfo } = useAppStore()

  const [inputVal, setInputVal] = useState(searchParams.get('ref') || '')
  const [searchedOrder, setSearchedOrder] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const cleanPhone = (str) => (str || '').replace(/[^0-9]/g, '')

  const performSearch = (query) => {
    const trimmed = (query || '').trim()
    if (!trimmed) {
      setSearchedOrder(null)
      setHasSearched(false)
      return
    }

    setHasSearched(true)
    const normalized = trimmed.toLowerCase()
    const queryDigits = cleanPhone(trimmed)

    const match = enquiries.find((e) => {
      const matchId = (e.id || '').toLowerCase() === normalized
      const matchPhone = queryDigits.length >= 7 && cleanPhone(e.phone).includes(queryDigits)
      return matchId || matchPhone
    })

    setSearchedOrder(match || null)
  }

  // Handle URL query parameter on mount or URL change
  useEffect(() => {
    const refParam = searchParams.get('ref')
    if (refParam) {
      setInputVal(refParam)
      performSearch(refParam)
    }
  }, [searchParams, enquiries])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputVal.trim()) {
      setSearchParams({ ref: inputVal.trim() })
      performSearch(inputVal.trim())
    }
  }

  const handleCopyLink = () => {
    if (!searchedOrder) return
    const url = `${window.location.origin}/track?ref=${encodeURIComponent(searchedOrder.id)}`
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const currentStageIndex = searchedOrder ? getStageIndex(searchedOrder.status) : 0
  const isCancelled = searchedOrder?.status === 'cancelled'
  const statusMeta = searchedOrder
    ? ORDER_STATUSES[searchedOrder.status] || { label: searchedOrder.status, text: 'text-[#d9a323]' }
    : null

  const cleanWhatsApp = (companyInfo.whatsapp || '').replace(/[^0-9]/g, '')

  // Calculate percentage for progress line
  const progressPercent = searchedOrder
    ? Math.max(0, Math.min(100, (currentStageIndex / (TRACKING_STAGES.length - 1)) * 100))
    : 0

  return (
    <div className="py-12 sm:py-16 min-h-[80vh] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-xs font-mono tracking-[0.25em] text-[#d9a323] uppercase mb-2">
            // LIVE PRODUCTION TELEMETRY
          </p>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Track Order & Production Radar
          </h1>

          <div className="w-16 h-1 bg-[#d9a323] mx-auto rounded-full" />

          <p className="text-[#8e9196] text-sm max-w-xl mx-auto">
            Real-time manufacturing telemetry. No logins or accounts required — search with your Reference ID or registered phone number.
          </p>
        </div>

        {/* Search Bar Box */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8e9196] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Reference ID (e.g. ENQ-101) or Phone Number..."
                className="w-full bg-[#111111] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#d9a323] transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-[#d9a323] hover:bg-[#e5b338] text-black text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Track Order</span>
            </button>
          </form>

          {/* Quick Helper Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-[#8e9196] pt-3 border-t border-white/5 gap-2">
            <span className="flex items-center gap-1.5 flex-wrap">
              <HelpCircle className="w-3.5 h-3.5 text-[#d9a323]" />
              Quick Demo IDs: 
              <button
                type="button"
                onClick={() => { setInputVal('enq-101'); performSearch('enq-101'); }}
                className="text-[#d9a323] hover:underline font-mono bg-white/5 px-2 py-0.5 rounded"
              >
                ENQ-101
              </button>
              <button
                type="button"
                onClick={() => { setInputVal('enq-102'); performSearch('enq-102'); }}
                className="text-[#d9a323] hover:underline font-mono bg-white/5 px-2 py-0.5 rounded"
              >
                ENQ-102
              </button>
            </span>
            <span className="text-[11px] text-[#8e9196]">
              Synchronized directly with central print press
            </span>
          </div>
        </div>

        {/* Results Display */}
        {hasSearched && searchedOrder && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Main Telemetry Console */}
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl divide-y divide-white/5">
              
              {/* Top Banner: ID, Status, & Actions */}
              <div className="p-6 sm:p-8 bg-[#0c0c0c] flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs px-3 py-1 rounded-md bg-[#d9a323]/15 text-[#d9a323] border border-[#d9a323]/30 font-bold uppercase tracking-wider">
                      REF: {searchedOrder.id.toUpperCase()}
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[#c6c8cc] hover:text-white border border-white/10 transition-colors"
                      title="Copy sharable order link"
                    >
                      {copiedLink ? <Check className="w-3 h-3 text-[#d9a323]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedLink ? 'Link Copied' : 'Share Link'}</span>
                    </button>

                    <span className="text-xs text-[#8e9196]">
                      Logged on {new Date(searchedOrder.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
                    {searchedOrder.serviceName}
                  </h2>

                  <p className="text-xs text-[#8e9196]">
                    Client Account: <strong className="text-white font-medium">{searchedOrder.customerName}</strong>
                    {searchedOrder.phone && <span className="ml-2 font-mono text-[#c6c8cc]">({searchedOrder.phone})</span>}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col md:items-end justify-center shrink-0">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#8e9196] block mb-1">
                    Live Operational Phase
                  </span>
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 ${statusMeta?.bg || 'bg-[#d9a323]/15'} ${statusMeta?.text || 'text-[#d9a323]'} border ${statusMeta?.border || 'border-[#d9a323]/30'}`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-ping shrink-0" />
                    <span>{statusMeta?.label || searchedOrder.status}</span>
                  </div>
                </div>
              </div>

              {/* Cancelled Alert if applicable */}
              {isCancelled ? (
                <div className="p-6 bg-red-500/10 text-red-400 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>This enquiry was cancelled. Please contact our production desk on WhatsApp if you wish to reopen.</span>
                </div>
              ) : (
                /* Connected Milestone Rail */
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#d9a323] uppercase tracking-wider font-semibold">
                      // PRODUCTION PROGRESSION
                    </span>
                    <span className="text-xs text-[#8e9196] font-mono">
                      Phase {Math.min(currentStageIndex + 1, 6)} of 6
                    </span>
                  </div>

                  {/* Desktop Continuous Rail (>= md) */}
                  <div className="hidden md:block relative pt-2 pb-6">
                    {/* Background Track Line */}
                    <div className="absolute top-6 left-6 right-6 h-0.5 bg-white/10 -translate-y-1/2 z-0" />

                    {/* Active Progress Track Line */}
                    <div
                      className="absolute top-6 left-6 h-0.5 bg-[#d9a323] -translate-y-1/2 z-0 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(217,163,35,0.6)]"
                      style={{ width: `calc(${progressPercent}% * (1 - 48px / 100%))` }}
                    />

                    {/* Step Nodes */}
                    <div className="relative z-10 grid grid-cols-6 gap-2">
                      {TRACKING_STAGES.map((stage, idx) => {
                        const Icon = stage.icon
                        const isPast = currentStageIndex > idx
                        const isCurrent = currentStageIndex === idx
                        const isFuture = currentStageIndex < idx

                        return (
                          <div key={stage.key} className="flex flex-col items-center text-center group">
                            {/* Node Dot / Icon */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isCurrent
                                  ? 'bg-[#0a0a0a] border-2 border-[#d9a323] text-[#d9a323] ring-4 ring-[#d9a323]/20 shadow-lg shadow-[#d9a323]/30 scale-110'
                                  : isPast
                                  ? 'bg-[#d9a323] text-black font-bold'
                                  : 'bg-[#141414] border border-white/10 text-neutral-500'
                              }`}
                            >
                              {isPast ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : isCurrent ? (
                                <Icon className="w-4 h-4" />
                              ) : (
                                <span className="font-mono text-[11px] font-medium">0{idx + 1}</span>
                              )}
                            </div>

                            {/* Node Labels */}
                            <div className="mt-3 space-y-0.5">
                              <p
                                className={`font-heading text-xs font-bold leading-tight ${
                                  isCurrent ? 'text-white' : isPast ? 'text-white/90' : 'text-neutral-500'
                                }`}
                              >
                                {stage.title}
                              </p>
                              <p className="text-[10px] font-mono">
                                {isCurrent ? (
                                  <span className="text-[#d9a323] font-bold">Active Now</span>
                                ) : isPast ? (
                                  <span className="text-emerald-400">Completed</span>
                                ) : (
                                  <span className="text-neutral-600">Pending</span>
                                )}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Mobile Vertical Stepper (< md) */}
                  <div className="block md:hidden relative pl-6 space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                    {TRACKING_STAGES.map((stage, idx) => {
                      const Icon = stage.icon
                      const isPast = currentStageIndex > idx
                      const isCurrent = currentStageIndex === idx

                      return (
                        <div key={stage.key} className="relative flex items-start gap-4">
                          {/* Node Icon on line */}
                          <div
                            className={`w-7 h-7 rounded-full -ml-[13px] flex items-center justify-center shrink-0 z-10 ${
                              isCurrent
                                ? 'bg-black border-2 border-[#d9a323] text-[#d9a323] ring-4 ring-[#d9a323]/20 scale-110'
                                : isPast
                                ? 'bg-[#d9a323] text-black'
                                : 'bg-[#181818] border border-white/15 text-neutral-500'
                            }`}
                          >
                            {isPast ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              <Icon className="w-3.5 h-3.5" />
                            )}
                          </div>

                          <div className="space-y-0.5 flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`text-xs font-bold ${isCurrent ? 'text-white' : isPast ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                {stage.title}
                              </p>
                              {isCurrent && (
                                <span className="text-[10px] font-mono text-[#d9a323] font-bold uppercase">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#8e9196] leading-tight">
                              {stage.desc}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Technical Job Specifications Sheet (Clean Industrial Grid) */}
              <div className="p-6 sm:p-8 space-y-4">
                <p className="text-xs font-mono uppercase tracking-wider text-[#d9a323] font-semibold">
                  // PRODUCTION JOB SPECIFICATION
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#8e9196] block">
                      Production Volume
                    </span>
                    <p className="text-white font-bold font-heading text-sm">
                      {searchedOrder.quantity || 'Standard Run'}
                    </p>
                    <p className="text-[11px] text-[#8e9196]">
                      {searchedOrder.dimensions || 'Custom Dimensions'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#8e9196] block">
                      Target Completion
                    </span>
                    <p className="text-white font-bold font-heading text-sm">
                      {searchedOrder.deliveryDate || 'Standard Turnaround'}
                    </p>
                    <p className="text-[11px] text-[#d9a323]">
                      Lagos Facility Queue
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#8e9196] block">
                      Commercial Valuation
                    </span>
                    <p className="text-white font-bold font-mono text-sm">
                      {searchedOrder.agreedPrice || searchedOrder.quotedPrice ? (
                        `₦${Number(searchedOrder.agreedPrice || searchedOrder.quotedPrice).toLocaleString()}`
                      ) : (
                        <span className="text-amber-400 font-sans text-xs">Costing In Progress</span>
                      )}
                    </p>
                    <p className="text-[11px] text-[#8e9196]">
                      {searchedOrder.agreedPrice ? 'Agreed Production Quote' : 'Subject to Formal Invoice'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#8e9196] block">
                      Dispatch Method
                    </span>
                    <p className="text-white font-bold font-heading text-sm">
                      Central Pickup / Courier
                    </p>
                    <p className="text-[11px] text-[#8e9196]">
                      Lagos Island & Nationwide
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Production Desk Dispatch Note */}
              {searchedOrder.notes && (
                <div className="p-6 sm:p-8 bg-white/[0.02] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#d9a323]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9a323]" />
                    <span className="uppercase tracking-wider font-semibold">Production Desk Dispatch Log:</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#141414] border border-white/10 text-xs text-white leading-relaxed font-sans">
                    {searchedOrder.notes}
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a0a0a]">
                <button
                  type="button"
                  onClick={() => performSearch(searchedOrder.id)}
                  className="text-xs text-[#8e9196] hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Telemetry</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=Hello%20EMMY-T,%20I%20am%20tracking%20my%20order%20(${searchedOrder.id})%20for%20${encodeURIComponent(searchedOrder.serviceName)}.%20Could%20you%20please%20give%20me%20a%20status%20update?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                    <span>Expedite via WhatsApp Desk</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Not Found Screen */}
        {hasSearched && !searchedOrder && (
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 text-center space-y-5 animate-fade-in shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-heading text-xl font-bold text-white">
                No Record Found for "{inputVal}"
              </h3>
              <p className="text-xs text-[#8e9196] max-w-md mx-auto leading-relaxed">
                We could not find an enquiry matching this reference ID or phone number. Please check the spelling or format.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=Hello%20EMMY-T,%20I%20am%20trying%20to%20track%20my%20order%20query%20"${encodeURIComponent(inputVal)}"%20and%20need%20assistance.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" /> Help Me Find My Order on WhatsApp
              </a>

              <Link
                to="/quote"
                className="px-6 py-3 bg-white/5 border border-white/20 text-[#c6c8cc] hover:text-white text-xs font-semibold uppercase tracking-wider rounded-lg"
              >
                Submit New Request
              </Link>
            </div>
          </div>
        )}

        {/* Informative Guidance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#d9a323]" />
            <h4 className="font-heading font-bold text-sm text-white">No Passwords or Logins</h4>
            <p className="text-xs text-[#8e9196] leading-relaxed">
              Track from your phone, laptop, or office tablet anytime using your reference ID or mobile phone number.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <Printer className="w-5 h-5 text-[#d9a323]" />
            <h4 className="font-heading font-bold text-sm text-white">Direct Production Sync</h4>
            <p className="text-xs text-[#8e9196] leading-relaxed">
              When our prepress or machine operators advance your job status, this tracker updates in real time.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <Truck className="w-5 h-5 text-[#d9a323]" />
            <h4 className="font-heading font-bold text-sm text-white">Express Dispatch Notification</h4>
            <p className="text-xs text-[#8e9196] leading-relaxed">
              Once packaged and inspected, collection instructions and courier tracking notes appear right here.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Plus, Download, X, Users, Check, Share2, CheckCheck } from 'lucide-react'
import { WhatsAppIcon } from '../../components/shared/SocialIcons'
import { useAppStore } from '../../store/useAppStore'

export default function AdminQuotationsPage() {
  const { quotations, addQuotation, createQuotationFromEnquiry, enquiries, updateEnquiryStatus, updateEnquiryPricing } = useAppStore()
  const location = useLocation()

  const [modalOpen, setModalOpen] = useState(false)
  const [viewingQuote, setViewingQuote] = useState(null)

  // PDF download state
  const [downloading, setDownloading] = useState(false)
  const [copiedId, setCopiedId] = useState(false)    // ref ID copied
  const quotationDocRef = useRef(null)

  const copyRefId = async (id) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    } catch {}
  }

  // Builder form state
  const [enquiryId, setEnquiryId] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const [items, setItems] = useState([
    { description: 'Flex Banner Large-Format Print (10x5ft)', qty: 1, unitPrice: 35000, total: 35000 },
  ])

  // Autocomplete suggestion state
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef(null)

  // Aggregate unique saved customers from enquiries
  const savedCustomers = []
  const seenKeys = new Set()
  enquiries.forEach((enq) => {
    const key = (enq.phone || enq.customerName || '').trim().toLowerCase()
    if (key && !seenKeys.has(key)) {
      seenKeys.add(key)
      savedCustomers.push({
        name: enq.customerName,
        phone: enq.phone,
        email: enq.email || '',
        recentService: enq.serviceName,
        enquiryId: enq.id,
      })
    }
  })

  // Filter suggestions
  const filteredCustomers = customerName.trim()
    ? savedCustomers.filter((c) =>
        c.name.toLowerCase().includes(customerName.toLowerCase()) ||
        c.phone.includes(customerName)
      )
    : savedCustomers.slice(0, 5)

  // Auto-fill from navigation state (e.g. from AdminOrdersPage "Generate Formal Quote")
  useEffect(() => {
    if (location.state?.fromEnquiry) {
      const enq = location.state.fromEnquiry
      setEnquiryId(enq.id)
      setCustomerName(enq.customerName || '')
      setCustomerPhone(enq.phone || '')
      setCustomerEmail(enq.email || '')
      setDeliveryCharge(0)
      setItems([
        {
          description: `${enq.serviceName}${enq.dimensions ? ` (${enq.dimensions})` : ''}${enq.quantity ? ` - ${enq.quantity}` : ''}`,
          qty: 1,
          unitPrice: enq.quotedPrice || 0,
          total: enq.quotedPrice || 0,
        },
      ])
      setModalOpen(true)
    }
  }, [location.state])

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectCustomer = (cust) => {
    setCustomerName(cust.name)
    setCustomerPhone(cust.phone)
    setCustomerEmail(cust.email || '')
    setEnquiryId(cust.enquiryId || null)
    setShowSuggestions(false)
  }

  const subtotal = items.reduce((acc, curr) => acc + (curr.total || 0), 0)
  const grandTotal = subtotal + parseFloat(deliveryCharge || 0)

  const handleAddItem = () => {
    setItems([...items, { description: '', qty: 1, unitPrice: 0, total: 0 }])
  }

  const handleUpdateItem = (index, field, value) => {
    const updated = [...items]
    updated[index][field] = value

    if (field === 'qty' || field === 'unitPrice') {
      const q = parseFloat(updated[index].qty) || 0
      const p = parseFloat(updated[index].unitPrice) || 0
      updated[index].total = q * p
    }
    setItems(updated)
  }

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSaveQuotation = (e) => {
    e.preventDefault()
    const newQuote = {
      id: `QT-${new Date().getFullYear()}-${(quotations.length + 1).toString().padStart(3, '0')}`,
      enquiryId: enquiryId || null,
      customerName,
      customerPhone,
      customerEmail,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items,
      subtotal,
      deliveryCharge: parseFloat(deliveryCharge || 0),
      total: grandTotal,
      status: 'sent',
    }

    if (enquiryId && createQuotationFromEnquiry) {
      createQuotationFromEnquiry(enquiryId, newQuote)
    } else {
      addQuotation(newQuote)
      if (enquiryId) {
        updateEnquiryStatus(enquiryId, 'quotation_sent', `Formal Quote ${newQuote.id} issued (₦${grandTotal.toLocaleString()})`)
        updateEnquiryPricing(enquiryId, grandTotal, null)
      }
    }

    setModalOpen(false)
    setViewingQuote(newQuote)
  }

  // ── PDF download: render an off-screen white A4 element, capture → jsPDF ──
  const downloadPDF = async (quote) => {
    const q = quote || viewingQuote
    if (!q) return
    setDownloading(true)

    try {
      const { default: html2canvas } = await import('html2canvas')
      const { default: jsPDF } = await import('jspdf')

      // Build an off-screen white A4 div so the capture is clean — no modal chrome
      const container = document.createElement('div')
      container.style.cssText = [
        'position:fixed', 'left:-9999px', 'top:0',
        'width:794px',          // ≈ A4 at 96dpi
        'background:#ffffff',
        'color:#111111',
        'font-family:Inter,sans-serif',
        'font-size:12px',
        'line-height:1.6',
        'padding:48px 56px',
        'box-sizing:border-box',
      ].join(';')

      container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #d9a323;padding-bottom:24px;margin-bottom:24px">
          <div style="display:flex;align-items:center;gap:14px">
            <img src="/logo-mark.png" style="height:48px;object-fit:contain" crossorigin="anonymous" />
            <div>
              <div style="font-size:18px;font-weight:800;letter-spacing:0.08em;color:#111">EMMY-T CONCEPT</div>
              <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.2em;color:#d9a323;margin-top:3px">Official Corporate Quotation</div>
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-family:monospace;font-size:14px;font-weight:700;color:#d9a323">${q.id}</div>
            ${q.enquiryId ? `<div style="font-size:10px;color:#666;font-family:monospace">Order: ${q.enquiryId.toUpperCase()}</div>` : ''}
            <div style="font-size:10px;color:#666">Issued: ${q.date}</div>
            <div style="font-size:10px;color:#666">Valid Until: ${q.validUntil}</div>
          </div>
        </div>

        <div style="background:#f8f8f8;border:1px solid #eee;border-radius:8px;padding:14px 18px;margin-bottom:24px">
          <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.15em;color:#d9a323;font-weight:700;margin-bottom:6px">Prepared For Client:</div>
          <div style="font-size:14px;font-weight:700;color:#111">${q.customerName}</div>
          <div style="font-size:11px;color:#555;margin-top:2px">${q.customerPhone}${q.customerEmail ? ' · ' + q.customerEmail : ''}</div>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:16px">
          <thead>
            <tr style="border-bottom:1px solid #ddd;color:#888;text-transform:uppercase;font-size:9px;letter-spacing:0.1em">
              <th style="text-align:left;padding:8px 0">Item Description</th>
              <th style="text-align:center;padding:8px 12px">Qty</th>
              <th style="text-align:right;padding:8px 0">Unit Price (₦)</th>
              <th style="text-align:right;padding:8px 0 8px 16px">Total (₦)</th>
            </tr>
          </thead>
          <tbody>
            ${q.items?.map(item => `
              <tr style="border-bottom:1px solid #f0f0f0">
                <td style="padding:10px 0;color:#111;font-weight:500">${item.description}</td>
                <td style="padding:10px 12px;text-align:center;color:#444">${item.qty}</td>
                <td style="padding:10px 0;text-align:right;color:#444;font-family:monospace">${parseFloat(item.unitPrice||0).toLocaleString()}</td>
                <td style="padding:10px 0 10px 16px;text-align:right;font-weight:700;color:#111;font-family:monospace">${parseFloat(item.total||0).toLocaleString()}</td>
              </tr>`).join('')}
          </tbody>
        </table>

        <div style="text-align:right;border-top:1px solid #eee;padding-top:12px">
          <div style="font-size:11px;color:#666;margin-bottom:4px">Subtotal: <span style="font-family:monospace;color:#111">₦${q.subtotal?.toLocaleString()}</span></div>
          ${q.deliveryCharge > 0 ? `<div style="font-size:11px;color:#666;margin-bottom:4px">Delivery / Logistics: <span style="font-family:monospace;color:#111">₦${q.deliveryCharge?.toLocaleString()}</span></div>` : ''}
          <div style="font-size:18px;font-weight:800;color:#d9a323;border-top:2px solid #d9a323;padding-top:10px;margin-top:8px">Grand Total: ₦${q.total?.toLocaleString()}</div>
        </div>

        <div style="margin-top:28px;padding:14px 18px;background:#f8f8f8;border:1px solid #eee;border-radius:8px;font-size:10px;color:#555">
          <div style="font-weight:700;color:#333;margin-bottom:6px">Payment & Production Terms:</div>
          <div>• 70% deposit required prior to production kickoff; 30% balance upon collection/dispatch.</div>
          <div>• Bank: Zenith Bank | Account: EMMY-T CONCEPT</div>
        </div>

        <div style="margin-top:36px;text-align:center;font-size:9px;color:#aaa;border-top:1px solid #eee;padding-top:16px">
          EMMY-T CONCEPT · Premium Corporate Print & Branding · This quotation is valid for 14 days from the issue date.
        </div>
      `

      document.body.appendChild(container)

      // Wait one frame for images to load
      await new Promise(r => setTimeout(r, 300))

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      document.body.removeChild(container)

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const imgH = (canvas.height * pageW) / canvas.width

      let yPos = 0
      let heightLeft = imgH

      pdf.addImage(imgData, 'PNG', 0, yPos, pageW, imgH)
      heightLeft -= pageH

      while (heightLeft > 0) {
        yPos -= pageH
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, yPos, pageW, imgH)
        heightLeft -= pageH
      }

      pdf.save(`EMMY-T-Quotation-${q.id}-${q.customerName.replace(/\s+/g, '-')}.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  // ── Share: Web Share API → clipboard text fallback ────────────────────────
  const handleShare = async () => {
    if (!viewingQuote) return
    const text = [
      `EMMY-T CONCEPT — Official Quotation`,
      `Ref: ${viewingQuote.id}`,
      `Client: ${viewingQuote.customerName}`,
      ``,
      viewingQuote.items?.map(i => `• ${i.description} (×${i.qty}) — ₦${i.total?.toLocaleString()}`).join('\n'),
      ``,
      `Grand Total: ₦${viewingQuote.total?.toLocaleString()}`,
      `Valid Until: ${viewingQuote.validUntil}`,
    ].join('\n')
    if (navigator.share) { try { await navigator.share({ title: `Quotation ${viewingQuote.id}`, text }); return } catch {} }
    try { await navigator.clipboard.writeText(text); setCopiedId(true); setTimeout(() => setCopiedId(false), 2000) } catch {}
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">Quotation Generation & Invoicing</h2>
          <p className="text-xs text-[#8e9196] mt-0.5">
            Prepare, calculate, and transmit executive formal quotations with itemized line items
          </p>
        </div>

        <button
          onClick={() => {
            setEnquiryId(null)
            setCustomerName('')
            setCustomerPhone('')
            setCustomerEmail('')
            setDeliveryCharge(0)
            setItems([{ description: '', qty: 1, unitPrice: 0, total: 0 }])
            setModalOpen(true)
          }}
          className="px-5 py-2.5 bg-[#d9a323] hover:bg-[#e5b338] text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Create Formal Quotation
        </button>
      </div>

      {/* Quotations Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#8e9196] uppercase tracking-wider bg-white/5">
                <th className="py-3.5 px-4 font-semibold">Quote #</th>
                <th className="py-3.5 px-4 font-semibold">Recipient</th>
                <th className="py-3.5 px-4 font-semibold">Linked Order</th>
                <th className="py-3.5 px-4 font-semibold">Issued Date</th>
                <th className="py-3.5 px-4 font-semibold">Valid Until</th>
                <th className="py-3.5 px-4 font-semibold">Total (₦ NGN)</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {quotations.map((q) => (
                <tr key={q.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#d9a323]">{q.id}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{q.customerName}</p>
                    <p className="text-[11px] text-[#8e9196]">{q.customerPhone}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    {q.enquiryId ? (
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/5 text-[#d9a323] border border-white/10">
                        {q.enquiryId.toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-neutral-500 italic text-[11px]">Direct / Walk-in</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#8e9196]">{q.date}</td>
                  <td className="py-3.5 px-4 text-[#8e9196]">{q.validUntil}</td>
                  <td className="py-3.5 px-4 font-bold text-white font-mono">
                    ₦{q.total?.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#d9a323]/20 text-[#f5d061] border border-[#d9a323]/40 uppercase">
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingQuote(q)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => downloadPDF(q)}
                        className="p-1 text-[#8e9196] hover:text-[#d9a323] transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Quotation Document */}
      {viewingQuote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
          onClick={() => setViewingQuote(null)}
        >
          <div
            className="bg-[#0e0e0e] text-white rounded-2xl max-w-2xl w-full border border-[#d9a323]/30 shadow-2xl my-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Document preview — dark-themed for screen readability */}
            <div ref={quotationDocRef} className="p-8 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#d9a323]/25 pb-6">
                <div className="flex items-center gap-3">
                  <img src="/logo-mark.png" alt="EMMY-T" className="h-11 w-auto object-contain" />
                  <div>
                    <p className="font-heading font-extrabold text-lg tracking-widest text-white">EMMY-T CONCEPT</p>
                    <p className="text-[9px] uppercase tracking-[0.22em] text-[#d9a323] mt-0.5">Official Corporate Quotation</p>
                  </div>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="font-mono text-sm font-bold text-[#d9a323]">{viewingQuote.id}</p>
                  {viewingQuote.enquiryId && (
                    <p className="text-[10px] font-mono text-[#8e9196]">Order: {viewingQuote.enquiryId.toUpperCase()}</p>
                  )}
                  <p className="text-[10px] text-[#8e9196]">Issued: {viewingQuote.date}</p>
                  <p className="text-[10px] text-[#8e9196]">Valid Until: {viewingQuote.validUntil}</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="p-4 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs">
                <p className="text-[9px] uppercase tracking-[0.18em] text-[#d9a323] font-bold mb-1.5">Prepared For Client</p>
                <p className="font-bold text-white text-sm">{viewingQuote.customerName}</p>
                <p className="text-[#8e9196] mt-0.5">{viewingQuote.customerPhone}{viewingQuote.customerEmail ? ` · ${viewingQuote.customerEmail}` : ''}</p>
              </div>

              {/* Line Items */}
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#8e9196] text-[9px] uppercase tracking-widest">
                    <th className="pb-2.5 font-semibold">Item Description</th>
                    <th className="pb-2.5 text-center font-semibold w-12">Qty</th>
                    <th className="pb-2.5 text-right font-semibold w-28">Unit Price</th>
                    <th className="pb-2.5 text-right font-semibold w-28 pl-4">Total (₦)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {viewingQuote.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 text-white/90">{item.description}</td>
                      <td className="py-2.5 text-center text-[#c6c8cc]">{item.qty}</td>
                      <td className="py-2.5 text-right font-mono text-[#c6c8cc]">{parseFloat(item.unitPrice||0).toLocaleString()}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-white pl-4">{parseFloat(item.total||0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="text-right text-xs space-y-1 border-t border-[#d9a323]/20 pt-4">
                <p className="text-[#8e9196]">Subtotal — <span className="font-mono text-white">₦{viewingQuote.subtotal?.toLocaleString()}</span></p>
                {viewingQuote.deliveryCharge > 0 && (
                  <p className="text-[#8e9196]">Logistics — <span className="font-mono text-white">₦{viewingQuote.deliveryCharge?.toLocaleString()}</span></p>
                )}
                <p className="text-xl font-bold text-[#d9a323] font-heading pt-2 border-t border-[#d9a323]/20">
                  Grand Total — ₦{viewingQuote.total?.toLocaleString()}
                </p>
              </div>

              {/* Terms */}
              <div className="text-[10px] text-[#8e9196] space-y-1 pt-2 border-t border-white/[0.06]">
                <p className="font-semibold text-[#c6c8cc] mb-1">Payment & Production Terms</p>
                <p>70% deposit required prior to production kickoff. 30% balance upon collection / dispatch.</p>
                <p>Bank: Zenith Bank · Account Name: EMMY-T CONCEPT</p>
              </div>
            </div>

            {/* Action bar — strictly below the ref, never captured */}
            <div className="border-t border-white/10 px-8 py-4 flex items-center justify-between gap-3 bg-[#0a0a0a]">
              {/* Left: ref ID + copy */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#8e9196]">{viewingQuote.id}</span>
                <button
                  onClick={() => copyRefId(viewingQuote.id)}
                  title="Copy reference ID"
                  className={`p-1.5 rounded transition-colors ${copiedId ? 'text-emerald-400' : 'text-[#8e9196] hover:text-white'}`}
                >
                  {copiedId ? <CheckCheck className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadPDF(viewingQuote)}
                  disabled={downloading}
                  className="px-4 py-2 bg-[#d9a323] hover:bg-[#e5b338] disabled:opacity-50 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  {downloading ? 'Generating…' : 'Download PDF'}
                </button>
                <a
                  href={`https://wa.me/${viewingQuote.customerPhone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(
                    `Hello ${viewingQuote.customerName}, please find your official quotation (${viewingQuote.id}) from EMMY-T CONCEPT below:\n\n` +
                    viewingQuote.items?.map(i=>`• ${i.description} (×${i.qty}) — ₦${i.total?.toLocaleString()}`).join('\n') +
                    `\n\nGrand Total: ₦${viewingQuote.total?.toLocaleString()}\nValid Until: ${viewingQuote.validUntil}\n\n70% deposit required. Bank: Zenith Bank | EMMY-T CONCEPT`
                  )}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-white" /> WhatsApp
                </a>
                <button
                  onClick={() => setViewingQuote(null)}
                  className="p-2 text-[#8e9196] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Build Formal Quotation */}
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
              <div>
                <h3 className="font-heading text-xl font-bold text-white">
                  Build Formal Quotation
                </h3>
                {enquiryId && (
                  <p className="text-[11px] text-[#d9a323] font-mono mt-0.5">
                    Linked to Enquiry: #{enquiryId.toUpperCase()} (Client status will auto-update on issue)
                  </p>
                )}
              </div>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuotation} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Client Name with Live Autocomplete Suggestions */}
                <div className="space-y-1 relative" ref={suggestionsRef}>
                  <label className="text-[#8e9196] flex items-center justify-between">
                    <span>Client Name *</span>
                    {savedCustomers.length > 0 && (
                      <span className="text-[10px] text-[#d9a323] font-mono">
                        {savedCustomers.length} saved
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setCustomerName(e.target.value)
                      setShowSuggestions(true)
                    }}
                    placeholder="Type client name..."
                    className="w-full bg-[#111111] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#d9a323]"
                    autoComplete="off"
                  />

                  {/* Autocomplete Dropdown Menu */}
                  {showSuggestions && filteredCustomers.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#141414] border border-[#d9a323]/30 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto divide-y divide-white/5">
                      <div className="p-2 text-[10px] font-mono text-[#8e9196] uppercase bg-white/5 flex items-center justify-between">
                        <span>Select Saved Client:</span>
                        <Users className="w-3 h-3 text-[#d9a323]" />
                      </div>
                      {filteredCustomers.map((c, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectCustomer(c)}
                          className="w-full p-2.5 text-left hover:bg-[#d9a323]/10 hover:border-l-2 hover:border-l-[#d9a323] transition-colors flex flex-col gap-0.5"
                        >
                          <span className="font-bold text-white text-xs">{c.name}</span>
                          <span className="text-[10px] text-[#8e9196] font-mono">{c.phone} {c.recentService ? `· ${c.recentService}` : ''}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[#8e9196]">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-[#111111] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#d9a323]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#8e9196]">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="client@email.com"
                    className="w-full bg-[#111111] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-[#d9a323]"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[#d9a323] font-bold uppercase tracking-wider text-[11px]">
                    Quotation Line Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-[11px] text-[#d9a323] hover:underline font-bold"
                  >
                    + Add Another Item
                  </button>
                </div>

                {/* Column labels */}
                <div className="grid grid-cols-12 gap-2 px-1 pb-0.5">
                  <span className="col-span-6 text-[10px] text-[#8e9196] uppercase tracking-wider">Description</span>
                  <span className="col-span-2 text-[10px] text-[#8e9196] uppercase tracking-wider text-center">Qty</span>
                  <span className="col-span-3 text-[10px] text-[#8e9196] uppercase tracking-wider text-right">Unit Price (₦)</span>
                  <span className="col-span-1" />
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6">
                      <input
                        type="text"
                        required
                        placeholder="Item / service description..."
                        value={item.description}
                        onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                        className="w-full bg-[#111111] border border-white/10 rounded p-2 text-white placeholder:text-white/20 outline-none focus:border-[#d9a323]"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={item.qty}
                        onChange={(e) => handleUpdateItem(idx, 'qty', e.target.value)}
                        className="w-full bg-[#111111] border border-white/10 rounded p-2 text-white text-center outline-none focus:border-[#d9a323]"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(idx, 'unitPrice', e.target.value)}
                        className="w-full bg-[#111111] border border-white/10 rounded p-2 text-white text-right font-mono outline-none focus:border-[#d9a323]"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-400 hover:text-red-300 font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Charge */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <label className="text-[#8e9196]">Logistics / Delivery Surcharge (₦ NGN):</label>
                <input
                  type="number"
                  min="0"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  className="w-36 bg-[#111111] border border-white/10 rounded p-2 text-white text-right font-mono"
                />
              </div>

              {/* Summary Total */}
              <div className="p-4 rounded-xl bg-white/5 border border-[#d9a323]/20 flex items-center justify-between font-bold">
                <span className="text-[#8e9196] uppercase tracking-wider text-xs">Total Quotation Value:</span>
                <span className="text-xl font-heading text-[#d9a323] font-mono">
                  ₦{grandTotal.toLocaleString()}
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-white/5 text-[#c6c8cc] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#d9a323] hover:bg-[#e5b338] text-black font-bold uppercase tracking-wider text-xs shadow-md"
                >
                  {enquiryId ? 'Issue & Sync With Order' : 'Save & Issue Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

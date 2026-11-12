import React, { useState } from 'react'
import { Users, Phone, Mail, Search, ShoppingBag } from 'lucide-react'
import { WhatsAppIcon } from '../../components/shared/SocialIcons'
import { useAppStore } from '../../store/useAppStore'

export default function AdminCustomersPage() {
  const { enquiries } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')

  // Aggregate unique customers from enquiries
  const customerMap = {}
  enquiries.forEach((enq) => {
    const key = enq.phone || enq.customerName
    if (!customerMap[key]) {
      customerMap[key] = {
        name: enq.customerName,
        phone: enq.phone,
        email: enq.email,
        ordersCount: 1,
        totalSpend: enq.agreedPrice || enq.quotedPrice || 0,
        lastOrder: enq.createdAt,
        services: [enq.serviceName],
      }
    } else {
      customerMap[key].ordersCount += 1
      customerMap[key].totalSpend += enq.agreedPrice || enq.quotedPrice || 0
      if (!customerMap[key].services.includes(enq.serviceName)) {
        customerMap[key].services.push(enq.serviceName)
      }
    }
  })

  const customers = Object.values(customerMap).filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">Customer Database & CRM</h2>
          <p className="text-xs text-[#8e9196] mt-0.5">
            Profiles, order histories, and direct communication channels for all clients
          </p>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#c6c8cc]">
          Total Clients: <strong className="text-white">{customers.length}</strong>
        </span>
      </div>

      {/* Search */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center max-w-md">
        <Search className="w-4 h-4 text-[#8e9196] mr-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by client name, phone, or email..."
          className="w-full bg-transparent text-xs text-white placeholder-neutral-600 outline-none"
        />
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((c, idx) => (
          <div
            key={idx}
            className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-[#d9a323]/15 text-[#d9a323] font-heading font-bold text-sm flex items-center justify-center border border-[#d9a323]/30">
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#d9a323]">
                  {c.ordersCount} {c.ordersCount === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-base text-white">{c.name}</h3>
                <p className="text-xs text-[#8e9196] mt-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#d9a323]" /> {c.phone}
                </p>
                {c.email && (
                  <p className="text-xs text-[#8e9196] mt-1 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#d9a323]" /> {c.email}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] space-y-1">
                <p className="text-[#8e9196]">Services Requested:</p>
                <div className="flex flex-wrap gap-1">
                  {c.services.map((srv, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-black text-[#c6c8cc]">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8e9196] uppercase">Total Value:</span>
                <p className="text-xs font-bold text-[#d9a323]">
                  ₦{c.totalSpend ? c.totalSpend.toLocaleString() : '0'}
                </p>
              </div>

              <a
                href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)},%20this%20is%20EMMY-T%20CONCEPT.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-white" /> WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


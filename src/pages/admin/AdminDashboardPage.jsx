import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  FileCheck2,
  Palette,
  Users,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Star
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { ORDER_STATUSES } from '../../lib/constants'

export default function AdminDashboardPage() {
  const { enquiries, quotations, portfolio, services } = useAppStore()

  const pendingEnquiries = enquiries.filter((e) => e.status === 'new_enquiry')
  const inProduction = enquiries.filter((e) => e.status === 'in_production')
  const completedOrders = enquiries.filter((e) => e.status === 'completed')

  const totalRevenue = enquiries.reduce((acc, curr) => acc + (curr.agreedPrice || curr.quotedPrice || 0), 0)

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#d9a323]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#d9a323]">
            EMMY-T Concept Administration Portal
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Business Performance & Operations Overview
          </h2>
          <p className="text-xs text-[#8e9196] mt-1">
            System status: All systems operational · Database connected · 0 errors
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/portfolio"
            className="px-4 py-2.5 bg-[#d9a323] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" /> Add Project
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Enquiries */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8e9196]">
              Total Enquiries
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading text-3xl font-bold text-white">{enquiries.length}</p>
          <p className="text-[11px] text-[#8e9196] flex items-center gap-1">
            <span className="text-blue-400 font-bold">{pendingEnquiries.length} pending review</span>
          </p>
        </div>

        {/* In Production */}
        <div className="glass-panel p-6 rounded-2xl border border-[#d9a323]/25 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#d9a323]">
              In Production
            </span>
            <div className="p-2 rounded-lg bg-[#d9a323]/15 text-[#d9a323]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading text-3xl font-bold text-[#d9a323]">{inProduction.length}</p>
          <p className="text-[11px] text-[#8e9196]">Currently running on printing presses</p>
        </div>

        {/* Total Quotations */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8e9196]">
              Quotations Issued
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading text-3xl font-bold text-white">{quotations.length}</p>
          <p className="text-[11px] text-[#8e9196]">Formal proposals sent to clients</p>
        </div>

        {/* Published Portfolio */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8e9196]">
              Portfolio Items
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Palette className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading text-3xl font-bold text-white">{portfolio.length}</p>
          <p className="text-[11px] text-[#8e9196]">Live on public gallery</p>
        </div>
      </div>

      {/* Recent Enquiries & Orders Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-white">
              Recent Customer Inquiries & Quotes
            </h3>
            <p className="text-xs text-[#8e9196]">
              Latest submissions received through the website
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs text-[#d9a323] font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
          >
            <span>View All ({enquiries.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#8e9196] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Ref ID</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Service</th>
                <th className="py-3 px-4 font-semibold">Quantity / Specs</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {enquiries.slice(0, 5).map((enq) => {
                const statusMeta = ORDER_STATUSES[enq.status] || {
                  label: enq.status,
                  bg: 'bg-neutral-800',
                  text: 'text-neutral-300',
                  border: 'border-white/10',
                }

                return (
                  <tr key={enq.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#d9a323]">{enq.id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{enq.customerName}</p>
                      <p className="text-[11px] text-[#8e9196]">{enq.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#c6c8cc] font-medium">{enq.serviceName}</td>
                    <td className="py-3.5 px-4 text-[#8e9196]">
                      {enq.quantity} {enq.dimensions ? `(${enq.dimensions})` : ''}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                      >
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/admin/orders"
                        className="px-3 py-1.5 rounded bg-white/5 hover:bg-[#d9a323] hover:text-black text-white text-[11px] font-semibold transition-all inline-block"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Operation Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/portfolio"
          className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#d9a323]/50 transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#d9a323]/10 text-[#d9a323] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Palette className="w-5 h-5" />
          </div>
          <h4 className="font-heading font-bold text-base text-white">Portfolio Management</h4>
          <p className="text-xs text-[#8e9196]">
            Upload new project photos, assign categories, feature items on the homepage.
          </p>
        </Link>

        <Link
          to="/admin/services"
          className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#d9a323]/50 transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h4 className="font-heading font-bold text-base text-white">Services Editor</h4>
          <p className="text-xs text-[#8e9196]">
            Add or edit services, update sub-items, images, and descriptions anytime.
          </p>
        </Link>

        <Link
          to="/admin/reviews"
          className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#d9a323]/50 transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 text-[#d9a323] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Star className="w-5 h-5 fill-[#d9a323]" />
          </div>
          <h4 className="font-heading font-bold text-base text-white">Customer Reviews</h4>
          <p className="text-xs text-[#8e9196]">
            Review, approve, and manage customer testimonials before they appear publicly.
          </p>
        </Link>
      </div>
    </div>
  )
}


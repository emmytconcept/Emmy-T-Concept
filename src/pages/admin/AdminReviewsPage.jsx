import React, { useState } from 'react'
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  Filter,
  Search,
  Award
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export default function AdminReviewsPage() {
  const { testimonials, approveReview, rejectReview, toggleFeatureReview, deleteReview } = useAppStore()
  const [filter, setFilter] = useState('all') // 'all' | 'pending' | 'approved'
  const [search, setSearch] = useState('')

  const filtered = testimonials.filter((t) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'pending'
        ? !t.approved
        : t.approved

    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase()) ||
      (t.company && t.company.toLowerCase().includes(search.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  const pendingCount = testimonials.filter((t) => !t.approved).length
  const approvedCount = testimonials.filter((t) => t.approved).length
  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0) / testimonials.length).toFixed(1)
      : '5.0'

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#d9a323]">
            Customer Feedback & Moderation
          </span>
          <h2 className="font-heading text-2xl font-bold text-white mt-0.5">
            Customer Reviews & Testimonials
          </h2>
          <p className="text-xs text-[#8e9196] mt-0.5">
            Review customer submissions from the website, approve authentic testimonials, and select homepage features
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3.5 h-3.5" /> {pendingCount} Pending Review
            </span>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <p className="text-xs text-[#8e9196] uppercase font-bold tracking-wider">Total Received</p>
          <p className="font-heading text-3xl font-bold text-white">{testimonials.length}</p>
          <p className="text-[11px] text-[#8e9196]">Submitted across all channels</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 space-y-1">
          <p className="text-xs text-amber-400 uppercase font-bold tracking-wider">Awaiting Approval</p>
          <p className="font-heading text-3xl font-bold text-amber-400">{pendingCount}</p>
          <p className="text-[11px] text-[#8e9196]">Not yet visible on public landing page</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <p className="text-xs text-[#d9a323] uppercase font-bold tracking-wider">Average Rating</p>
          <p className="font-heading text-3xl font-bold text-white flex items-center gap-2">
            <span>{avgRating}</span>
            <Star className="w-5 h-5 fill-[#d9a323] text-[#d9a323]" />
          </p>
          <p className="text-[11px] text-[#25D366] font-medium">{approvedCount} live on public website</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8e9196] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client or review content..."
            className="w-full bg-[#111111] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-600 outline-none focus:border-[#d9a323]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#8e9196]" />
          <div className="flex rounded-xl bg-[#111111] border border-white/10 p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                filter === 'all' ? 'bg-[#d9a323] text-black font-bold' : 'text-[#8e9196] hover:text-white'
              }`}
            >
              All ({testimonials.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                filter === 'pending' ? 'bg-amber-500 text-black font-bold' : 'text-[#8e9196] hover:text-white'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                filter === 'approved' ? 'bg-[#25D366] text-black font-bold' : 'text-[#8e9196] hover:text-white'
              }`}
            >
              Live Approved ({approvedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center text-[#8e9196] text-xs">
            No customer reviews found matching your filter.
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className={`glass-panel p-6 rounded-2xl border transition-all space-y-4 ${
                !t.approved
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'border-white/10 hover:border-[#d9a323]/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#d9a323]/20 border border-[#d9a323]/40 flex items-center justify-center font-heading font-bold text-sm text-[#d9a323]">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-white">{t.name}</h4>
                    <p className="text-xs text-[#8e9196]">
                      {t.role || 'Client'}{t.company ? `, ${t.company}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[#d9a323]">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#d9a323]" />
                    ))}
                  </div>

                  {/* Status Badge */}
                  {t.approved ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Live Approved
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Awaiting Moderation
                    </span>
                  )}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-[#c6c8cc] leading-relaxed italic">
                "{t.content}"
              </p>

              {/* Review Date & Action Controls */}
              <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[#8e9196] text-[11px]">Submitted: {t.date || 'Recently'}</span>

                <div className="flex items-center gap-2">
                  {/* Toggle Homepage Feature */}
                  <button
                    onClick={() => toggleFeatureReview(t.id)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1 ${
                      t.featured
                        ? 'bg-[#d9a323] text-black border-[#d9a323]'
                        : 'bg-white/5 text-[#8e9196] border-white/10 hover:text-white'
                    }`}
                    title="Feature on Homepage"
                  >
                    <Star className={`w-3.5 h-3.5 ${t.featured ? 'fill-black' : ''}`} />
                    <span>{t.featured ? 'Featured' : 'Feature'}</span>
                  </button>

                  {/* Approve / Reject Toggle */}
                  {!t.approved ? (
                    <button
                      onClick={() => approveReview(t.id)}
                      className="px-4 py-1.5 rounded-lg bg-[#25D366] hover:brightness-110 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
                    </button>
                  ) : (
                    <button
                      onClick={() => rejectReview(t.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Move to Pending
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete review from "${t.name}"?`)) {
                        deleteReview(t.id)
                      }
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500 text-white transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-[#d9a323]/30 max-w-lg w-full space-y-6 shadow-2xl">
        <p className="font-heading text-7xl font-extrabold text-[#d9a323]">404</p>
        <h1 className="font-heading text-2xl font-bold text-white">Page Not Located</h1>
        <p className="text-xs text-[#8e9196] leading-relaxed">
          The corporate page or resource you requested is not available. Please return to the official homepage or browse our services.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-[#d9a323] text-black text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
          <Link
            to="/services"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-white/20 text-[#c6c8cc] text-xs font-semibold uppercase tracking-wider"
          >
            Explore Services
          </Link>
        </div>
      </div>
    </div>
  )
}


import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@emmytconcept.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { setAdminAuth } = useAppStore()
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    setTimeout(() => {
      // Demo validation or Supabase auth
      if (email.toLowerCase().includes('admin') || password.length >= 6) {
        setAdminAuth({
          isAuthenticated: true,
          email,
          name: 'Emmy-T Director',
          role: 'super_admin',
        })
        navigate('/admin/dashboard')
      } else {
        setError('Invalid administrator credentials. Please check your credentials.')
      }
      setIsLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="glass-panel max-w-md w-full p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block">
            <img
              src="/logo-mark.png"
              alt="EMMY-T Logo"
              className="w-16 h-16 mx-auto object-contain filter drop-shadow-[0_0_15px_rgba(217,163,35,0.4)]"
            />
          </Link>
          <h2 className="font-heading text-2xl font-bold text-white tracking-wide">
            Administrator Gateway
          </h2>
          <p className="text-xs text-[#8e9196]">
            EMMY-T CONCEPT Executive Management Console
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[#c6c8cc] font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#d9a323]" /> Authorized Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@emmytconcept.com"
              className="w-full bg-[#111111] border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-[#d9a323]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[#c6c8cc] font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#d9a323]" /> Security Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#111111] border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-[#d9a323]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-[#d9a323] via-[#f7d779] to-[#b88613] text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-[#d9a323]/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLoading ? 'Authenticating...' : 'Access Administration Suite'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#8e9196] hover:text-[#d9a323] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  )
}


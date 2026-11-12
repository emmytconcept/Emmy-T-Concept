import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { loginWithSupabase } from '../../lib/supabaseAuth'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@emmytconcept.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { adminUser, setAdminAuth } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (adminUser?.isAuthenticated) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [adminUser, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const user = await loginWithSupabase(email, password)
      setAdminAuth(user)
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Supabase Auth error:', err)
      setError(err.message || 'Invalid administrator credentials. Please check your email and password.')
    } finally {
      setIsLoading(false)
    }
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
              autoComplete="username"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[#c6c8cc] font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#d9a323]" /> Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-[#111111] border border-white/10 rounded-xl p-3.5 pr-11 text-sm text-white placeholder-neutral-600 outline-none focus:border-[#d9a323]"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8e9196] hover:text-[#d9a323] transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#d9a323] hover:bg-[#e5b338] disabled:opacity-60 text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with Supabase...</span>
              </>
            ) : (
              <>
                <span>Access Administration Suite</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
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

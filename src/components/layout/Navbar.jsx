import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, Phone } from 'lucide-react'
import { WhatsAppIcon } from '../shared/SocialIcons'
import { useAppStore } from '../../store/useAppStore'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { companyInfo } = useAppStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'SERVICES', path: '/services' },
    { name: 'PORTFOLIO', path: '/portfolio' },
    { name: 'TRACK ORDER', path: '/track' },
    { name: 'REQUEST A QUOTE', path: '/quote' },
    { name: 'CONTACT', path: '/contact' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const cleanWhatsApp = (companyInfo.whatsapp || '').replace(/[^0-9]/g, '')

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080808]/95 backdrop-blur-md border-b border-[#d9a323]/20 shadow-2xl shadow-black/80 py-3'
          : 'bg-[#080808]/80 backdrop-blur-sm border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo & Brand Identity */}
        <Link to="/" className="flex items-center gap-3.5 group py-1">
          <img
            src="/logo-mark.png"
            alt="EMMY-T CONCEPT Icon"
            className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_0_16px_rgba(217,163,35,0.4)] group-hover:scale-105 transition-transform duration-300 shrink-0"
          />
          <div className="flex flex-col justify-center leading-none">
            <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-wider text-white flex items-center gap-1">
              <span>EMMY</span>
              <span className="text-[#d9a323]">-T</span>
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.28em] text-[#c6c8cc] font-medium uppercase mt-1">
              CONCEPT
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative px-3 py-2 text-xs font-semibold tracking-wider transition-all duration-200 rounded-md ${
                isActive(link.path)
                  ? 'text-[#d9a323] bg-[#d9a323]/10 font-bold'
                  : 'text-[#c6c8cc] hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#d9a323] to-transparent" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Official WhatsApp Action Button */}
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=Hello%20EMMY-T%20CONCEPT,%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/60 transition-all duration-200 shadow-sm"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon className="w-5 h-5 fill-[#25D366]" />
          </a>

          {/* Request a Quote CTA */}
          <Link
            to="/quote"
            className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-black bg-[#d9a323] hover:bg-[#e5b338] rounded-lg shadow-md hover:shadow-[#d9a323]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <span>Get A Quote</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/quote"
            className="px-3 py-1.5 text-[11px] font-bold uppercase text-black bg-[#d9a323] rounded shadow"
          >
            Quote
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#c6c8cc] hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0d0d] border-b border-[#d9a323]/20 px-4 pt-4 pb-6 space-y-3 animate-fade-in">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2.5 rounded-md text-sm font-semibold tracking-wider transition-colors ${
                  isActive(link.path)
                    ? 'bg-[#d9a323]/15 text-[#d9a323] font-bold'
                    : 'text-[#c6c8cc] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#8e9196] px-1">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#d9a323]" /> {companyInfo.phone}
            </span>
            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] font-semibold flex items-center gap-1.5"
            >
              <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

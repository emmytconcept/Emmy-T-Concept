import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react'
import { InstagramIcon, FacebookIcon, TwitterIcon, WhatsAppIcon, LinkedInIcon } from '../shared/SocialIcons'
import { useAppStore } from '../../store/useAppStore'

export default function Footer() {
  const { companyInfo, services } = useAppStore()

  return (
    <footer className="bg-[#050505] border-t border-[#d9a323]/20 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background ambient gold flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#d9a323]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="space-y-5">
            <Link to="/" className="inline-block group">
              <img
                src="/logo-transparent.png"
                alt="EMMY-T CONCEPT Official Logo"
                className="h-16 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(217,163,35,0.25)]"
              />
            </Link>
            <p className="text-sm text-[#8e9196] leading-relaxed">
              {companyInfo.shortDesc}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={companyInfo.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c6c8cc] hover:text-[#d9a323] hover:border-[#d9a323]/50 transition-all duration-200"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={companyInfo.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c6c8cc] hover:text-[#d9a323] hover:border-[#d9a323]/50 transition-all duration-200"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={companyInfo.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c6c8cc] hover:text-[#d9a323] hover:border-[#d9a323]/50 transition-all duration-200"
                aria-label="Twitter / X"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              {companyInfo.socials?.linkedin && (
                <a
                  href={companyInfo.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c6c8cc] hover:text-[#d9a323] hover:border-[#d9a323]/50 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              )}
              <a
                href={`https://wa.me/${(companyInfo.whatsapp || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-all duration-200"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
              </a>
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-base text-white tracking-wider flex items-center gap-2">
              <span>Our Services</span>
              <span className="w-8 h-[2px] bg-[#d9a323]" />
            </h3>
            <ul className="space-y-2.5 text-sm text-[#8e9196]">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="hover:text-[#d9a323] transition-colors flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 text-[#d9a323]/60 group-hover:translate-x-1 transition-transform" />
                    <span>{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-base text-white tracking-wider flex items-center gap-2">
              <span>Quick Links</span>
              <span className="w-8 h-[2px] bg-[#d9a323]" />
            </h3>
            <ul className="space-y-2.5 text-sm text-[#8e9196]">
              <li>
                <Link to="/" className="hover:text-[#d9a323] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#d9a323] transition-colors">
                  About Our Company
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#d9a323] transition-colors">
                  All Printing & Design Solutions
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-[#d9a323] transition-colors">
                  Completed Projects Portfolio
                </Link>
              </li>
              <li>
                <Link to="/quote" className="hover:text-[#d9a323] transition-colors">
                  Request a Formal Quotation
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-[#d9a323] transition-colors">
                  Track Order Status
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#d9a323] transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Operations */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-base text-white tracking-wider flex items-center gap-2">
              <span>Get In Touch</span>
              <span className="w-8 h-[2px] bg-[#d9a323]" />
            </h3>
            <ul className="space-y-3 text-sm text-[#8e9196]">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#d9a323] shrink-0 mt-1" />
                <span>{companyInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#d9a323] shrink-0" />
                <a href={`tel:${companyInfo.phone}`} className="hover:text-white transition-colors">
                  {companyInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#d9a323] shrink-0" />
                <a href={`mailto:${companyInfo.email}`} className="hover:text-white transition-colors">
                  {companyInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#d9a323] shrink-0" />
                <span>{companyInfo.openingHours}</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/quote"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-[#d9a323] hover:bg-[#e5b338] text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md"
              >
                Instant Project Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8e9196] gap-4">
          <p>© {new Date().getFullYear()} EMMY-T CONCEPT. All rights reserved.</p>
          <p className="text-[11px] text-[#8e9196]">
            Excellence in Digital Printing, Corporate Branding & Signage.
          </p>
        </div>
      </div>
    </footer>
  )
}

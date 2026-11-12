import React from 'react'
import { WhatsAppIcon } from './SocialIcons'
import { useAppStore } from '../../store/useAppStore'

export default function WhatsAppButton() {
  const { companyInfo } = useAppStore()
  const cleanNumber = (companyInfo.whatsapp || '').replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=Hello%20EMMY-T%20CONCEPT,%20I%20would%20like%20to%20discuss%20a%20printing%20or%20design%20project!`

  return (
    <aside aria-label="Quick contact" className="fixed bottom-6 right-6 z-50 group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with EMMY-T CONCEPT on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_22px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.65)] hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {/* Animated pulse rings */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping -z-10" />
        <span className="absolute -inset-2 rounded-full bg-[#25D366]/15 -z-20" />

        <WhatsAppIcon className="w-8 h-8 fill-white" />

        {/* Hover Tooltip */}
        <span className="absolute right-16 px-3 py-1.5 bg-[#080808] border border-[#d9a323]/30 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  )
}

import React, { useState, useEffect } from 'react'
import {
  Save,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building,
  CheckCircle2,
  Shield,
  ExternalLink,
  Share2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { InstagramIcon, FacebookIcon, TwitterIcon, WhatsAppIcon, LinkedInIcon } from '../../components/shared/SocialIcons'

export default function AdminSettingsPage() {
  const { companyInfo, updateCompanyInfo, adminUser, setAdminAuth } = useAppStore()

  // Form states
  const [formData, setFormData] = useState({
    name: companyInfo.name || 'EMMY-T CONCEPT',
    tagline: companyInfo.tagline || '',
    shortDesc: companyInfo.shortDesc || '',
    phone: companyInfo.phone || '',
    whatsapp: companyInfo.whatsapp || '',
    email: companyInfo.email || '',
    address: companyInfo.address || '',
    openingHours: companyInfo.openingHours || '',
    socials: {
      instagram: companyInfo.socials?.instagram || '',
      facebook: companyInfo.socials?.facebook || '',
      twitter: companyInfo.socials?.twitter || '',
      linkedin: companyInfo.socials?.linkedin || '',
    },
  })

  useEffect(() => {
    setFormData({
      name: companyInfo.name || 'EMMY-T CONCEPT',
      tagline: companyInfo.tagline || '',
      shortDesc: companyInfo.shortDesc || '',
      phone: companyInfo.phone || '',
      whatsapp: companyInfo.whatsapp || '',
      email: companyInfo.email || '',
      address: companyInfo.address || '',
      openingHours: companyInfo.openingHours || '',
      socials: {
        instagram: companyInfo.socials?.instagram || '',
        facebook: companyInfo.socials?.facebook || '',
        twitter: companyInfo.socials?.twitter || '',
        linkedin: companyInfo.socials?.linkedin || '',
      },
    })
  }, [companyInfo])

  // Admin account state
  const [adminName, setAdminName] = useState(adminUser?.name || 'Emmy-T Director')
  const [adminEmail, setAdminEmail] = useState(adminUser?.email || 'admin@emmytconcept.com')
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSaveContact = (e) => {
    e.preventDefault()
    updateCompanyInfo(formData)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3500)
  }

  const handleSaveAdminProfile = (e) => {
    e.preventDefault()
    setAdminAuth({
      ...adminUser,
      name: adminName,
      email: adminEmail,
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3500)
    setNewPassword('')
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#d9a323]">
            System & Contact Settings
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Admin Settings & Contact Details
          </h2>
          <p className="text-xs text-[#8e9196] mt-1">
            Configure phone numbers, WhatsApp lines, email, office address, and social links displayed across the public website
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved & Applied Site-wide!</span>
          </div>
        )}
      </div>

      {/* Grid Layout: Main Form + Live Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Contact & Identity (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Official Contact Information */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d9a323]/15 text-[#d9a323] flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Corporate Contact Channels
                </h3>
                <p className="text-xs text-[#8e9196]">
                  These details dynamically power all click-to-call, WhatsApp buttons, and the Contact page
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-5 text-xs">
              {/* Phone & WhatsApp Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[#c6c8cc] font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#d9a323]" />
                    <span>Official Call Number</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 814 624 3788"
                    className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-xl p-3 text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                  />
                  <p className="text-[10px] text-[#8e9196]">Appears in header, footer, and contact desk.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#c6c8cc] font-medium flex items-center gap-1.5">
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                    <span>WhatsApp Number (International format)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+2348146243788"
                    className="w-full bg-[#111111] border border-white/10 focus:border-[#25D366] rounded-xl p-3 text-sm text-white placeholder-neutral-600 outline-none transition-colors font-mono"
                  />
                  <p className="text-[10px] text-[#8e9196]">Used for all WhatsApp chat buttons and quote follow-ups.</p>
                </div>
              </div>

              {/* Email & Address Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[#c6c8cc] font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#d9a323]" />
                    <span>Business Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="emmytconcept@gmail.com"
                    className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-xl p-3 text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#c6c8cc] font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#d9a323]" />
                    <span>Operating Business Hours</span>
                  </label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    placeholder="Mon - Sat: 8:00 AM - 6:00 PM"
                    className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-xl p-3 text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Office Address */}
              <div className="space-y-1.5">
                <label className="text-[#c6c8cc] font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#d9a323]" />
                  <span>Physical Studio / Office Address</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 14 Commercial Avenue, Ikeja, Lagos, Nigeria"
                  className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-xl p-3 text-sm text-white placeholder-neutral-600 outline-none transition-colors"
                />
              </div>

              {/* Social Channels Sub-section */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-[#d9a323]" /> Social Media Profiles
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#8e9196] flex items-center gap-1">
                      <InstagramIcon className="w-3 h-3 text-[#d9a323]" /> Instagram URL
                    </label>
                    <input
                      type="url"
                      value={formData.socials.instagram}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socials: { ...formData.socials, instagram: e.target.value },
                        })
                      }
                      placeholder="https://instagram.com/..."
                      className="w-full bg-[#111111] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#8e9196] flex items-center gap-1">
                      <FacebookIcon className="w-3 h-3 text-[#d9a323]" /> Facebook URL
                    </label>
                    <input
                      type="url"
                      value={formData.socials.facebook}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socials: { ...formData.socials, facebook: e.target.value },
                        })
                      }
                      placeholder="https://facebook.com/..."
                      className="w-full bg-[#111111] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#8e9196] flex items-center gap-1">
                      <TwitterIcon className="w-3 h-3 text-[#d9a323]" /> Twitter / X URL
                    </label>
                    <input
                      type="url"
                      value={formData.socials.twitter}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socials: { ...formData.socials, twitter: e.target.value },
                        })
                      }
                      placeholder="https://x.com/..."
                      className="w-full bg-[#111111] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#8e9196] flex items-center gap-1">
                      <LinkedInIcon className="w-3 h-3 text-[#d9a323]" /> LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formData.socials.linkedin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socials: { ...formData.socials, linkedin: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/company/..."
                      className="w-full bg-[#111111] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#d9a323] hover:bg-[#e5b338] text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Contact Details
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Administrator Profile & Password */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 text-[#c6c8cc] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Administrator Account Credentials
                </h3>
                <p className="text-xs text-[#8e9196]">
                  Update your management login name, authorized email, and access password
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAdminProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[#c6c8cc]">Administrator Display Name</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-sm text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#c6c8cc]">Admin Login Email</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#c6c8cc] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#d9a323]" />
                  <span>Update Admin Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (optional)"
                    className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 pr-11 text-sm text-white placeholder-neutral-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e9196] hover:text-[#d9a323] transition-colors"
                    tabIndex={-1}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-white/10 hover:bg-[#d9a323] hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Update Admin Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Preview Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-[#d9a323]/30 space-y-5 sticky top-24 shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#d9a323]">
                Live Public Website Preview
              </span>
            </div>

            <p className="text-xs text-[#8e9196] leading-relaxed">
              Any changes made to your contact lines are instantly visible to visitors across all pages:
            </p>

            {/* Simulated Live Contact Widget */}
            <div className="p-4 rounded-2xl bg-black/80 border border-white/10 space-y-3.5 text-xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                <img src="/logo-mark.png" alt="Logo" className="w-7 h-7 object-contain" />
                <div>
                  <p className="font-heading font-bold text-white text-xs">{formData.name}</p>
                  <p className="text-[9px] text-[#d9a323] uppercase tracking-wider">Official Contact</p>
                </div>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-2 text-[#c6c8cc]">
                  <Phone className="w-3.5 h-3.5 text-[#d9a323] shrink-0" />
                  <span className="font-medium">{formData.phone || 'No phone set'}</span>
                </div>

                <div className="flex items-center gap-2 text-[#c6c8cc]">
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366] shrink-0" />
                  <span className="font-mono text-[#25D366]">{formData.whatsapp || 'No WhatsApp set'}</span>
                </div>

                <div className="flex items-center gap-2 text-[#c6c8cc] truncate">
                  <Mail className="w-3.5 h-3.5 text-[#d9a323] shrink-0" />
                  <span className="truncate">{formData.email || 'No email set'}</span>
                </div>

                <div className="flex items-center gap-2 text-[#c6c8cc]">
                  <MapPin className="w-3.5 h-3.5 text-[#d9a323] shrink-0" />
                  <span>{formData.address || 'Lagos, Nigeria'}</span>
                </div>

                <div className="flex items-center gap-2 text-[#8e9196]">
                  <Clock className="w-3.5 h-3.5 text-[#8e9196] shrink-0" />
                  <span>{formData.openingHours || 'Business Hours'}</span>
                </div>
              </div>

              {/* Direct Test Link */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${(formData.whatsapp || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-[#25D366] text-white font-bold text-[11px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 hover:brightness-110"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-white" /> Test WhatsApp Link
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Changes on Live Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#d9a323]" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

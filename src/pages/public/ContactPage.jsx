import React, { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react'
import { InstagramIcon, FacebookIcon, TwitterIcon, WhatsAppIcon, LinkedInIcon } from '../../components/shared/SocialIcons'
import { useAppStore } from '../../store/useAppStore'

export default function ContactPage() {
  const { companyInfo, addEnquiry } = useAppStore()
  const [formSent, setFormSent] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    addEnquiry({
      customerName: formData.name,
      phone: formData.phone,
      email: formData.email,
      serviceId: 'general-inquiry',
      serviceName: 'General Inquiry / Message',
      description: formData.message,
      quantity: '',
      dimensions: '',
      deliveryDate: '',
      uploadedFiles: [],
    })
    setFormSent(true)
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="py-12 relative">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center pb-12">
        <p className="text-xs font-mono tracking-[0.25em] text-[#d9a323] uppercase mb-3">
          // DIRECT LIAISON
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact EMMY-T CONCEPT
        </h1>
        <div className="w-20 h-1 bg-[#d9a323] mx-auto rounded-full my-6" />
        <p className="text-[#9ca3af] text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          We welcome project inquiries, corporate retainers, brand consultations, and printing orders.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-white">
                  Corporate Office & Support
                </h2>
                <p className="text-xs text-[#8e9196] mt-1 leading-relaxed">
                  Reach out directly through any of our official channels or visit our production studio.
                </p>
              </div>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d9a323]/15 text-[#d9a323] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Office Location</p>
                    <p className="text-[#c6c8cc] mt-0.5">{companyInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d9a323]/15 text-[#d9a323] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Phone Calls</p>
                    <a href={`tel:${companyInfo.phone}`} className="text-[#c6c8cc] hover:text-[#d9a323] transition-colors mt-0.5 block">
                      {companyInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d9a323]/15 text-[#d9a323] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Official Email</p>
                    <a href={`mailto:${companyInfo.email}`} className="text-[#c6c8cc] hover:text-[#d9a323] transition-colors mt-0.5 block">
                      {companyInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d9a323]/15 text-[#d9a323] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Business Hours</p>
                    <p className="text-[#c6c8cc] mt-0.5">{companyInfo.openingHours}</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA Card */}
              <div className="p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#25D366]">
                  <WhatsAppIcon className="w-5 h-5 fill-[#25D366]" />
                  <span>Instant WhatsApp Desk</span>
                </div>
                <p className="text-xs text-[#c6c8cc] leading-relaxed">
                  Need an urgent quotation or want to send your artwork directly via WhatsApp?
                </p>
                <a
                  href={`https://wa.me/${(companyInfo.whatsapp || '').replace(/[^0-9]/g, '')}?text=Hello%20EMMY-T%20CONCEPT,%20I%20have%20an%20inquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:brightness-110 transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Message On WhatsApp</span>
                </a>
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <p className="text-xs text-[#8e9196] font-medium uppercase tracking-wider">
                  Follow Our Social Updates
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={companyInfo.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/5 text-[#c6c8cc] hover:text-[#d9a323] hover:bg-white/10 transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={companyInfo.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/5 text-[#c6c8cc] hover:text-[#d9a323] hover:bg-white/10 transition-colors"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={companyInfo.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/5 text-[#c6c8cc] hover:text-[#d9a323] hover:bg-white/10 transition-colors"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                  {companyInfo.socials?.linkedin && (
                    <a
                      href={companyInfo.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-white/5 text-[#c6c8cc] hover:text-[#d9a323] hover:bg-white/10 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
              <div>
                <h3 className="font-heading text-2xl font-bold text-white">
                  Send A Direct Message
                </h3>
                <p className="text-xs text-[#8e9196] mt-1">
                  Fill in your details below and our team will respond within 2-4 business hours.
                </p>
              </div>

              {formSent ? (
                <div className="p-8 rounded-2xl bg-[#d9a323]/10 border border-[#d9a323]/40 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#d9a323] mx-auto" />
                  <h4 className="font-heading text-xl font-bold text-white">Message Dispatched!</h4>
                  <p className="text-sm text-[#8e9196] max-w-md mx-auto">
                    Your inquiry has been successfully transmitted to our team. We look forward to connecting with you.
                  </p>
                  <button
                    onClick={() => setFormSent(false)}
                    className="px-6 py-2 rounded-lg bg-[#d9a323] text-black text-xs font-bold uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#c6c8cc]">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-lg p-3 text-sm text-white placeholder-neutral-600 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#c6c8cc]">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+234 800 000 0000"
                        className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-lg p-3 text-sm text-white placeholder-neutral-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#c6c8cc]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-lg p-3 text-sm text-white placeholder-neutral-600 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#c6c8cc]">Your Message or Inquiry</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you'd like to ask or discuss..."
                      className="w-full bg-[#111111] border border-white/10 focus:border-[#d9a323] rounded-lg p-3 text-sm text-white placeholder-neutral-600 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#d9a323] hover:bg-[#e5b338] text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

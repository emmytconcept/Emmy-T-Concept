import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Target, Eye, CheckCircle2, Award, Users, ArrowRight, ShieldCheck, Printer, Zap } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export default function AboutPage() {
  const { companyInfo } = useAppStore()

  const values = [
    {
      title: "Tactile Craftsmanship",
      desc: "Every cut, foil impression, and fold is treated with surgical care. We reject flimsy, mass-printed templates in favor of bespoke craftsmanship.",
    },
    {
      title: "Commercial-Grade Reliability",
      desc: "Deadlines are sacred. When an event or corporate launch is scheduled, our production infrastructure runs on strict timelines to ensure on-time delivery.",
    },
    {
      title: "Pantone & True-Tone Fidelity",
      desc: "Our calibrated industrial presses ensure what your creative team approves digitally matches the physical paper, vinyl, or fabric product.",
    },
    {
      title: "Client-Centric Collaboration",
      desc: "We work directly alongside corporate directors, marketing teams, and entrepreneurs, turning vague ideas into market-dominating brand assets.",
    },
  ]

  return (
    <div className="py-12 relative overflow-hidden">
      {/* Subtle Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-4"
        >
          <p className="text-xs font-mono tracking-[0.25em] text-[#d9a323] uppercase">
            // ABOUT EMMY-T CONCEPT
          </p>

          <h1 className="text-4xl sm:text-6xl font-sans font-extrabold text-white tracking-tight leading-[1.1]">
            Design With Intent. Print Without Compromise.
          </h1>

          <div className="w-16 h-1 bg-[#d9a323] mx-auto rounded-full" />

          <p className="max-w-2xl mx-auto text-[#9ca3af] text-base sm:text-lg leading-relaxed pt-2">
            Founded on the conviction that a company's physical presentation defines its commercial stature, <strong className="text-white">EMMY-T CONCEPT</strong> operates at the intersection of graphic design, large-format engineering, and luxury tactile printing.
          </p>
        </motion.div>

        {/* Hero Visual Studio Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
        >
          {/* Main Studio Image */}
          <div className="md:col-span-7 rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 relative aspect-[16/10] md:aspect-auto">
            <img
              src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80"
              alt="High Definition Color Production"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#d9a323] px-2 py-0.5 rounded bg-black/80 border border-[#d9a323]/30">
                Lagos Production Facility
              </span>
              <p className="text-sm font-bold text-white mt-1.5">
                Industrial Presses, UV Roll-To-Roll & Precision Heat Transfer
              </p>
            </div>
          </div>

          {/* Quick Technical Architecture */}
          <div className="md:col-span-5 flex flex-col justify-between gap-4">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#d9a323] tracking-wider">
                01 · Studio Calibration
              </span>
              <h3 className="text-base font-bold text-white">Full-Spectrum CMYK & Spot Inks</h3>
              <p className="text-xs text-[#8e9196] leading-relaxed">
                Color calibration protocols eliminate unexpected color shifts between screen proofs and physical press sheets.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#d9a323] tracking-wider">
                02 · Specialty Finishes
              </span>
              <h3 className="text-base font-bold text-white">Metalli-Foil & Deep Embossing</h3>
              <p className="text-xs text-[#8e9196] leading-relaxed">
                Gold and silver thermal foil stamping, spot UV gloss, matte soft-touch lamination, and heavy card stocks.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#d9a323] tracking-wider">
                03 · Production Speed
              </span>
              <h3 className="text-base font-bold text-white">24–48h Priority Turnaround</h3>
              <p className="text-xs text-[#8e9196] leading-relaxed">
                High-capacity print arrays ready to absorb urgent corporate event and marketing timelines without quality drops.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Story & Background Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs font-mono tracking-[0.25em] text-[#d9a323] uppercase">
              // COMPANY ETHOS
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Who We Are & What We Stand For
            </h2>
            <p className="text-sm text-[#8e9196] leading-relaxed">
              Founded on the belief that a company's physical and digital presentation dictates its market authority, EMMY-T CONCEPT has grown into a versatile, high-capacity creative and print production hub.
            </p>
            <p className="text-sm text-[#8e9196] leading-relaxed">
              We reject cheap, flimsy print jobs and generic templates. Instead, we combine advanced digital design software with heavy-duty commercial flex printing machines, heat presses, and foil-embossing finishers to generate products that look and feel prestigious.
            </p>
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl glass-panel border border-[#d9a323]/20">
                  <p className="font-heading text-2xl font-bold text-[#d9a323]">100%</p>
                  <p className="text-xs text-[#8e9196] font-medium mt-1">Authentic Client Color Fidelity</p>
                </div>
                <div className="p-4 rounded-xl glass-panel border border-white/10">
                  <p className="font-heading text-2xl font-bold text-white">Nationwide</p>
                  <p className="text-xs text-[#8e9196] font-medium mt-1">Logistics & Delivery Support</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-md w-full space-y-6">
              <div className="flex items-center gap-4 border-b border-white/10 pb-5">
                <img
                  src="/logo-mark.png"
                  alt="EMMY-T Monogram"
                  className="w-14 h-14 object-contain"
                />
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">EMMY-T CONCEPT</h3>
                  <p className="text-xs text-[#d9a323] font-mono uppercase tracking-wider mt-0.5">
                    Creative Design & Production HQ
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between">
                  <span className="text-[#8e9196]">Color Fidelity Standard</span>
                  <span className="font-semibold text-[#d9a323]">Calibrated CMYK / RGB</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between">
                  <span className="text-[#8e9196]">Production Infrastructure</span>
                  <span className="font-semibold text-white">Commercial Grade Presses</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between">
                  <span className="text-[#8e9196]">Turnaround Commitment</span>
                  <span className="font-semibold text-[#25D366]">Express Available</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 flex items-center justify-between">
                  <span className="text-[#8e9196]">Primary Substrates</span>
                  <span className="font-semibold text-white">Paper, Vinyl, Fabric & Rigid</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="glass-panel rounded-2xl p-8 border-t-2 border-t-[#d9a323] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#d9a323]/15 text-[#d9a323] flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">Our Vision</h3>
            <p className="text-sm text-[#8e9196] leading-relaxed">
              To be the premier corporate design and print production destination in Nigeria and West Africa, recognized globally for uncompromising finish quality, creative brilliance, and setting the benchmark for commercial advertising excellence.
            </p>
          </div>

          {/* Mission */}
          <div className="glass-panel rounded-2xl p-8 border-t-2 border-t-white/20 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">Our Mission</h3>
            <p className="text-sm text-[#8e9196] leading-relaxed">
              To empower commercial enterprises, institutions, and visionary brands through bespoke visual identity systems, durable large-format prints, and luxury packaging solutions delivered with speed, precision, and world-class customer service.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="text-xs font-mono tracking-[0.25em] text-[#d9a323] uppercase">
            // GUIDING PRINCIPLES
          </p>
          <h2 className="font-heading text-3xl font-bold text-white">
            Our Core Values
          </h2>
          <div className="w-16 h-1 bg-[#d9a323] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="glass-panel rounded-2xl p-6 space-y-3 border border-white/5 hover:border-[#d9a323]/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#d9a323]/10 text-[#d9a323] flex items-center justify-center font-mono font-bold text-xs">
                0{i + 1}
              </div>
              <h4 className="font-heading text-base font-bold text-white">{v.title}</h4>
              <p className="text-xs text-[#8e9196] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 text-center mt-12">
        <div className="glass-panel rounded-3xl p-10 border border-white/10 space-y-5">
          <p className="text-xs font-mono tracking-[0.25em] text-[#d9a323] uppercase">
            // NEXT STEP
          </p>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Let’s Build Something Exceptional Together
          </h3>
          <p className="text-sm text-[#8e9196] max-w-xl mx-auto leading-relaxed">
            Have a project, conference, corporate rebrand, or event in mind? Contact our team for professional guidance and formal pricing.
          </p>
          <div className="pt-2">
            <Link
              to="/quote"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#d9a323] hover:bg-[#e5b338] text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-[#d9a323]/25 transition-all"
            >
              <span>Get Started With A Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

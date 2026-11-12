import React from 'react'
import { Link } from 'react-router-dom'
import {
  Palette,
  Printer,
  Briefcase,
  Shirt,
  Package,
  Megaphone,
  ArrowRight,
  CheckCircle2,
  Layers
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const iconMap = {
  Palette,
  Printer,
  Briefcase,
  Shirt,
  Package,
  Megaphone,
}

export default function ServicesPage() {
  const { services } = useAppStore()

  return (
    <div className="py-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-16">
        <p className="text-xs font-mono tracking-[0.25em] text-[#d9a323] uppercase mb-3">
          // PRODUCTION DIRECTORY
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Executive Services & Production Solutions
        </h1>
        <div className="w-20 h-1 bg-[#d9a323] mx-auto rounded-full my-6" />
        <p className="max-w-3xl mx-auto text-[#9ca3af] text-base sm:text-lg leading-relaxed">
          Explore our complete portfolio of large-format printing, corporate stationery, custom retail packaging, and bespoke apparel branding.
        </p>
      </section>

      {/* Services List Detailed Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {services.map((service, index) => {
          const IconComponent = iconMap[service.icon] || Layers
          const isEven = index % 2 === 1

          return (
            <div
              key={service.id}
              className={`glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-[#d9a323]/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image side */}
              <div
                className={`lg:col-span-5 h-72 sm:h-96 relative overflow-hidden bg-neutral-900 ${
                  isEven ? 'lg:order-last' : ''
                }`}
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent lg:hidden" />
                
                <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#080808]/90 text-[11px] font-bold text-[#d9a323] border border-white/10 backdrop-blur-md uppercase tracking-wider">
                  0{index + 1} · {service.category}
                </span>
              </div>

              {/* Text info side */}
              <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#d9a323]/15 text-[#d9a323] flex items-center justify-center shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                      {service.name}
                    </h2>
                    <p className="text-xs text-[#d9a323] uppercase tracking-wider font-semibold">
                      EMMY-T Concept High-Precision Division
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[#c6c8cc] leading-relaxed">
                  {service.description || service.shortDesc}
                </p>

                {/* Sub items / deliverables checklist */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-white">
                    Key Offerings & Deliverables:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.subItems?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#8e9196]">
                        <CheckCircle2 className="w-4 h-4 text-[#d9a323] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-white/5">
                  <Link
                    to={`/quote?service=${service.slug}`}
                    className="px-6 py-3 bg-gradient-to-r from-[#d9a323] to-[#b88613] text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:scale-105 transition-all"
                  >
                    Request Quote For This Service
                  </Link>

                  <Link
                    to={`/services/${service.slug}`}
                    className="px-6 py-3 rounded-lg border border-white/20 text-[#c6c8cc] hover:text-white hover:border-[#d9a323] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <span>Detailed Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}


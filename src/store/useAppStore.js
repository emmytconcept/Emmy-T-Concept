import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_SERVICES, INITIAL_PORTFOLIO, COMPANY_INFO, TESTIMONIALS } from '../lib/constants'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Brand & Content CMS
      companyInfo: COMPANY_INFO,
      updateCompanyInfo: (updates) =>
        set((state) => ({
          companyInfo: { ...state.companyInfo, ...updates },
        })),

      announcement: {
        active: true,
        text: "⚡ Elevate your brand with 20% off all Large-Format Banner & Roll-up Printing this month!",
        link: "/quote",
      },
      updateAnnouncement: (announcement) => set({ announcement }),

      // Services Management
      services: INITIAL_SERVICES,
      addService: (newService) =>
        set((state) => ({
          services: [
            ...state.services,
            { ...newService, id: `srv-${Date.now()}`, sortOrder: state.services.length + 1 },
          ],
        })),
      updateService: (id, updates) =>
        set((state) => ({
          services: state.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      // Portfolio Management
      portfolio: INITIAL_PORTFOLIO,
      addPortfolioProject: (project) =>
        set((state) => ({
          portfolio: [
            { ...project, id: `proj-${Date.now()}`, date: new Date().getFullYear().toString() },
            ...state.portfolio,
          ],
        })),
      updatePortfolioProject: (id, updates) =>
        set((state) => ({
          portfolio: state.portfolio.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePortfolioProject: (id) =>
        set((state) => ({
          portfolio: state.portfolio.filter((p) => p.id !== id),
        })),

      // Orders & Enquiries Management
      enquiries: [
        {
          id: "enq-101",
          customerName: "Chief Adewale Johnson",
          phone: "+234 803 111 2233",
          email: "adewale.j@horizoncorp.ng",
          serviceId: "banner-printing",
          serviceName: "Digital & Large-Format Printing",
          description: "Need 4 units of 8ft x 4ft roll-up banners and 1 large outdoor stage backdrop for an upcoming corporate summit.",
          quantity: "5 items",
          dimensions: "8x4ft & 20x10ft",
          deliveryDate: "2024-11-20",
          status: "in_production",
          quotedPrice: 185000,
          agreedPrice: 180000,
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          notes: "Approved mockups sent via WhatsApp. Client confirmed 50% deposit.",
        },
        {
          id: "enq-102",
          customerName: "Blessing Okafor",
          phone: "+234 812 445 6677",
          email: "blessing@blisscosmetics.com",
          serviceId: "packaging-branding",
          serviceName: "Product & Packaging Branding",
          description: "1,000 units of custom matte black paper shopping bags with embossed gold foil logo for luxury cosmetics.",
          quantity: "1,000 bags",
          dimensions: "Medium (A4 size)",
          deliveryDate: "2024-11-28",
          status: "quotation_sent",
          quotedPrice: 320000,
          agreedPrice: null,
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          notes: "Sample paper board shown. Awaiting client confirmation.",
        },
        {
          id: "enq-103",
          customerName: "Engr. Femi Alabi",
          phone: "+234 905 889 9001",
          email: "femi@alabiconstruct.com",
          serviceId: "business-printing",
          serviceName: "Business & Corporate Printing",
          description: "5 packs of luxury executive business cards (Double-sided, 600gsm cotton card with gold gilded edges).",
          quantity: "500 cards",
          dimensions: "Standard 3.5 x 2.0 in",
          deliveryDate: "2024-11-18",
          status: "new_enquiry",
          quotedPrice: 65000,
          agreedPrice: null,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          notes: "",
        }
      ],
      addEnquiry: (enquiry) => {
        const newEnquiry = {
          ...enquiry,
          id: `enq-${Date.now().toString().slice(-4)}`,
          status: "new_enquiry",
          quotedPrice: null,
          agreedPrice: null,
          createdAt: new Date().toISOString(),
          notes: "",
        }
        set((state) => ({
          enquiries: [newEnquiry, ...state.enquiries],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: "New Project Enquiry",
              message: `${enquiry.customerName} requested quote for ${enquiry.serviceName || 'a service'}`,
              timestamp: new Date().toISOString(),
              read: false,
              link: "/admin/orders",
            },
            ...state.notifications,
          ],
        }))
        return newEnquiry
      },
      updateEnquiryStatus: (id, status, notes = null) =>
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === id ? { ...e, status, ...(notes !== null ? { notes } : {}) } : e
          ),
        })),
      updateEnquiryPricing: (id, quotedPrice, agreedPrice) =>
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === id ? { ...e, quotedPrice, agreedPrice } : e
          ),
        })),

      // Quotations
      quotations: [
        {
          id: "QT-2024-001",
          enquiryId: "enq-101",
          customerName: "Chief Adewale Johnson",
          customerPhone: "+234 803 111 2233",
          customerEmail: "adewale.j@horizoncorp.ng",
          date: "2024-11-08",
          validUntil: "2024-11-22",
          items: [
            { description: "Roll-up Banners (Heavy Base aluminum cassette, 8x4ft)", qty: 4, unitPrice: 25000, total: 100000 },
            { description: "Outdoor Stage Backdrop Flex Banner (20x10ft) with eyelets", qty: 1, unitPrice: 75000, total: 75000 },
            { description: "Delivery & Setup at Summit Venue", qty: 1, unitPrice: 10000, total: 10000 },
          ],
          subtotal: 185000,
          discount: 5000,
          total: 180000,
          status: "accepted",
        }
      ],
      addQuotation: (quote) =>
        set((state) => ({
          quotations: [quote, ...state.quotations],
        })),
      createQuotationFromEnquiry: (enquiryId, quoteData) => {
        const newQuote = {
          ...quoteData,
          id: quoteData.id || `QT-${new Date().getFullYear()}-${(get().quotations.length + 1).toString().padStart(3, '0')}`,
          enquiryId,
          date: quoteData.date || new Date().toISOString().split('T')[0],
          validUntil: quoteData.validUntil || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          status: 'sent',
        }
        set((state) => ({
          quotations: [newQuote, ...state.quotations],
          enquiries: state.enquiries.map((e) =>
            e.id === enquiryId
              ? {
                  ...e,
                  status: 'quotation_sent',
                  quotedPrice: newQuote.total,
                  quoteId: newQuote.id,
                  notes: e.notes
                    ? `${e.notes}\n• Formal Quote ${newQuote.id} issued (₦${Number(newQuote.total).toLocaleString()})`
                    : `Formal Quote ${newQuote.id} issued (₦${Number(newQuote.total).toLocaleString()})`,
                }
              : e
          ),
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: "Quotation Generated",
              message: `Quotation ${newQuote.id} issued for ${newQuote.customerName} (₦${Number(newQuote.total).toLocaleString()})`,
              timestamp: new Date().toISOString(),
              read: false,
              link: "/admin/quotations",
            },
            ...state.notifications,
          ],
        }))
        return newQuote
      },

      // Testimonials & Reviews
      testimonials: TESTIMONIALS,
      submitCustomerReview: (review) => {
        const newReview = {
          ...review,
          id: `rev-${Date.now()}`,
          approved: false, // Pending admin review!
          featured: false,
          date: new Date().toISOString().split('T')[0],
        }
        set((state) => ({
          testimonials: [newReview, ...state.testimonials],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: "New Review Awaiting Approval",
              message: `${review.name} submitted a ${review.rating}-star review for approval`,
              timestamp: new Date().toISOString(),
              read: false,
              link: "/admin/reviews",
            },
            ...state.notifications,
          ],
        }))
        return newReview
      },
      approveReview: (id) =>
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, approved: true } : t
          ),
        })),
      rejectReview: (id) =>
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, approved: false } : t
          ),
        })),
      toggleFeatureReview: (id) =>
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, featured: !t.featured } : t
          ),
        })),
      deleteReview: (id) =>
        set((state) => ({
          testimonials: state.testimonials.filter((t) => t.id !== id),
        })),

      // In-App Notifications
      notifications: [
        {
          id: "notif-1",
          title: "New Enquiry Received",
          message: "Engr. Femi Alabi requested quote for Luxury Business Cards",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          read: false,
          link: "/admin/orders",
        },
        {
          id: "notif-2",
          title: "Quotation Accepted",
          message: "Chief Adewale Johnson accepted Quotation QT-2024-001 (₦180,000)",
          timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
          read: true,
          link: "/admin/orders",
        }
      ],
      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      // Admin Auth State
      adminUser: {
        isAuthenticated: true, // Default enabled for instant testing, can be toggled
        email: "admin@emmytconcept.com",
        name: "Emmy-T Director",
        role: "super_admin",
      },
      setAdminAuth: (user) => set({ adminUser: user }),
      logoutAdmin: () =>
        set({
          adminUser: { isAuthenticated: false, email: null, name: null, role: null },
        }),
    }),
    {
      name: "emmyt-concept-storage",
    }
  )
)


import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../lib/supabaseSync'
import { getSupabaseSessionUser, logoutSupabase } from '../lib/supabaseAuth'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Brand & Content CMS (Loaded dynamically from Supabase `content` table)
      companyInfo: {
        name: "EMMY-T CONCEPT",
        tagline: "",
        shortDesc: "",
        phone: "",
        whatsapp: "",
        email: "",
        address: "",
        openingHours: "",
        socials: {
          instagram: "",
          facebook: "",
          twitter: "",
          whatsapp: "",
        },
      },
      updateCompanyInfo: (updates) => {
        const next = { ...get().companyInfo, ...updates }
        set({ companyInfo: next })
        api.updateContent('company_info', 'profile', next)
      },

      announcement: {
        active: true,
        text: "",
        link: "/quote",
      },
      updateAnnouncement: (announcement) => {
        set({ announcement })
        api.updateContent('announcement', 'current', announcement)
      },

      // Services Catalog (Sourced from Supabase `services` table)
      services: [],
      addService: (newService) => {
        const item = { ...newService, id: `srv-${Date.now()}`, sortOrder: get().services.length + 1 }
        set((state) => ({
          services: [...state.services, item],
        }))
        api.upsertService(item)
      },
      updateService: (id, updates) => {
        set((state) => ({
          services: state.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }))
        const updated = get().services.find((s) => s.id === id)
        if (updated) api.upsertService(updated)
      },
      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        }))
        api.deleteService(id)
      },

      // Portfolio Showcase (Sourced from Supabase `portfolio` table)
      portfolio: [],
      addPortfolioProject: (project) => {
        const item = { ...project, id: `proj-${Date.now()}`, date: new Date().getFullYear().toString() }
        set((state) => ({
          portfolio: [item, ...state.portfolio],
        }))
        api.upsertPortfolio(item)
      },
      updatePortfolioProject: (id, updates) => {
        set((state) => ({
          portfolio: state.portfolio.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))
        const updated = get().portfolio.find((p) => p.id === id)
        if (updated) api.upsertPortfolio(updated)
      },
      deletePortfolioProject: (id) => {
        set((state) => ({
          portfolio: state.portfolio.filter((p) => p.id !== id),
        }))
        api.deletePortfolio(id)
      },

      // Portfolio Categories (Managed dynamically in Supabase `content` table)
      portfolioCategories: [],
      setPortfolioCategories: (categories) => {
        set({ portfolioCategories: categories })
        api.updateContent('portfolio', 'categories', categories)
      },
      addPortfolioCategory: (category) => {
        const current = get().portfolioCategories || []
        const next = [...current, category]
        set({ portfolioCategories: next })
        api.updateContent('portfolio', 'categories', next)
      },
      updatePortfolioCategory: (id, updates) => {
        const current = get().portfolioCategories || []
        const next = current.map((c) => (c.id === id ? { ...c, ...updates } : c))
        set({ portfolioCategories: next })
        api.updateContent('portfolio', 'categories', next)
      },
      deletePortfolioCategory: (id) => {
        const current = get().portfolioCategories || []
        const next = current.filter((c) => c.id !== id)
        set({ portfolioCategories: next })
        api.updateContent('portfolio', 'categories', next)
      },

      // Orders & Enquiries (Live Supabase `enquiries` table)
      enquiries: [],
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
              title: enquiry.type === 'contact_message' ? "New Direct Message" : "New Project Enquiry",
              message: `${enquiry.customerName} submitted ${enquiry.serviceName || 'a request'}`,
              timestamp: new Date().toISOString(),
              read: false,
              link: "/admin/orders",
            },
            ...state.notifications,
          ],
        }))
        api.insertEnquiry(newEnquiry)
        return newEnquiry
      },
      updateEnquiryStatus: (id, status, notes = null) => {
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === id ? { ...e, status, ...(notes !== null ? { notes } : {}) } : e
          ),
        }))
        api.updateEnquiry(id, { status, ...(notes !== null ? { notes } : {}) })
      },
      updateEnquiryPricing: (id, quotedPrice, agreedPrice) => {
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === id ? { ...e, quotedPrice, agreedPrice } : e
          ),
        }))
        api.updateEnquiry(id, { quotedPrice, agreedPrice })
      },

      // Quotations (Live Supabase `quotations` table)
      quotations: [],
      addQuotation: (quote) => {
        set((state) => ({
          quotations: [quote, ...state.quotations],
        }))
        api.insertQuotation(quote)
      },
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
        api.insertQuotation(newQuote)
        api.updateEnquiry(enquiryId, {
          status: 'quotation_sent',
          quotedPrice: newQuote.total,
          quoteId: newQuote.id,
        })
        return newQuote
      },

      // Testimonials & Reviews (Live Supabase `testimonials` table)
      testimonials: [],
      submitCustomerReview: (review) => {
        const newReview = {
          ...review,
          id: `rev-${Date.now()}`,
          approved: false,
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
        api.insertTestimonial(newReview)
        return newReview
      },
      approveReview: (id) => {
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, approved: true } : t
          ),
        }))
        api.updateTestimonial(id, { approved: true })
      },
      rejectReview: (id) => {
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, approved: false } : t
          ),
        }))
        api.updateTestimonial(id, { approved: false })
      },
      toggleFeatureReview: (id) => {
        const current = get().testimonials.find((t) => t.id === id)
        const nextVal = current ? !current.featured : true
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, featured: nextVal } : t
          ),
        }))
        api.updateTestimonial(id, { featured: nextVal })
      },
      deleteReview: (id) => {
        set((state) => ({
          testimonials: state.testimonials.filter((t) => t.id !== id),
        }))
        api.deleteTestimonial(id)
      },

      // Notifications
      notifications: [],
      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      // Admin Auth State (Real Supabase Auth)
      authLoading: true,
      adminUser: {
        isAuthenticated: false,
        id: null,
        email: null,
        name: null,
        role: null,
      },
      setAdminAuth: (user) => set({ adminUser: user, authLoading: false }),
      setAuthLoading: (loading) => set({ authLoading: loading }),
      logoutAdmin: async () => {
        await logoutSupabase()
        set({
          adminUser: { isAuthenticated: false, id: null, email: null, name: null, role: null },
          authLoading: false,
        })
      },

      // Initializer: Pulls all live records & session from Supabase
      syncWithSupabase: async () => {
        try {
          const [sessionUser, services, portfolio, testimonials, enquiries, quotations, content] = await Promise.all([
            getSupabaseSessionUser(),
            api.getServices(),
            api.getPortfolio(),
            api.getTestimonials(),
            api.getEnquiries(),
            api.getQuotations(),
            api.getContent(),
          ])

          set((state) => ({
            adminUser: sessionUser || state.adminUser,
            authLoading: false,
            services: services !== null ? services : state.services,
            portfolio: portfolio !== null ? portfolio : state.portfolio,
            testimonials: testimonials !== null ? testimonials : state.testimonials,
            enquiries: enquiries !== null ? enquiries : state.enquiries,
            quotations: quotations !== null ? quotations : state.quotations,
            companyInfo: content?.companyInfo || state.companyInfo,
            announcement: content?.announcement || state.announcement,
            portfolioCategories: content?.portfolioCategories || state.portfolioCategories,
          }))
        } catch (err) {
          console.warn('syncWithSupabase error:', err)
          set({ authLoading: false })
        }
      },
    }),
    {
      name: "emmyt-concept-storage",
      version: 7, // Bumped to purge any stale offline mock arrays from client's browser
      partialize: (state) => ({
        companyInfo: state.companyInfo,
        announcement: state.announcement,
        portfolioCategories: state.portfolioCategories,
        services: state.services,
        portfolio: state.portfolio,
        testimonials: state.testimonials,
        enquiries: state.enquiries,
        quotations: state.quotations,
        notifications: state.notifications,
      }),
      migrate: () => {
        // Complete clean start: all data is fetched live from Supabase tables
        return {
          adminUser: { isAuthenticated: false, id: null, email: null, name: null, role: null },
          authLoading: true,
          companyInfo: {
            name: "EMMY-T CONCEPT",
            tagline: "",
            shortDesc: "",
            phone: "",
            whatsapp: "",
            email: "",
            address: "",
            openingHours: "",
            socials: { instagram: "", facebook: "", twitter: "", whatsapp: "" },
          },
          announcement: { active: true, text: "", link: "/quote" },
          portfolioCategories: [],
          services: [],
          portfolio: [],
          testimonials: [],
          enquiries: [],
          quotations: [],
          notifications: [],
        }
      },
    }
  )
)

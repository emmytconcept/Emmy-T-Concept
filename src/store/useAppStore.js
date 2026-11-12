import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_SERVICES, INITIAL_PORTFOLIO, COMPANY_INFO, TESTIMONIALS } from '../lib/constants'
import { api } from '../lib/supabaseSync'
import { getSupabaseSessionUser, logoutSupabase } from '../lib/supabaseAuth'

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

      // Services Management (Default catalog loaded so the public site is never empty)
      services: INITIAL_SERVICES,
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

      // Portfolio Management (Default projects loaded so the showcase is never empty)
      portfolio: INITIAL_PORTFOLIO,
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

      // Orders & Enquiries Management (Clean production start: 0 fake mock records)
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

      // Quotations (Clean production start: 0 fake mock records)
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

      // Testimonials & Reviews (Default approved reviews loaded)
      testimonials: TESTIMONIALS,
      submitCustomerReview: (review) => {
        const newReview = {
          ...review,
          id: `rev-${Date.now()}`,
          approved: false, // Pending admin approval
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

      // In-App Notifications (Clean start)
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

      // Sync live production data and session from Supabase into store
      syncWithSupabase: async () => {
        try {
          const [sessionUser, services, portfolio, testimonials, enquiries, quotations] = await Promise.all([
            getSupabaseSessionUser(),
            api.getServices(),
            api.getPortfolio(),
            api.getTestimonials(),
            api.getEnquiries(),
            api.getQuotations(),
          ])

          set((state) => ({
            adminUser: sessionUser ? sessionUser : state.adminUser,
            authLoading: false,
            services: services || state.services,
            portfolio: portfolio || state.portfolio,
            testimonials: testimonials || state.testimonials,
            enquiries: enquiries !== null ? enquiries : state.enquiries,
            quotations: quotations !== null ? quotations : state.quotations,
          }))
        } catch (err) {
          console.warn('syncWithSupabase error:', err)
          set({ authLoading: false })
        }
      },
    }),
    {
      name: "emmyt-concept-storage",
      version: 5, // Bumped version to enforce real Supabase auth state and purge legacy fake auth
      partialize: (state) => ({
        // Do not persist fake adminUser - Supabase session cookie/token is single source of truth!
        companyInfo: state.companyInfo,
        announcement: state.announcement,
        services: state.services,
        portfolio: state.portfolio,
        testimonials: state.testimonials,
        enquiries: state.enquiries,
        quotations: state.quotations,
        notifications: state.notifications,
      }),
      migrate: (persistedState, version) => {
        if (!persistedState) return persistedState
        const mockOrderIds = new Set(['enq-101', 'enq-102', 'enq-103'])
        const cleanedEnquiries = (persistedState.enquiries || []).filter(
          (e) => !mockOrderIds.has(e.id)
        )
        const cleanedQuotations = (persistedState.quotations || []).filter(
          (q) => q.id !== 'QT-2024-001'
        )
        const cleanedNotifications = (persistedState.notifications || []).filter(
          (n) => n.id !== 'notif-1' && n.id !== 'notif-2'
        )
        return {
          ...persistedState,
          adminUser: { isAuthenticated: false, id: null, email: null, name: null, role: null },
          authLoading: true,
          enquiries: cleanedEnquiries,
          quotations: cleanedQuotations,
          notifications: cleanedNotifications,
          services: persistedState.services?.length ? persistedState.services : INITIAL_SERVICES,
          portfolio: persistedState.portfolio?.length ? persistedState.portfolio : INITIAL_PORTFOLIO,
          testimonials: persistedState.testimonials?.length ? persistedState.testimonials : TESTIMONIALS,
        }
      },
    }
  )
)

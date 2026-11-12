import { supabase, isSupabaseConfigured } from './supabase'
import { deleteFromSupabaseStorage, deleteFilesFromStorage } from './supabaseStorage'

/**
 * Service helpers to seamlessly read and write live data to Supabase.
 * Connects directly to PostgreSQL tables with proper column mapping.
 */

export const api = {
  // 1. SERVICES
  async getServices() {
    if (!isSupabaseConfigured()) return null
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data && data.length > 0
        ? data.map((s) => ({
            ...s,
            shortDesc: s.short_desc || s.shortDesc || '',
            subItems: s.sub_items || s.subItems || [],
            sortOrder: s.sort_order ?? s.sortOrder ?? 0,
          }))
        : []
    } catch (err) {
      console.warn('Supabase getServices failed:', err.message)
      return null
    }
  },

  async upsertService(service) {
    if (!isSupabaseConfigured()) return
    try {
      await supabase.from('services').upsert({
        id: service.id,
        slug: service.slug || service.id,
        name: service.name,
        category: service.category,
        icon: service.icon,
        short_desc: service.shortDesc || service.short_desc,
        description: service.description,
        sub_items: service.subItems || service.sub_items || [],
        image: service.image,
        featured: service.featured || false,
        status: service.status || 'published',
        sort_order: service.sortOrder || service.sort_order || 0,
      })
    } catch (err) {
      console.warn('Supabase upsertService error:', err.message)
    }
  },

  async deleteService(id, imageUrl) {
    if (!isSupabaseConfigured()) return
    try {
      // Delete storage file first (best-effort, non-blocking)
      if (imageUrl) {
        await deleteFromSupabaseStorage(imageUrl)
      }      await supabase.from('services').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase deleteService error:', err.message)
    }
  },

  // 2. PORTFOLIO
  async getPortfolio() {
    if (!isSupabaseConfigured()) return null
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data && data.length > 0
        ? data.map((p) => ({
            ...p,
            categoryLabel: p.category_label || p.categoryLabel || p.category,
            sortOrder: p.sort_order ?? p.sortOrder ?? 0,
          }))
        : []
    } catch (err) {
      console.warn('Supabase getPortfolio failed:', err.message)
      return null
    }
  },

  async upsertPortfolio(project) {
    if (!isSupabaseConfigured()) return
    try {
      await supabase.from('portfolio').upsert({
        id: project.id,
        title: project.title,
        slug: project.slug || project.id,
        category: project.category,
        category_label: project.categoryLabel || project.category_label,
        description: project.description,
        image: project.image,
        images: project.images || [],
        client: project.client,
        date: project.date,
        featured: project.featured || false,
        status: project.status || 'published',
        sort_order: project.sortOrder || project.sort_order || 0,
      })
    } catch (err) {
      console.warn('Supabase upsertPortfolio error:', err.message)
    }
  },

  async deletePortfolio(id, imageUrls = []) {
    if (!isSupabaseConfigured()) return
    try {
      // Delete all associated storage files (cover + gallery) first
      if (imageUrls.length) {
        await deleteFilesFromStorage(imageUrls)
      }
      await supabase.from('portfolio').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase deletePortfolio error:', err.message)
    }
  },

  // 3. ENQUIRIES & ORDERS
  async getEnquiries() {
    if (!isSupabaseConfigured()) return null
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
        ? data.map((e) => ({
            id: e.id,
            customerName: e.customer_name,
            phone: e.phone,
            email: e.email,
            serviceId: e.service_id,
            serviceName: e.service_name,
            description: e.description,
            quantity: e.quantity,
            dimensions: e.dimensions,
            deliveryDate: e.delivery_date,
            turnaround: e.turnaround,
            uploadedFiles: e.uploaded_files || [],
            status: e.status,
            type: e.type,
            quotedPrice: e.quoted_price ? parseFloat(e.quoted_price) : null,
            agreedPrice: e.agreed_price ? parseFloat(e.agreed_price) : null,
            quoteId: e.quote_id,
            notes: e.notes || '',
            createdAt: e.created_at,
          }))
        : []
    } catch (err) {
      console.warn('Supabase getEnquiries failed:', err.message)
      return null
    }
  },

  async insertEnquiry(enquiry) {
    if (!isSupabaseConfigured()) return
    try {
      await supabase.from('enquiries').insert({
        id: enquiry.id,
        customer_name: enquiry.customerName,
        phone: enquiry.phone,
        email: enquiry.email,
        service_id: enquiry.serviceId,
        service_name: enquiry.serviceName,
        description: enquiry.description,
        quantity: enquiry.quantity,
        dimensions: enquiry.dimensions,
        delivery_date: enquiry.deliveryDate || null,
        turnaround: enquiry.turnaround || null,
        uploaded_files: enquiry.uploadedFiles || [],
        status: enquiry.status || 'new_enquiry',
        type: enquiry.type || 'quote',
        source: 'website',
        quoted_price: enquiry.quotedPrice || null,
        agreed_price: enquiry.agreedPrice || null,
        quote_id: enquiry.quoteId || null,
        notes: enquiry.notes || '',
      })
    } catch (err) {
      console.warn('Supabase insertEnquiry error:', err.message)
    }
  },

  async updateEnquiry(id, updates) {
    if (!isSupabaseConfigured()) return
    try {
      const payload = {}
      if (updates.status !== undefined) payload.status = updates.status
      if (updates.notes !== undefined) payload.notes = updates.notes
      if (updates.quotedPrice !== undefined) payload.quoted_price = updates.quotedPrice
      if (updates.agreedPrice !== undefined) payload.agreed_price = updates.agreedPrice
      if (updates.quoteId !== undefined) payload.quote_id = updates.quoteId

      await supabase.from('enquiries').update(payload).eq('id', id)
    } catch (err) {
      console.warn('Supabase updateEnquiry error:', err.message)
    }
  },

  // 4. QUOTATIONS
  async getQuotations() {
    if (!isSupabaseConfigured()) return null
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
        ? data.map((q) => ({
            id: q.id,
            enquiryId: q.enquiry_id,
            customerName: q.customer_name,
            customerPhone: q.customer_phone,
            customerEmail: q.customer_email,
            items: q.line_items || [],
            subtotal: parseFloat(q.subtotal || 0),
            deliveryCharge: parseFloat(q.delivery_charge || 0),
            total: parseFloat(q.total || 0),
            currency: q.currency,
            paymentTerms: q.payment_terms,
            status: q.status,
            date: q.date,
            validUntil: q.valid_until,
            pdfUrl: q.pdf_url,
          }))
        : []
    } catch (err) {
      console.warn('Supabase getQuotations failed:', err.message)
      return null
    }
  },

  async insertQuotation(quote) {
    if (!isSupabaseConfigured()) return
    try {
      await supabase.from('quotations').insert({
        id: quote.id,
        enquiry_id: quote.enquiryId || null,
        customer_name: quote.customerName,
        customer_phone: quote.customerPhone,
        customer_email: quote.customerEmail,
        line_items: quote.items || [],
        subtotal: quote.subtotal,
        delivery_charge: quote.deliveryCharge || 0,
        total: quote.total,
        currency: 'NGN',
        payment_terms: quote.paymentTerms || undefined,
        status: quote.status || 'sent',
        date: quote.date || new Date().toISOString().split('T')[0],
        valid_until: quote.validUntil,
        pdf_url: quote.pdfUrl || null,
      })
    } catch (err) {
      console.warn('Supabase insertQuotation error:', err.message)
    }
  },

  // 5. TESTIMONIALS
  async getTestimonials() {
    if (!isSupabaseConfigured()) return null
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data && data.length > 0
        ? data.map((t) => ({
            id: t.id,
            name: t.customer_name,
            role: t.role,
            company: t.company,
            content: t.content,
            rating: t.rating,
            approved: t.approved,
            featured: t.featured,
            date: t.date,
          }))
        : []
    } catch (err) {
      console.warn('Supabase getTestimonials failed:', err.message)
      return null
    }
  },

  async insertTestimonial(review) {
    if (!isSupabaseConfigured()) return
    try {
      await supabase.from('testimonials').insert({
        id: review.id,
        customer_name: review.name,
        role: review.role || '',
        company: review.company || '',
        content: review.content,
        rating: review.rating,
        approved: review.approved || false,
        featured: review.featured || false,
        date: review.date || new Date().toISOString().split('T')[0],
      })
    } catch (err) {
      console.warn('Supabase insertTestimonial error:', err.message)
    }
  },

  async updateTestimonial(id, updates) {
    if (!isSupabaseConfigured()) return
    try {
      const payload = {}
      if (updates.approved !== undefined) payload.approved = updates.approved
      if (updates.featured !== undefined) payload.featured = updates.featured
      await supabase.from('testimonials').update(payload).eq('id', id)
    } catch (err) {
      console.warn('Supabase updateTestimonial error:', err.message)
    }
  },

  async deleteTestimonial(id) {
    if (!isSupabaseConfigured()) return
    try {
      await supabase.from('testimonials').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase deleteTestimonial error:', err.message)
    }
  },

  // 6. CONTENT & CMS
  async getContent() {
    if (!isSupabaseConfigured()) return null
    try {
      const { data, error } = await supabase.from('content').select('*')
      if (error) throw error
      if (!data) return null

      const res = {}
      data.forEach((row) => {
        if (row.section === 'company_info' && row.key === 'profile') {
          res.companyInfo = row.value
        } else if (row.section === 'announcement' && row.key === 'current') {
          res.announcement = row.value
        } else if (row.section === 'portfolio' && row.key === 'categories') {
          res.portfolioCategories = row.value
        }
      })
      return res
    } catch (err) {
      console.warn('Supabase getContent failed:', err.message)
      return null
    }
  },

  async updateContent(section, key, value) {
    if (!isSupabaseConfigured()) return
    try {
      await supabase.from('content').upsert(
        { section, key, value },
        { onConflict: 'section,key' }
      )
    } catch (err) {
      console.warn('Supabase updateContent error:', err.message)
    }
  },
}

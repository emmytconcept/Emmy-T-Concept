import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts & Shared
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/shared/WhatsAppButton'
import ScrollToTop from './components/shared/ScrollToTop'
import AdminLayout from './components/layout/AdminLayout'

// Public Pages
import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import ServicesPage from './pages/public/ServicesPage'
import ServiceDetailPage from './pages/public/ServiceDetailPage'
import PortfolioPage from './pages/public/PortfolioPage'
import QuotePage from './pages/public/QuotePage'
import ContactPage from './pages/public/ContactPage'
import TrackOrderPage from './pages/public/TrackOrderPage'
import NotFoundPage from './pages/public/NotFoundPage'

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminServicesPage from './pages/admin/AdminServicesPage'
import AdminPortfolioPage from './pages/admin/AdminPortfolioPage'
import AdminQuotationsPage from './pages/admin/AdminQuotationsPage'
import AdminCustomersPage from './pages/admin/AdminCustomersPage'
import AdminReviewsPage from './pages/admin/AdminReviewsPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'

import { useAppStore } from './store/useAppStore'

// Public Shell Wrapper
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080808] text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

// Protected Route Guard for Admin
function AdminRouteGuard({ children }) {
  const { adminUser } = useAppStore()
  if (!adminUser?.isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

export default function App() {
  const { syncWithSupabase } = useAppStore()

  useEffect(() => {
    syncWithSupabase?.()
  }, [syncWithSupabase])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#141414',
            color: '#fff',
            border: '1px solid rgba(217, 163, 35, 0.3)',
          },
        }}
      />
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRouteGuard>
              <AdminLayout />
            </AdminRouteGuard>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="quotations" element={<AdminQuotationsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="portfolio" element={<AdminPortfolioPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

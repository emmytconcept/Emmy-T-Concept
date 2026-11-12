import React, { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Palette,
  FileCheck2,
  Users,
  Settings,
  Bell,
  LogOut,
  ExternalLink,
  Menu,
  X,
  FileText,
  Layers,
  ChevronRight,
  Star
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { adminUser, logoutAdmin, notifications, markAllNotificationsAsRead } = useAppStore()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = async () => {
    await logoutAdmin()
    navigate('/admin/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders & Enquiries', path: '/admin/orders', icon: ShoppingBag, badge: 'Active' },
    { name: 'Quotations', path: '/admin/quotations', icon: FileCheck2 },
    { name: 'Portfolio Projects', path: '/admin/portfolio', icon: Palette },
    { name: 'Services Manager', path: '/admin/services', icon: Layers },
    { name: 'Customers & CRM', path: '/admin/customers', icon: Users },
    { name: 'Customer Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Admin Settings', path: '/admin/settings', icon: Settings },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#0a0a0a] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-white/80 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <img src="/logo-mark.png" alt="EMMY-T Logo" className="h-7 w-auto object-contain shrink-0" />
          <span className="font-heading font-bold text-sm tracking-wide">
            EMMY-T <span className="text-[#d9a323]">ADMIN</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="p-2 text-xs text-[#8e9196] hover:text-[#d9a323]"
            title="View Live Site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0a0a0a] border-r border-[#d9a323]/20 flex flex-col justify-between z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3.5">
            <img src="/logo-mark.png" alt="EMMY-T Logo" className="h-9 w-auto object-contain shrink-0 drop-shadow-[0_0_10px_rgba(217,163,35,0.25)]" />
            <div className="leading-none">
              <p className="font-heading font-extrabold text-base tracking-wider text-white">
                EMMY-T <span className="text-[#d9a323]">HQ</span>
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#8e9196] mt-1">
                Administration Suite
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#d9a323]/20 to-transparent text-[#d9a323] border-l-4 border-l-[#d9a323]'
                      : 'text-[#8e9196] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#d9a323]/20 text-[#f5d061]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#c6c8cc] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#d9a323]" /> View Public Website
            </span>
            <ChevronRight className="w-3 h-3 text-[#8e9196]" />
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#141414] border border-[#d9a323]/50 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                <img
                  src="/logo-mark.png"
                  alt="Admin Profile"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-white truncate max-w-[100px]">
                  {adminUser.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-[#d9a323] uppercase">
                  {adminUser.role || 'Super Admin'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[#8e9196] hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-30">
          <div>
            <h1 className="font-heading text-lg font-bold text-white">
              Executive Management Desk
            </h1>
            <p className="text-xs text-[#8e9196]">
              Real-time control over orders, quotations, portfolio, and website assets
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#c6c8cc] hover:text-white hover:border-[#d9a323]/50 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#d9a323] text-black text-[10px] font-extrabold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl border border-[#d9a323]/30 shadow-2xl p-4 space-y-3 z-50 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Notifications
                    </span>
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-[#d9a323] hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs transition-colors ${
                          n.read ? 'bg-white/5 text-[#8e9196]' : 'bg-[#d9a323]/10 text-white border border-[#d9a323]/30'
                        }`}
                      >
                        <p className="font-bold text-white">{n.title}</p>
                        <p className="text-[11px] text-[#c6c8cc] mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/"
              target="_blank"
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-[#d9a323] hover:text-black border border-white/10 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span>Preview Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Content Page Outlet / Children */}
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}


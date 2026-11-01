import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Map,
  Bus,
  Calendar,
  Ticket,
  RotateCcw,
  BarChart3,
  ScrollText,
  Settings,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminMenu = [
    { label: 'Platform Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Bus Operators', path: '/admin/operators', icon: Building2 },
    { label: 'Stations & Terminals', path: '/admin/stations', icon: MapPin },
    { label: 'Routes & Stops', path: '/admin/routes', icon: Map },
    { label: 'Fleet / Buses', path: '/admin/buses', icon: Bus },
    { label: 'Trips & Schedules', path: '/admin/trips', icon: Calendar },
    { label: 'All Bookings', path: '/admin/bookings', icon: Ticket },
    { label: 'Cancellations & Refunds', path: '/admin/cancellations', icon: RotateCcw },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: ScrollText },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FA]">
      <Navbar />

      {/* Admin Header Bar */}
      <div className="bg-[#0B1F3A] text-white py-3.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight">
                Ticketora Master Administration Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
              RLS ENFORCED
            </span>
            <span className="text-slate-400">Environment: <strong className="text-white">Production BDT</strong></span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Admin Sidebar */}
          <aside
            className={`lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2 ${
              sidebarOpen ? 'block fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto m-4' : 'hidden lg:block'
            }`}
          >
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                System Modules
              </span>
              {sidebarOpen && (
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <nav className="space-y-1">
              {adminMenu.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Workspace */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

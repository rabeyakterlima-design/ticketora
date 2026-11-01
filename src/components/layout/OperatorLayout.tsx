import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { LayoutDashboard, Bus, Grid, Map, Calendar, BarChart3, Store } from 'lucide-react';

export const OperatorLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/operator', icon: LayoutDashboard },
    { label: 'Bus Fleet', path: '/operator/buses', icon: Bus },
    { label: 'Seat Layouts', path: '/operator/layouts', icon: Grid },
    { label: 'Routes & Stops', path: '/operator/routes', icon: Map },
    { label: 'Trip Schedules', path: '/operator/trips', icon: Calendar },
    { label: 'Reports & Analytics', path: '/operator/reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FA]">
      <Navbar />

      {/* Operator Banner Header */}
      <div className="bg-[#142B4A] text-white py-4 px-4 sm:px-8 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white">Green Line Paribahan</h1>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  OPERATOR ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Fleet Management & Operations Portal
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-300">
            Assigned Admin: <strong className="text-white">Ashraf Hossain</strong>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

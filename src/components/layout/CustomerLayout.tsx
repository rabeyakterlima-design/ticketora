import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Ticket, User, Bell, LogOut, Search } from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Search Buses', path: '/search', icon: Search },
    { label: 'My Bookings', path: '/dashboard/bookings', icon: Ticket },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { label: 'My Profile', path: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FA]">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Customer Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-11 h-11 rounded-full bg-slate-900 text-teal-400 font-extrabold flex items-center justify-center text-sm shadow-xs">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm text-slate-900 truncate">
                  {user?.full_name || 'Passenger'}
                </h3>
                <p className="text-xs text-slate-500 font-mono truncate">{user?.phone || user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Outlet */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

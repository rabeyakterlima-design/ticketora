import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { formatBDT } from '../../lib/utils';
import { Store, ShoppingCart, Clock, Search, DollarSign, LogOut } from 'lucide-react';

export const CounterLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [shift, setShift] = useState(() =>
    store.getActiveShiftForStaff(user?.id || 'usr-staff-gabtoli')
  );

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setShift(store.getActiveShiftForStaff(user?.id || 'usr-staff-gabtoli'));
    });
    return unsub;
  }, [user]);

  const counter = store.getCounters()[0]; // Default Gabtoli counter

  const navTabs = [
    { label: 'POS Terminal (Fast Booking)', path: '/counter', icon: ShoppingCart },
    { label: 'Shift Management', path: '/counter/shift', icon: Clock },
    { label: 'Search & Reprint Ticket', path: '/counter/search', icon: Search },
    { label: 'Daily Sales & Settlement', path: '/counter/daily-sales', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FA]">
      <Navbar />

      {/* Top Counter & Shift Operational Bar */}
      <div className="bg-[#142B4A] text-white border-b border-slate-700 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {counter?.name || 'Gabtoli Counter #1'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {counter?.code || 'GL-GB-01'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Staff on Duty: <strong className="text-white">{user?.full_name || 'Rafiqul Islam'}</strong>
              </p>
            </div>
          </div>

          {/* Shift Financial Stats */}
          <div className="flex items-center gap-3 sm:gap-6 text-xs">
            {shift ? (
              <>
                <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Shift Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    OPEN (Started {new Date(shift.shift_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                </div>

                <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Today's Sales</span>
                  <span className="text-teal-300 font-extrabold text-sm">{formatBDT(shift.total_sales_amount)}</span>
                </div>

                <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 hidden sm:block">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tickets Sold</span>
                  <span className="text-white font-bold">{shift.total_tickets_sold}</span>
                </div>
              </>
            ) : (
              <div className="bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-300">
                No active shift open.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Counter Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {navTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Outlet */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

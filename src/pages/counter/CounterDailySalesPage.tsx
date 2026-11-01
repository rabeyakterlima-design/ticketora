import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { formatBDT, formatTime } from '../../lib/utils';
import { DollarSign, Printer, TrendingUp, CreditCard, Banknote, Calendar } from 'lucide-react';

export const CounterDailySalesPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(() =>
    store.getBookings().filter((b) => b.booking_channel === 'counter')
  );

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBookings(store.getBookings().filter((b) => b.booking_channel === 'counter'));
    });
    return unsub;
  }, []);

  const totalSales = bookings.reduce((sum, b) => sum + (b.booking_status !== 'cancelled' ? b.total_fare : 0), 0);
  const totalTickets = bookings.reduce((sum, b) => sum + (b.booking_status !== 'cancelled' ? b.seat_numbers.length : 0), 0);

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Daily Counter Sales & Financial Settlement
          </h1>
          <p className="text-xs text-slate-500">
            Summary of all tickets sold and cash collected at this terminal counter.
          </p>
        </div>

        <button
          onClick={handlePrintAudit}
          className="no-print px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Daily Settlement Sheet</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-teal-700">{formatBDT(totalSales)}</div>
          <div className="text-xs font-medium text-slate-500">Total Revenue Collected</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Banknote className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalTickets}</div>
          <div className="text-xs font-medium text-slate-500">Total Tickets Issued</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-emerald-700">100%</div>
          <div className="text-xs font-medium text-slate-500">Cash Reconciliation Rate</div>
        </div>
      </div>

      {/* Counter Sales Register Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Today's Counter Transaction Ledger</h3>
          <span className="text-xs font-mono text-slate-400">Date: 2026-10-31</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Receipt / PNR</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Passenger</th>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Seats</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No counter transactions recorded today yet.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-mono font-bold text-teal-800">
                      {b.booking_reference}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{b.customer_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{b.customer_phone}</div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {b.origin_city} ➔ {b.destination_city}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {b.seat_numbers.join(', ')}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {formatBDT(b.total_fare)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {b.payment_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

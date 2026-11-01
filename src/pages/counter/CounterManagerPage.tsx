import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { formatBDT } from '../../lib/utils';
import { Store, Users, DollarSign, TrendingUp, ShieldCheck } from 'lucide-react';

export const CounterManagerPage: React.FC = () => {
  const [shifts, setShifts] = useState(() => store.getShifts());
  const [bookings, setBookings] = useState(() =>
    store.getBookings().filter((b) => b.booking_channel === 'counter')
  );

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setShifts(store.getShifts());
      setBookings(store.getBookings().filter((b) => b.booking_channel === 'counter'));
    });
    return unsub;
  }, []);

  const totalSales = bookings.reduce((sum, b) => sum + (b.booking_status !== 'cancelled' ? b.total_fare : 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Counter Manager Supervision
        </h1>
        <p className="text-xs text-slate-500">
          Supervise physical ticket counters, assigned clerks, shift drawer reconciliations, and sales audits.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Assigned Counter</span>
          <div className="text-lg font-black text-slate-900">Green Line Gabtoli #1</div>
          <p className="text-[11px] text-slate-400 font-mono">Code: GL-GB-01</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Shift Revenue</span>
          <div className="text-2xl font-black text-teal-700 font-mono">{formatBDT(totalSales)}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">Reconciled with cash drawer</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Staff on Duty</span>
          <div className="text-lg font-bold text-slate-900">Rafiqul Islam</div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active Shift Open
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900">Staff Shift Monitoring</h3>
        <div className="space-y-3">
          {shifts.map((s) => (
            <div key={s.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-sm text-slate-900 block">{s.staff_name}</span>
                <span className="text-slate-500">
                  Started: {new Date(s.shift_start).toLocaleTimeString()} • Opening Cash: {formatBDT(s.opening_cash)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-700 text-sm block">{formatBDT(s.total_sales_amount)}</span>
                  <span className="text-[10px] text-slate-400">{s.total_tickets_sold} tickets sold</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

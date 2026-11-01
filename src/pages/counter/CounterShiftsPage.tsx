import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { StaffShift } from '../../types';
import { formatBDT, formatDate, formatTime } from '../../lib/utils';
import { Clock, DollarSign, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const CounterShiftsPage: React.FC = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<StaffShift[]>(() => store.getShifts());
  const [activeShift, setActiveShift] = useState<StaffShift | undefined>(() =>
    store.getActiveShiftForStaff(user?.id || 'usr-staff-gabtoli')
  );

  // Open Shift Form
  const [openingCash, setOpeningCash] = useState<number>(5000);
  const [shiftNotes, setShiftNotes] = useState('');

  // Close Shift Form
  const [closingCash, setClosingCash] = useState<number>(0);
  const [closingNotes, setClosingNotes] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setShifts(store.getShifts());
      setActiveShift(store.getActiveShiftForStaff(user?.id || 'usr-staff-gabtoli'));
    });
    return unsub;
  }, [user]);

  const handleStartShift = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newShift = store.startShift({
        counter_id: 'cnt-gabtoli-01',
        staff_user_id: user?.id || 'usr-staff-gabtoli',
        staff_name: user?.full_name || 'Rafiqul Islam',
        opening_cash: openingCash,
        notes: shiftNotes,
      });
      alert(`Shift started successfully with opening cash ৳${openingCash}.`);
    } catch (err: any) {
      alert(err.message || 'Error starting shift.');
    }
  };

  const handleCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;

    try {
      store.closeShift(activeShift.id, closingCash, closingNotes);
      alert(`Shift ended and reconciled successfully.`);
    } catch (err: any) {
      alert(err.message || 'Error closing shift.');
    }
  };

  const totalDrawerCash = activeShift ? activeShift.opening_cash + activeShift.total_sales_amount : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">Counter Shift Management</h1>
        <p className="text-xs text-slate-500">
          Track cash in drawer, register opening balances, and perform daily sales reconciliation.
        </p>
      </div>

      {/* Active Shift Card or Start Shift Form */}
      {activeShift ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-500 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Active Terminal Shift
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{activeShift.counter_name}</h2>
              <p className="text-xs text-slate-500">
                Staff: <strong className="text-slate-800">{activeShift.staff_name}</strong> • Started at {new Date(activeShift.shift_start).toLocaleTimeString()}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total In Drawer</span>
              <span className="text-2xl font-black text-teal-700">{formatBDT(totalDrawerCash)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-medium">Opening Cash</span>
              <span className="text-lg font-bold text-slate-900">{formatBDT(activeShift.opening_cash)}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-medium">Shift Sales Amount</span>
              <span className="text-lg font-bold text-emerald-700">{formatBDT(activeShift.total_sales_amount)}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-medium">Tickets Sold</span>
              <span className="text-lg font-bold text-slate-900">{activeShift.total_tickets_sold}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-medium">Shift Status</span>
              <span className="text-lg font-bold text-teal-700 uppercase">{activeShift.status}</span>
            </div>
          </div>

          {/* Close Shift Form */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Reconcile & End Current Shift</h3>
            <form onSubmit={handleCloseShift} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Counted Physical Cash in Drawer (৳) *
                </label>
                <input
                  type="number"
                  required
                  value={closingCash || ''}
                  onChange={(e) => setClosingCash(Number(e.target.value))}
                  placeholder={`Expected: ${totalDrawerCash}`}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reconciliation Notes
                </label>
                <input
                  type="text"
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="e.g. Cash drawer matches sales log exactly."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
                >
                  End & Close Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-xl space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Start a New Counter Shift</h2>
          <p className="text-xs text-slate-500">
            Please register your initial opening float cash before opening ticket sales.
          </p>

          <form onSubmit={handleStartShift} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Opening Float Cash (BDT ৳) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={openingCash}
                onChange={(e) => setOpeningCash(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Opening Shift Notes
              </label>
              <textarea
                rows={2}
                value={shiftNotes}
                onChange={(e) => setShiftNotes(e.target.value)}
                placeholder="e.g. Morning counter shift starting with petty cash for change."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
            >
              Start Counter Shift
            </button>
          </form>
        </div>
      )}

      {/* Shift History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900">Shift History & Reconciliation Logs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Counter</th>
                <th className="px-5 py-3">Staff</th>
                <th className="px-5 py-3">Start Time</th>
                <th className="px-5 py-3">Opening Cash</th>
                <th className="px-5 py-3">Total Sales</th>
                <th className="px-5 py-3">Tickets</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shifts.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{s.counter_name}</td>
                  <td className="px-5 py-3.5 text-slate-600">{s.staff_name}</td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {new Date(s.shift_start).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-800">{formatBDT(s.opening_cash)}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-emerald-700">
                    {formatBDT(s.total_sales_amount)}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{s.total_tickets_sold}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'open'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

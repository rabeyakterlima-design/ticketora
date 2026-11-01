import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { CancellationRequest } from '../../types';
import { formatBDT } from '../../lib/utils';
import { RotateCcw, CheckCircle2, Ban, AlertCircle } from 'lucide-react';

export const AdminCancellationsPage: React.FC = () => {
  const [cancellations, setCancellations] = useState<CancellationRequest[]>(() =>
    store.getCancellations()
  );

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setCancellations(store.getCancellations());
    });
    return unsub;
  }, []);

  const totalRefunds = cancellations.reduce((sum, c) => sum + c.refund_amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Cancellations & Refund Management
          </h1>
          <p className="text-xs text-slate-500">
            Automated policy enforcement, refund reversals, and cancellation approvals.
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Total Refunds Disbursed</span>
          <span className="text-lg font-black text-rose-700 font-mono">{formatBDT(totalRefunds)}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">
            Cancellation Requests ({cancellations.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">PNR</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Journey Date</th>
                <th className="px-5 py-3">Original Fare</th>
                <th className="px-5 py-3">Refund %</th>
                <th className="px-5 py-3">Refund Amount</th>
                <th className="px-5 py-3">Deduction Fee</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cancellations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-slate-400">
                    No cancellation requests recorded.
                  </td>
                </tr>
              ) : (
                cancellations.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-mono font-bold text-teal-800">
                      {c.booking_reference}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      {c.customer_name}
                      <span className="block text-[10px] text-slate-400 font-mono">{c.customer_phone}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{c.journey_date}</td>
                    <td className="px-5 py-3.5 font-bold font-mono text-slate-900">
                      {formatBDT(c.total_fare)}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-teal-700">
                      {c.refund_percentage}%
                    </td>
                    <td className="px-5 py-3.5 font-bold font-mono text-emerald-700">
                      {formatBDT(c.refund_amount)}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-rose-600">
                      {formatBDT(c.deduction_fee)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                      {c.reason}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {c.status}
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

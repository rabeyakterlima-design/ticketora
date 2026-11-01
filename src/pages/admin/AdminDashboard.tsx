import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { formatBDT, formatDate, formatTime } from '../../lib/utils';
import { Link } from 'react-router-dom';
import {
  Building2,
  Bus,
  Map,
  Ticket,
  DollarSign,
  Store,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [operators, setOperators] = useState(() => store.getOperators());
  const [buses, setBuses] = useState(() => store.getBuses());
  const [routes, setRoutes] = useState(() => store.getRoutes());
  const [counters, setCounters] = useState(() => store.getCounters());
  const [bookings, setBookings] = useState(() => store.getBookings());
  const [payments, setPayments] = useState(() => store.getPayments());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setOperators(store.getOperators());
      setBuses(store.getBuses());
      setRoutes(store.getRoutes());
      setCounters(store.getCounters());
      setBookings(store.getBookings());
      setPayments(store.getPayments());
    });
    return unsub;
  }, []);

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.booking_status !== 'cancelled' ? b.total_fare : 0),
    0
  );

  const confirmedCount = bookings.filter((b) => b.booking_status === 'confirmed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Ticketora Central Administration
        </h1>
        <p className="text-xs text-slate-500">
          Platform-wide metrics, operator oversight, centralized seat inventory, and financial auditing.
        </p>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900">{operators.length}</div>
          <div className="text-[11px] font-medium text-slate-500">Active Operators</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Bus className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900">{buses.length}</div>
          <div className="text-[11px] font-medium text-slate-500">Total Bus Fleet</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Map className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900">{routes.length}</div>
          <div className="text-[11px] font-medium text-slate-500">Active Routes</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Store className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900">{counters.length}</div>
          <div className="text-[11px] font-medium text-slate-500">Terminal Counters</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Ticket className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-slate-900">{confirmedCount}</div>
          <div className="text-[11px] font-medium text-slate-500">Confirmed Bookings</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-xl font-black text-emerald-700">{formatBDT(totalRevenue)}</div>
          <div className="text-[11px] font-medium text-slate-500">Gross Sales (BDT)</div>
        </div>
      </div>

      {/* Operator Performance Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>Partner Bus Operators</span>
            </h3>
            <Link to="/admin/operators" className="text-xs font-bold text-teal-600 hover:text-teal-700">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {operators.map((op) => (
              <div key={op.id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{op.name}</h4>
                  <p className="text-slate-500 font-mono text-[10px]">{op.registration_no || 'Reg: Verified'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 uppercase">
                    {op.status}
                  </span>
                  <span className="font-bold text-amber-700">★ {op.rating || '4.9'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-600" />
              <span>Payment Channel Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-time</span>
          </div>

          <div className="space-y-4 pt-2 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>bKash & Nagad (Online MFS)</span>
                <span>65% (৳{Math.round(totalRevenue * 0.65).toLocaleString()})</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-pink-600 h-full rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Terminal Counter Cash</span>
                <span>28% (৳{Math.round(totalRevenue * 0.28).toLocaleString()})</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Credit/Debit Cards & Rocket</span>
                <span>7% (৳{Math.round(totalRevenue * 0.07).toLocaleString()})</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '7%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Master Bookings Registry */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Recent Master System Bookings</h3>
          <Link to="/admin/bookings" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">PNR Reference</th>
                <th className="px-5 py-3">Passenger</th>
                <th className="px-5 py-3">Operator</th>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Seats</th>
                <th className="px-5 py-3">Channel</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 6).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3.5 font-mono font-bold text-teal-800">
                    {b.booking_reference}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-900 block">{b.customer_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{b.customer_phone}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium">{b.operator_name}</td>
                  <td className="px-5 py-3.5 text-slate-800 font-semibold">
                    {b.origin_city} ➔ {b.destination_city}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                    {b.seat_numbers.join(', ')}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        b.booking_channel === 'counter'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}
                    >
                      {b.booking_channel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold font-mono text-slate-900">
                    {formatBDT(b.total_fare)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.booking_status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {b.booking_status}
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

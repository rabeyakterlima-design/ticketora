import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { formatBDT, formatDate, formatTime } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, CheckCircle2, Clock, Ban, ArrowRight, Printer, AlertTriangle } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(() =>
    store.getBookings().filter((b) => !b.customer_id || b.customer_id === user?.id || b.customer_phone === user?.phone)
  );

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBookings(
        store.getBookings().filter((b) => !b.customer_id || b.customer_id === user?.id || b.customer_phone === user?.phone)
      );
    });
    return unsub;
  }, [user]);

  const confirmedBookings = bookings.filter((b) => b.booking_status === 'confirmed');
  const cancelledBookings = bookings.filter((b) => b.booking_status === 'cancelled');

  const nextTrip = confirmedBookings[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#142B4A] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300">
            <span>Passenger Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.full_name || 'Passenger'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Manage your bus reservations, download digital boarding passes, or schedule your next trip across Bangladesh.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Ticket className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{bookings.length}</div>
          <div className="text-xs font-medium text-slate-500">Total Bookings</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-teal-700">{confirmedBookings.length}</div>
          <div className="text-xs font-medium text-slate-500">Confirmed Trips</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-amber-700">{confirmedBookings.length > 0 ? 1 : 0}</div>
          <div className="text-xs font-medium text-slate-500">Upcoming Journey</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Ban className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{cancelledBookings.length}</div>
          <div className="text-xs font-medium text-slate-500">Cancelled</div>
        </div>
      </div>

      {/* Next Upcoming Trip Card */}
      {nextTrip && (
        <div className="bg-white rounded-3xl p-6 border-2 border-teal-500 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Next Upcoming Departure
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-slate-700">
              PNR: {nextTrip.booking_reference}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Route</span>
              <span className="font-bold text-slate-900 text-sm">
                {nextTrip.origin_city} ➔ {nextTrip.destination_city}
              </span>
              <span className="text-slate-500 block truncate">{nextTrip.boarding_point}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Schedule</span>
              <span className="font-bold text-slate-900 text-sm">
                {formatDate(nextTrip.journey_date)}
              </span>
              <span className="text-slate-500 block">{formatTime(nextTrip.departure_time)}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Bus & Seats</span>
              <span className="font-bold text-slate-900 text-sm">{nextTrip.operator_name}</span>
              <span className="font-mono font-bold text-teal-700 block">
                Seats: {nextTrip.seat_numbers.join(', ')}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Status: <strong className="text-emerald-700 font-bold">PAID & CONFIRMED</strong>
            </span>
            <Link
              to={`/ticket/${nextTrip.id}`}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print E-Ticket</span>
            </Link>
          </div>
        </div>
      )}

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900">Recent Bookings</h3>
          <Link
            to="/dashboard/bookings"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">PNR Reference</th>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Date & Time</th>
                <th className="px-5 py-3">Seats</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No bookings found. <Link to="/search" className="text-teal-600 font-bold hover:underline">Search buses now</Link>
                  </td>
                </tr>
              ) : (
                bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-teal-800">
                      {b.booking_reference}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {b.origin_city} ➔ {b.destination_city}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {formatDate(b.journey_date)} ({formatTime(b.departure_time)})
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {b.seat_numbers.join(', ')}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {formatBDT(b.total_fare)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.booking_status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {b.booking_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/ticket/${b.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Ticket</span>
                      </Link>
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

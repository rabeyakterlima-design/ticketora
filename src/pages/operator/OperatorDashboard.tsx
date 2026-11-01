import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { formatBDT, formatTime, formatDate } from '../../lib/utils';
import { Bus, Calendar, DollarSign, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OperatorDashboard: React.FC = () => {
  const [buses, setBuses] = useState(() => store.getBuses());
  const [trips, setTrips] = useState(() => store.getTrips());
  const [bookings, setBookings] = useState(() => store.getBookings());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBuses(store.getBuses());
      setTrips(store.getTrips());
      setBookings(store.getBookings());
    });
    return unsub;
  }, []);

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.booking_status !== 'cancelled' ? b.total_fare : 0),
    0
  );
  const totalTickets = bookings.reduce(
    (sum, b) => sum + (b.booking_status !== 'cancelled' ? b.seat_numbers.length : 0),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">Operator Dashboard</h1>
        <p className="text-xs text-slate-500">Green Line Paribahan Fleet & Scheduling Operations</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Bus className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{buses.length}</div>
          <div className="text-xs font-medium text-slate-500">Total Active Buses</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{trips.length}</div>
          <div className="text-xs font-medium text-slate-500">Scheduled Trips</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{formatBDT(totalRevenue)}</div>
          <div className="text-xs font-medium text-slate-500">Gross Ticket Sales</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalTickets}</div>
          <div className="text-xs font-medium text-slate-500">Tickets Sold</div>
        </div>
      </div>

      {/* Today's Scheduled Departures */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Today's Scheduled Departures</h3>
          <Link to="/operator/trips" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
            <span>Manage All Trips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Departure</th>
                <th className="px-5 py-3">Bus Vehicle</th>
                <th className="px-5 py-3">Coach Type</th>
                <th className="px-5 py-3">Base Fare</th>
                <th className="px-5 py-3">Available Seats</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {t.route?.origin_station?.city} ➔ {t.route?.destination_station?.city}
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 font-semibold">
                    {formatTime(t.departure_time)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {t.bus?.name} ({t.bus?.registration_number})
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {t.bus?.coach_type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold font-mono text-slate-900">
                    {formatBDT(t.base_fare)}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-700">
                    {t.available_seats_count} Seats
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {t.status}
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

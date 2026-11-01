import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { Booking } from '../../types';
import { formatBDT, formatDate, formatTime } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { Ticket, Search, Download, Printer, Filter } from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(() => store.getBookings());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBookings(store.getBookings());
    });
    return unsub;
  }, []);

  const filtered = bookings.filter((b) => {
    const query = search.toLowerCase();
    const matchesSearch =
      b.booking_reference.toLowerCase().includes(query) ||
      b.customer_name.toLowerCase().includes(query) ||
      b.customer_phone.includes(query) ||
      b.operator_name?.toLowerCase().includes(query);

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && b.booking_status !== statusFilter) return false;
    if (channelFilter !== 'all' && b.booking_channel !== channelFilter) return false;

    return true;
  });

  const exportCSV = () => {
    const headers = ['PNR', 'Customer', 'Phone', 'Operator', 'Route', 'Date', 'Time', 'Seats', 'Fare', 'Channel', 'Status'];
    const rows = filtered.map((b) => [
      b.booking_reference,
      `"${b.customer_name}"`,
      b.customer_phone,
      `"${b.operator_name}"`,
      `"${b.origin_city} to ${b.destination_city}"`,
      b.journey_date,
      b.departure_time,
      `"${b.seat_numbers.join(', ')}"`,
      b.total_fare,
      b.booking_channel,
      b.booking_status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ticketora_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Master Bookings Registry
          </h1>
          <p className="text-xs text-slate-500">
            Platform-wide centralized database of online and counter ticket transactions.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by PNR, Passenger, Phone, Operator..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed Only</option>
            <option value="cancelled">Cancelled Only</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
          >
            <option value="all">All Channels</option>
            <option value="online">Online Booking</option>
            <option value="counter">Terminal Counter</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">PNR Reference</th>
                <th className="px-5 py-3">Passenger</th>
                <th className="px-5 py-3">Operator</th>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Schedule</th>
                <th className="px-5 py-3">Seats</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Channel</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-8 text-center text-slate-400">
                    No bookings found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-mono font-bold text-teal-800">
                      {b.booking_reference}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-900 block">{b.customer_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{b.customer_phone}</span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{b.operator_name}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {b.origin_city} ➔ {b.destination_city}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <div>{formatDate(b.journey_date)}</div>
                      <div className="text-[10px] text-slate-400">{formatTime(b.departure_time)}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {b.seat_numbers.join(', ')}
                    </td>
                    <td className="px-5 py-3.5 font-bold font-mono text-slate-900">
                      {formatBDT(b.total_fare)}
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
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/ticket/${b.id}`}
                        className="inline-flex items-center gap-1 font-bold text-teal-600 hover:text-teal-700"
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

import React, { useState } from 'react';
import { store } from '../../services/store';
import { Booking } from '../../types';
import { formatBDT, formatDate, formatTime } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { Search, Printer, Ban, AlertCircle, CheckCircle2 } from 'lucide-react';

export const CounterSearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Booking[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmed = query.trim().toUpperCase();
    const all = store.getBookings();
    const found = all.filter(
      (b) =>
        b.booking_reference.toUpperCase().includes(trimmed) ||
        b.customer_phone.includes(trimmed) ||
        b.customer_name.toUpperCase().includes(trimmed)
    );
    setResults(found);
    setHasSearched(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Search Bookings & Lost Ticket Reprint
        </h1>
        <p className="text-xs text-slate-500">
          Find passenger records by Mobile Number, PNR Reference, or Name to reprint tickets or check boarding status.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Mobile (e.g. +8801722998877) or PNR (e.g. TKT-2026-5591)..."
            className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {hasSearched && (
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-700">
            Search Results ({results.length})
          </h3>

          {results.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">No booking records found for "{query}".</p>
            </div>
          ) : (
            results.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-teal-800">
                      {b.booking_reference}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        b.booking_status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {b.booking_status}
                    </span>
                  </div>

                  <span className="text-sm font-black text-slate-900">{formatBDT(b.total_fare)}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Passenger</span>
                    <span className="font-bold text-slate-900 text-sm">{b.customer_name}</span>
                    <span className="text-slate-500 block font-mono">{b.customer_phone}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Route</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {b.origin_city} ➔ {b.destination_city}
                    </span>
                    <span className="text-slate-500 block">{b.boarding_point}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Departure</span>
                    <span className="font-bold text-slate-900 text-sm">{formatDate(b.journey_date)}</span>
                    <span className="text-slate-500 block">{formatTime(b.departure_time)}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Seats</span>
                    <span className="font-mono font-bold text-teal-700 text-sm">
                      {b.seat_numbers.join(', ')}
                    </span>
                    <span className="text-slate-500 block">{b.operator_name}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Channel: <strong className="text-slate-700 capitalize">{b.booking_channel}</strong>
                  </span>
                  <Link
                    to={`/ticket/${b.id}`}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Reprint Official Ticket</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

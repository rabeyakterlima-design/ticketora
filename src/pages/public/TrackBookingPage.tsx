import React, { useState } from 'react';
import { store } from '../../services/store';
import { Booking } from '../../types';
import { formatBDT, formatDate, formatTime } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { Search, Ticket, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const TrackBookingPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Booking | null>(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const found = store.getBookingByReference(query.trim());
    setResult(found || null);
    setSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Track Your Bus Ticket
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Enter your Booking Reference (PNR) or your Mobile Number to look up ticket status and download your boarding pass.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Booking Reference (PNR) or Mobile Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. TKT-2026-8421 or +8801799123456"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
                className="flex-1 p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-all shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Track Ticket</span>
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            * Quick Demo Test: Try entering <code className="text-teal-700 font-bold">TKT-2026-8421</code> or <code className="text-teal-700 font-bold">+8801799123456</code>
          </p>
        </form>
      </div>

      {/* Result Card */}
      {searched && (
        <div>
          {result ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-500 shadow-md space-y-6 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Booking Reference
                  </span>
                  <span className="text-xl font-mono font-black text-teal-700">
                    {result.booking_reference}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{result.booking_status.toUpperCase()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Passenger</span>
                  <span className="font-bold text-slate-900 text-sm">{result.customer_name}</span>
                  <span className="text-slate-500 block font-mono">{result.customer_phone}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Route & Schedule</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {result.origin_city} ➔ {result.destination_city}
                  </span>
                  <span className="text-slate-500 block">
                    {formatDate(result.journey_date)} at {formatTime(result.departure_time)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Operator & Seats</span>
                  <span className="font-bold text-slate-900 text-sm">{result.operator_name}</span>
                  <span className="font-mono font-bold text-teal-700 block">
                    Seats: {result.seat_numbers.join(', ')}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Fare Paid</span>
                  <span className="text-lg font-black text-slate-900">{formatBDT(result.total_fare)}</span>
                </div>

                <Link
                  to={`/ticket/${result.id}`}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View E-Ticket</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800">No Booking Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active ticket matched the reference or mobile number "{query}". Please check your spelling and try again.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { Booking } from '../../types';
import { formatBDT, formatDate, formatTime } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { Ticket, Printer, Ban, AlertCircle, CheckCircle2 } from 'lucide-react';

export const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(() =>
    store.getBookings().filter((b) => !b.customer_id || b.customer_id === user?.id || b.customer_phone === user?.phone)
  );
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBookings(
        store.getBookings().filter((b) => !b.customer_id || b.customer_id === user?.id || b.customer_phone === user?.phone)
      );
    });
    return unsub;
  }, [user]);

  const filtered = bookings.filter((b) => {
    if (filter === 'confirmed') return b.booking_status === 'confirmed';
    if (filter === 'cancelled') return b.booking_status === 'cancelled';
    return true;
  });

  const handleCancelBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingBooking) return;

    try {
      const req = store.requestCancellation({
        booking_id: cancellingBooking.id,
        reason: cancelReason || 'Passenger personal schedule change',
        actor_name: user?.full_name || 'Passenger',
      });

      setCancelSuccessMsg(
        `Booking ${cancellingBooking.booking_reference} has been cancelled. Eligible refund: ৳${req.refund_amount} (${req.refund_percentage}%).`
      );
      setCancellingBooking(null);
      setCancelReason('');
    } catch (err: any) {
      alert(err.message || 'Error cancelling booking.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">My Bookings</h1>
          <p className="text-xs text-slate-500">View and manage all your bus tickets and travel history.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'confirmed' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Confirmed ({bookings.filter((b) => b.booking_status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'cancelled' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled ({bookings.filter((b) => b.booking_status === 'cancelled').length})
          </button>
        </div>
      </div>

      {cancelSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{cancelSuccessMsg}</span>
          </div>
          <button onClick={() => setCancelSuccessMsg(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Bookings Grid */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Bookings Found</h3>
            <p className="text-xs text-slate-500">You don't have any tickets under this tab.</p>
            <Link to="/search" className="inline-block px-4 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs">
              Search Buses Now
            </Link>
          </div>
        ) : (
          filtered.map((b) => {
            const isConfirmed = b.booking_status === 'confirmed';
            return (
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
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {b.booking_status}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900">{formatBDT(b.total_fare)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Route</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {b.origin_city} ➔ {b.destination_city}
                    </span>
                    <span className="text-slate-500 block truncate">{b.boarding_point}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Schedule</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {formatDate(b.journey_date)}
                    </span>
                    <span className="text-slate-500 block">{formatTime(b.departure_time)}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Bus & Seats</span>
                    <span className="font-bold text-slate-900 text-sm">{b.operator_name}</span>
                    <span className="font-mono font-bold text-teal-700 block">
                      Seats: {b.seat_numbers.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    Booked on: {new Date(b.created_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {isConfirmed && (
                      <button
                        type="button"
                        onClick={() => setCancellingBooking(b)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                      >
                        Cancel Ticket
                      </button>
                    )}
                    <Link
                      to={`/ticket/${b.id}`}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Ticket</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cancellation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600">
              <Ban className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Cancel Bus Booking?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel booking{' '}
              <strong className="font-mono text-slate-900">{cancellingBooking.booking_reference}</strong>?
              Seats <strong className="font-mono">{cancellingBooking.seat_numbers.join(', ')}</strong> will be released immediately back to public inventory.
            </p>

            <form onSubmit={handleCancelBooking} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Cancellation
                </label>
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Journey postponed, family emergency..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
                <span className="font-bold block">Refund Estimation:</span>
                <span>Cancellations &gt;24h before trip receive 85% refund; 12-24h receive 60%.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Keep Ticket
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { store } from '../../services/store';
import { formatBDT, formatDate, formatTime } from '../../lib/utils';
import confetti from 'canvas-confetti';
import { CheckCircle2, Ticket, ArrowRight, Calendar, MapPin, Printer } from 'lucide-react';

export const ConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const booking = bookingId ? store.getBookingById(bookingId) : undefined;

  useEffect(() => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Booking Not Found</h2>
        <Link to="/" className="text-sm text-teal-600 font-bold hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-center">
      {/* Success Badge */}
      <div className="space-y-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal-100 text-teal-600 mx-auto flex items-center justify-center shadow-lg animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Thank you for choosing Ticketora. A confirmation SMS & E-Ticket has been sent to{' '}
          <strong className="text-slate-800">{booking.customer_phone}</strong>.
        </p>
      </div>

      {/* Confirmation Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-left space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Booking Reference (PNR)
            </span>
            <span className="text-xl font-mono font-black text-teal-700">
              {booking.booking_reference}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Paid
            </span>
            <span className="text-xl font-black text-slate-900">
              {formatBDT(booking.total_fare)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Route</span>
            <span className="font-bold text-slate-900 text-sm">
              {booking.origin_city} ➔ {booking.destination_city}
            </span>
            <span className="text-slate-500 block truncate">{booking.boarding_point}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Journey Date & Time</span>
            <span className="font-bold text-slate-900 text-sm">
              {formatDate(booking.journey_date)}
            </span>
            <span className="text-slate-500 block">{formatTime(booking.departure_time)}</span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Bus & Seats</span>
            <span className="font-bold text-slate-900 text-sm">{booking.operator_name}</span>
            <span className="font-mono font-bold text-teal-700 block">
              Seats: {booking.seat_numbers.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to={`/ticket/${booking.id}`}
          className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
        >
          <Printer className="w-4 h-4" />
          <span>View & Print E-Ticket</span>
        </Link>

        <Link
          to="/dashboard/bookings"
          className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all text-sm"
        >
          <span>Go to My Bookings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

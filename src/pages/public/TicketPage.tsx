import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { store } from '../../services/store';
import { PrintableTicket } from '../../components/ticket/PrintableTicket';
import { ArrowLeft } from 'lucide-react';

export const TicketPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const booking = bookingId ? store.getBookingById(bookingId) : undefined;

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Ticket Not Found</h2>
        <p className="text-xs text-slate-500">The ticket reference requested could not be located.</p>
        <Link to="/" className="inline-block px-4 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-4">
      <div className="no-print">
        <Link
          to="/dashboard/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookings</span>
        </Link>
      </div>

      <PrintableTicket booking={booking} />
    </div>
  );
};

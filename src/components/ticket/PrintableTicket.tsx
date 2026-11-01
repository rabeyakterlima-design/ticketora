import React from 'react';
import { Booking } from '../../types';
import { formatBDT, formatDate, formatTime } from '../../lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { BrandLogo } from '../common/BrandLogo';
import { Printer, ShieldCheck, Phone, MapPin, Calendar, Clock, Bus, CheckCircle2 } from 'lucide-react';

interface PrintableTicketProps {
  booking: Booking;
}

export const PrintableTicket: React.FC<PrintableTicketProps> = ({ booking }) => {
  const handlePrint = () => {
    window.print();
  };

  const isCounter = booking.booking_channel === 'counter';

  return (
    <div className="space-y-4">
      {/* Print Action Bar (hidden on print) */}
      <div className="no-print flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-800">Confirmed Bus E-Ticket</h2>
          <p className="text-xs text-slate-500">
            Booking Reference: <span className="font-mono font-bold text-teal-700">{booking.booking_reference}</span>
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Ticket / PDF</span>
        </button>
      </div>

      {/* Main Printable Boarding Pass Container */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-md overflow-hidden text-slate-800 print:border-slate-800 print:shadow-none">
        {/* Ticket Header */}
        <div className="bg-[#142B4A] text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b-4 border-teal-500">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" variant="light" />
            <div className="border-l border-slate-600 pl-3">
              <span className="text-[10px] uppercase tracking-widest text-teal-300 font-bold block">
                Official E-Ticket & Boarding Pass
              </span>
              <span className="text-xs text-slate-300">
                Ticketora Central Transport Network
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>{booking.booking_status.toUpperCase()} • {booking.payment_status.toUpperCase()}</span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono mt-1">
              PNR: <strong className="text-white">{booking.booking_reference}</strong>
            </div>
          </div>
        </div>

        {/* Sub-header banner: Operator info & Counter stamp */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Bus className="w-4 h-4 text-teal-600" />
            <span>{booking.operator_name}</span>
            <span className="text-slate-400 font-normal">•</span>
            <span className="font-medium text-slate-600">{booking.bus_name}</span>
            <span className="text-slate-400 font-normal">•</span>
            <span className="font-mono text-slate-500">{booking.coach_type}</span>
          </div>

          <div>
            {isCounter ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 font-semibold border border-amber-200">
                Counter: {booking.counter_name || 'Physical Counter'} (Staff: {booking.booked_by_staff_name})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                Online E-Booking
              </span>
            )}
          </div>
        </div>

        {/* Journey & Seat Summary */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Route & Timing */}
          <div className="md:col-span-8 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  From (Origin)
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900">
                  {booking.origin_city}
                </span>
                <span className="text-xs text-slate-500 block truncate">
                  {booking.boarding_point}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  To (Destination)
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900">
                  {booking.destination_city}
                </span>
                <span className="text-xs text-slate-500 block truncate">
                  {booking.dropping_point}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Assigned Seats
                </span>
                <span className="text-base sm:text-lg font-mono font-black text-teal-700">
                  {booking.seat_numbers.join(', ')}
                </span>
                <span className="text-xs text-slate-500 block">
                  {booking.seat_numbers.length} Seat(s)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-teal-600 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">Journey Date</span>
                  <span className="text-sm font-bold text-slate-900">{formatDate(booking.journey_date)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-teal-600 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">Departure Time</span>
                  <span className="text-sm font-bold text-slate-900">{formatTime(booking.departure_time)}</span>
                  <span className="text-[10px] text-amber-700 block font-semibold">Report 20 mins prior</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-600 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">Boarding Terminal</span>
                  <span className="text-sm font-bold text-slate-900">{booking.boarding_point}</span>
                </div>
              </div>
            </div>

            {/* Passenger Manifest */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 flex justify-between">
                <span>Passenger Details</span>
                <span>Primary Contact: {booking.customer_phone}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {booking.passengers.map((p, idx) => (
                  <div key={idx} className="px-3 py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-200 font-mono font-bold rounded text-slate-800">
                        {p.seat_number}
                      </span>
                      <span className="font-semibold text-slate-900">{p.name}</span>
                      <span className="text-[11px] text-slate-400 capitalize">({p.gender})</span>
                    </div>
                    <span className="font-bold text-slate-700">{formatBDT(p.fare)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: QR Verification & Fare Slip */}
          <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 space-y-5 flex flex-col justify-between">
            {/* QR Verification Code */}
            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-center">
                <QRCodeSVG
                  value={`https://ticketora.com/ticket/${booking.id}?verify=${booking.qr_token}`}
                  size={120}
                  level="M"
                  includeMargin={true}
                  className="rounded-lg shadow-xs"
                />
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Scan for instant gate verification
              </div>
              <div className="text-[9px] text-slate-400 font-mono break-all">
                {booking.qr_token.substring(0, 24)}...
              </div>
            </div>

            {/* Fare Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Bus Fare:</span>
                <span className="font-medium">{formatBDT(booking.base_fare)}</span>
              </div>
              {booking.seat_adjustment > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Seat Upgrades:</span>
                  <span className="font-medium">+{formatBDT(booking.seat_adjustment)}</span>
                </div>
              )}
              {booking.service_fee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Service Fee:</span>
                  <span className="font-medium">+{formatBDT(booking.service_fee)}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-teal-700">{formatBDT(booking.total_fare)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Footer: Instructions & Support */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2 font-medium">
            <span className="flex items-center gap-1 text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Ticketora Verified Safe Travel Guarantee
            </span>
            <span className="flex items-center gap-1 font-bold text-slate-800">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              24/7 Helpline: 16299 / +880 9612-842538
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            * Please preserve this ticket or display the digital SMS/QR code on your phone during boarding. Baggage is carried at passenger's risk (up to 20kg free).
          </p>
        </div>
      </div>
    </div>
  );
};

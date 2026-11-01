import React from 'react';
import { formatBDT } from '../../lib/utils';
import { ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Transparent, fair guidelines for cancellations and refund processing.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              More than 24 hours prior
            </span>
            <div className="text-2xl font-black text-emerald-800">85% Refund</div>
            <p className="text-[11px] text-emerald-700">15% cancellation charge applies</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
              12 to 24 hours prior
            </span>
            <div className="text-2xl font-black text-amber-800">60% Refund</div>
            <p className="text-[11px] text-amber-700">40% cancellation charge applies</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">
              Less than 6 hours prior
            </span>
            <div className="text-2xl font-black text-rose-800">0% Non-Refundable</div>
            <p className="text-[11px] text-rose-700">No refunds after departure</p>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 pt-4 border-t border-slate-100">
          1. Cancellation Request Procedure
        </h3>
        <p>
          Customers may request ticket cancellation directly from their <strong>Customer Dashboard</strong> under "My Bookings" or in person at the assigned physical bus counter. To cancel, locate your booking reference and submit a cancellation request stating the reason.
        </p>

        <h3 className="text-base font-bold text-slate-900">
          2. Refund Disbursement
        </h3>
        <p>
          Approved refunds are processed through automated payment reversals. For bKash and Nagad payments, refunds are credited back to the originating mobile wallet number within 24–48 business hours. For counter cash payments, refunds are issued in cash upon surrendering the printed ticket.
        </p>

        <h3 className="text-base font-bold text-slate-900">
          3. Operator Service Disruptions
        </h3>
        <p>
          In the event of trip cancellation by the bus operator due to mechanical failure, natural disasters, or highway blockages, passengers are entitled to a 100% full refund with zero cancellation charges.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Governing rules for ticket reservations, passenger conduct, and platform usage.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-slate-900">1. Role of Ticketora</h3>
        <p>
          Ticketora provides centralized ticketing technology connecting passengers with licensed bus operators. Ticketora does not operate bus vehicles directly; bus departures, onboard amenities, and punctuality are maintained by the respective transport enterprise.
        </p>

        <h3 className="text-base font-bold text-slate-900">2. Reporting and Boarding Protocol</h3>
        <p>
          Passengers must report to the designated boarding counter at least 20 minutes prior to the scheduled departure time. Failure to report on time may result in forfeiture of the seat without eligibility for refund.
        </p>

        <h3 className="text-base font-bold text-slate-900">3. Luggage Allowance</h3>
        <p>
          Each passenger is allowed up to 20kg of personal luggage free of charge in the coach luggage boot. Hazardous, flammable, or contraband materials are strictly prohibited.
        </p>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          How Ticketora protects and handles your personal data.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-slate-900">1. Data Minimization & Collection</h3>
        <p>
          We only collect personal information required for ticket issuance, government passenger manifest compliance, and payment verification (such as Passenger Name, Phone Number, and Boarding Station).
        </p>

        <h3 className="text-base font-bold text-slate-900">2. Financial Data Protection</h3>
        <p>
          Ticketora never stores credit card CVV, card numbers, or mobile financial service PINs. All financial transactions are processed securely through certified payment gateways.
        </p>
      </div>
    </div>
  );
};

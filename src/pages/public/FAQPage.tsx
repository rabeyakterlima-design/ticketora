import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Ticketora ensure my seat is not double-booked?',
      a: 'Ticketora uses centralized database transactions with atomic seat locks. When you select a seat, an exclusive 5-minute hold is immediately established across all online browsers and physical terminal counter POS screens. No other passenger or counter clerk can select that seat while your hold is active.',
    },
    {
      q: 'How do I board the bus using an E-Ticket?',
      a: 'Once your booking is confirmed, you will receive an SMS and a digital boarding pass with a secure 2D QR code. You do not need to print paper—simply display the ticket or SMS on your phone at the boarding counter or to the bus conductor.',
    },
    {
      q: 'What is Ticketora’s ticket cancellation and refund policy?',
      a: 'You can cancel eligible bookings directly from your customer dashboard or at the bus counter up to 6 hours before departure. Cancellations made 24+ hours in advance receive an 85% refund; cancellations between 12-24 hours receive a 60% refund. Refunds are reversed directly to your original bKash, Nagad, or bank card within 24-48 business hours.',
    },
    {
      q: 'Can I purchase tickets at physical bus terminal counters?',
      a: 'Yes! Physical bus counters powered by Ticketora POS terminals sell the exact same real-time inventory. You can purchase tickets with Cash, receive an official thermal printed ticket, and verify it online at any time.',
    },
    {
      q: 'What is the maximum number of seats I can book in one order?',
      a: 'To prevent bulk scalping and ensure fair passenger availability, a maximum of 4 seats can be reserved per booking.',
    },
    {
      q: 'Which payment methods are accepted on Ticketora?',
      a: 'We accept bKash, Nagad, Rocket, Upay, Visa, MasterCard, and American Express via 256-bit SSL encrypted gateways. Cash is accepted at physical bus counters.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Everything you need to know about booking, bus terminals, seat holds, and cancellations.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs divide-y divide-slate-100">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-4">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-slate-900 gap-4"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-teal-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed animate-in fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Bus, Store, ShieldCheck, Smartphone, Printer, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ServicesPage: React.FC = () => {
  const services = [
    {
      title: 'Online Ticket Booking Portal',
      desc: 'Intuitive web booking engine with instant 2+2, 2+1, and sleeper coach seat map visuals, transparent pricing, and instant SMS/QR confirmations.',
      icon: Smartphone,
    },
    {
      title: 'Bus Counter POS Terminals',
      desc: 'Rapid physical ticketing interface designed for terminal counter clerks. Supports cash payment tracking, shift opening/closing, and thermal ticket reprinting.',
      icon: Store,
    },
    {
      title: 'Operator Fleet Management',
      desc: 'End-to-end coach management, custom seat layout editor, route creation, scheduling, driver manifests, and dynamic pricing.',
      icon: Bus,
    },
    {
      title: 'Verifiable Digital Boarding Passes',
      desc: 'High-security boarding tickets featuring 2D encrypted QR codes for instant conductor and terminal gate verification without internet connectivity.',
      icon: Printer,
    },
    {
      title: 'Cancellation & Policy-Based Refunds',
      desc: 'Automated refund calculation according to travel time cutoffs (85% >24h, 60% >12h) with direct reversals to passenger bKash or Nagad accounts.',
      icon: ShieldCheck,
    },
    {
      title: '24/7 Dedicated Support Center',
      desc: 'Around-the-clock telephone and live customer support on shortcode 16299, assisting passengers with seat inquiries and departure schedules.',
      icon: Headphones,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Our Transportation Services
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
          Comprehensive digital solutions built specifically for passengers, counter operators, and bus enterprise administrators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-teal-600 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl shadow-teal-600/20">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to travel with Ticketora?</h2>
        <p className="text-xs sm:text-sm text-teal-100 max-w-xl mx-auto">
          Choose from over 50 daily departures from Dhaka to Cox's Bazar, Chattogram, Sylhet, and beyond.
        </p>
        <div className="pt-2">
          <Link
            to="/search"
            className="inline-block px-8 py-3.5 bg-white text-teal-800 font-extrabold rounded-xl text-sm shadow-md hover:bg-slate-100 transition-colors"
          >
            Search Available Buses
          </Link>
        </div>
      </div>
    </div>
  );
};

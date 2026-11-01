import React from 'react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { ShieldCheck, Bus, Store, Users, Award, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <BrandLogo size="lg" className="mx-auto" />
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Your Journey, Our Priority.
        </h1>
        <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
          Ticketora was founded to eliminate the chaos of bus terminal queues, double-booked seats, and fragmented operations across Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Bus className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Unified Fleet Management</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Connecting leading operators—Green Line, Hanif, Shyamoli, and Shohagh—under one high-availability centralized inventory.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">High-Rush Terminal Counters</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Giving physical bus counter staff dedicated POS terminals with automated cash balancing, shift reconciliations, and instant thermal printing.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Absolute Seat Integrity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Eliminating double-booking using PostgreSQL transaction isolation, optimistic locking, and expiring seat hold countdowns.
          </p>
        </div>
      </div>

      {/* Corporate Info */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl font-bold">Operating Across Bangladesh</h2>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Headquartered in Gulshan, Dhaka, Ticketora provides transportation technology infrastructure connecting over 64 districts with digital precision.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-slate-800 text-xs">
          <div>
            <div className="text-2xl font-black text-teal-400">10+</div>
            <div className="text-slate-400 mt-0.5">Top Operators</div>
          </div>
          <div>
            <div className="text-2xl font-black text-teal-400">50+</div>
            <div className="text-slate-400 mt-0.5">Inter-City Terminals</div>
          </div>
          <div>
            <div className="text-2xl font-black text-teal-400">100%</div>
            <div className="text-slate-400 mt-0.5">Inventory Sync</div>
          </div>
          <div>
            <div className="text-2xl font-black text-teal-400">24/7</div>
            <div className="text-slate-400 mt-0.5">Helpline Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

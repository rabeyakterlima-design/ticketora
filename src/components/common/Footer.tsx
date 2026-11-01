import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Phone, Mail, MapPin, Bus, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="no-print bg-[#0B1F3A] text-slate-300 border-t border-slate-800">
      {/* Top Banner Feature Bar */}
      <div className="border-b border-slate-800/80 bg-[#142B4A]/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Secure Booking</h4>
                <p className="text-xs text-slate-400">Encrypted payment & verified inventory</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Live Seat Inventory</h4>
                <p className="text-xs text-slate-400">Shared real-time online & counter holds</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">24/7 Helpline 16299</h4>
                <p className="text-xs text-slate-400">Dedicated passenger support team</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Top Bus Operators</h4>
                <p className="text-xs text-slate-400">Green Line, Hanif, Shyamoli & Shohagh</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" variant="light" />
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Ticketora is Bangladesh's complete digital bus ticket booking, bus counter management, operator administration, and centralized inventory platform.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Plot 12, Road 4, Gulshan-1, Dhaka-1212, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+880 9612-842538 / Emergency: 16299</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@ticketora.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/search" className="hover:text-teal-400 transition-colors">
                  Search Bus Tickets
                </Link>
              </li>
              <li>
                <Link to="/track-booking" className="hover:text-teal-400 transition-colors">
                  Track Your Booking
                </Link>
              </li>
              <li>
                <Link to="/counter" className="hover:text-teal-400 transition-colors">
                  Counter POS Terminal
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">
                  About Ticketora
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-400 transition-colors">
                  Operator & Passenger Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Routes */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Popular Routes
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>Dhaka ➔ Cox's Bazar AC</li>
              <li>Dhaka ➔ Chattogram Express</li>
              <li>Dhaka ➔ Sylhet Luxury</li>
              <li>Dhaka ➔ Rajshahi AC</li>
              <li>Dhaka ➔ Khulna (Padma Bridge)</li>
              <li>Chattogram ➔ Dhaka Return</li>
            </ul>
          </div>

          {/* Legal & Payment */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Policies & Payment
            </h3>
            <ul className="space-y-2.5 text-xs mb-5">
              <li>
                <Link to="/terms" className="hover:text-teal-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-teal-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-teal-400 transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-teal-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                Supported Gateways
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold font-mono">
                <span className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800">
                  bKash
                </span>
                <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800">
                  Nagad
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Rocket
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Cards / MFS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-[#071527] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Ticketora Technologies Ltd. All rights reserved. Registered in Bangladesh.</p>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>Currency: BDT (৳)</span>
            <span>Timezone: Asia/Dhaka</span>
            <span>Version 2.0 Production</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

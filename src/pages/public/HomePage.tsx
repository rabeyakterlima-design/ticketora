import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchCard } from '../../components/booking/SearchCard';
import { store } from '../../services/store';
import { formatBDT } from '../../lib/utils';
import heroBannerImg from '../../assets/hero-banner.jpg';
import {
  Ticket,
  Store,
  Armchair,
  CreditCard,
  FileText,
  Clock,
  Ban,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  PhoneCall,
  Star,
  Bus,
  MapPin,
  Calendar,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const routes = store.getRoutes().slice(0, 6);

  const features = [
    { title: 'Online Bus Ticket Booking', icon: Ticket, desc: 'Instant 24/7 booking from any mobile or desktop browser.' },
    { title: 'Counter Ticket Booking', icon: Store, desc: 'Integrated POS interface for physical bus terminal counters.' },
    { title: 'Interactive Seat Selection', icon: Armchair, desc: 'Live visual seat maps for 2+2, 2+1 and sleeper coaches.' },
    { title: 'Secure Payment', icon: CreditCard, desc: 'Supports bKash, Nagad, Rocket, Cards & Cash on counter.' },
    { title: 'E-Ticket Generation', icon: FileText, desc: 'Printable boarding pass with secure QR verification code.' },
    { title: 'Booking History', icon: Clock, desc: 'Track all past, present, and upcoming trips with ease.' },
    { title: 'Cancel Booking', icon: Ban, desc: 'Self-service cancellation and policy-based refund processing.' },
    { title: 'Reports & Analytics', icon: BarChart3, desc: 'Occupancy reports, gross sales, and net revenue audit trails.' },
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0B1F3A] via-[#142B4A] to-[#203D60] text-white pt-8 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          {/* Main Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>Bangladesh's Complete Bus Booking Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Book Bus Tickets Easily & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-amber-300">
                Travel Smartly.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Online and Counter Ticket Booking, with Complete Bus Management Solution. Your journey, our priority.
            </p>
          </div>

          {/* Booking Search Card */}
          <div className="max-w-4xl mx-auto">
            <SearchCard />
          </div>

          {/* Hero Banner Visual Showcase */}
          <div className="max-w-5xl mx-auto pt-6">
            <div className="rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900/40">
              <img
                src={heroBannerImg}
                alt="Ticketora Bus & Platform Showcase"
                className="w-full h-auto object-cover max-h-[460px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8 Features Grid (From the Flyer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Engineered for Modern Transportation
          </h2>
          <p className="text-sm text-slate-600">
            A centralized seat inventory shared instantly between online passengers and physical bus counter staff.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-500 transition-all group space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* For Customers, For Counter Staff, For Admin Section (From Flyer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* For Customers */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                <Ticket className="w-3.5 h-3.5" /> For Passengers
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Book your tickets in just a few clicks!
              </h3>
              <p className="text-xs text-slate-600">
                Enjoy hassle-free seat selection, instant mobile financial payment, and verified digital boarding passes.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Search & book nationwide bus routes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Choose your favorite window or aisle seat</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Make secure payment via bKash, Nagad or Cards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Download or print verifiable E-Ticket</span>
                </li>
              </ul>
            </div>
            <Link
              to="/search"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Search Buses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* For Counter Staff */}
          <div className="bg-white rounded-3xl p-6 border-2 border-teal-500 shadow-md flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3 right-6 bg-teal-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              High Speed POS
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700">
                <Store className="w-3.5 h-3.5" /> For Counter Staff
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Manage bookings directly from the counter!
              </h3>
              <p className="text-xs text-slate-600">
                Designed for high-rush bus terminals. Sell tickets in seconds, accept cash, and print thermal tickets.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Fast terminal ticket sales with cash calculator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Real-time seat availability synced with online web</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Manage shift opening/closing cash settlements</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>1-click ticket reprint for lost passenger tickets</span>
                </li>
              </ul>
            </div>
            <Link
              to="/counter"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>Launch Counter POS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* For Admin */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
                <BarChart3 className="w-3.5 h-3.5" /> For Operators & Admins
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Take full control with powerful dashboard!
              </h3>
              <p className="text-xs text-slate-600">
                Manage multi-tenant bus operators, fleets, custom 2+2 & sleeper seat layouts, schedules, and analytics.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Manage buses, routes, and automated schedules</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Track gross sales, net revenue & occupancy reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Configure physical counters, managers & staff shifts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Full audit logs and PostgreSQL RLS security</span>
                </li>
              </ul>
            </div>
            <Link
              to="/admin"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Open Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Popular Bus Routes
            </h2>
            <p className="text-sm text-slate-500">
              Top highway corridors across Bangladesh with daily frequent departures.
            </p>
          </div>
          <Link
            to="/search"
            className="text-xs sm:text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>Explore All Routes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {routes.map((rt) => {
            const originCity = rt.origin_station?.city || 'Dhaka';
            const destCity = rt.destination_station?.city || "Cox's Bazar";
            const startingFare = originCity === 'Dhaka' && destCity === "Cox's Bazar" ? 900 : 550;

            return (
              <div
                key={rt.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-teal-700">{rt.distance_km} km highway</span>
                    <span>~{Math.floor(rt.estimated_duration_minutes / 60)} hrs travel</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>{originCity}</span>
                    <ArrowRight className="w-4 h-4 text-teal-600" />
                    <span>{destCity}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{rt.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Fares starting</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {formatBDT(startingFare)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams({
                        origin: originCity,
                        destination: destCity,
                        date: '2026-10-31',
                      });
                      navigate(`/search?${params.toString()}`);
                    }}
                    className="px-4 py-2 bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    View Buses
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Trust Guarantee Bar (As seen in the flyer!) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#142B4A] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
              <span className="font-bold">Secure & Reliable</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-400 shrink-0" />
              <span className="font-bold">Fast & Easy Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-teal-400 shrink-0" />
              <span className="font-bold">24/7 Hotline 16299</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="font-bold">Trusted by Thousands</span>
            </div>
          </div>

          <Link
            to="/search"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-xl text-sm shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Get Started Today</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

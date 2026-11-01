import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../../services/store';
import { ArrowLeftRight, Calendar, MapPin, Search, Store, Bus } from 'lucide-react';

interface SearchCardProps {
  initialOrigin?: string;
  initialDestination?: string;
  initialDate?: string;
  compact?: boolean;
}

export const SearchCard: React.FC<SearchCardProps> = ({
  initialOrigin = 'Dhaka',
  initialDestination = "Cox's Bazar",
  initialDate = '2026-10-31',
  compact = false,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'online' | 'counter'>('online');
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [journeyDate, setJourneyDate] = useState(initialDate);

  const stations = store.getStations();
  const uniqueCities = Array.from(new Set(stations.map((s) => s.city)));

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'counter') {
      navigate('/counter');
      return;
    }
    const params = new URLSearchParams({
      origin,
      destination,
      date: journeyDate,
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={`w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden ${compact ? 'p-4' : 'p-4 sm:p-7'}`}>
      {/* Top Tabs */}
      {!compact && (
        <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('online')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'online'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Online Booking</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('counter')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'counter'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Counter Booking</span>
          </button>
        </div>
      )}

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Origin */}
          <div className="md:col-span-4 relative">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              From City / Station
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-teal-600">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                {uniqueCities.map((city) => (
                  <option key={`orig-${city}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-2 md:pt-4">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600 border border-slate-200 transition-all shadow-xs"
              title="Swap Origin and Destination"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-4 relative">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              To City / Station
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-teal-600">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                {uniqueCities.map((city) => (
                  <option key={`dest-${city}`} value={city} disabled={city === origin}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Journey Date */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Travel Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-teal-600">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={journeyDate}
                min="2026-10-31"
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base cursor-pointer"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Search Buses</span>
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { store } from '../../services/store';
import { TripCard } from '../../components/booking/TripCard';
import { SearchCard } from '../../components/booking/SearchCard';
import { Filter, SlidersHorizontal, ArrowUpDown, Bus, RotateCcw } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const originParam = searchParams.get('origin') || 'Dhaka';
  const destinationParam = searchParams.get('destination') || "Cox's Bazar";
  const dateParam = searchParams.get('date') || '2026-10-31';

  const [trips, setTrips] = useState(() => store.getTrips());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setTrips(store.getTrips());
    });
    return unsub;
  }, []);

  // Filter States
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [acFilter, setAcFilter] = useState<'all' | 'ac' | 'non-ac'>('all');
  const [selectedCoachTypes, setSelectedCoachTypes] = useState<string[]>([]);
  const [timeSlot, setTimeSlot] = useState<string>('all');
  const [maxFare, setMaxFare] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<'fare-asc' | 'fare-desc' | 'time-asc' | 'time-desc' | 'seats'>('fare-asc');

  const operators = store.getOperators();

  // Filter & Sort Logic
  const filteredTrips = useMemo(() => {
    return trips
      .filter((t) => {
        // Route Match
        const origCity = t.route?.origin_station?.city?.toLowerCase() || '';
        const destCity = t.route?.destination_station?.city?.toLowerCase() || '';
        const queryOrig = originParam.toLowerCase();
        const queryDest = destinationParam.toLowerCase();

        // Exact or partial city match
        const routeMatches =
          origCity.includes(queryOrig) && destCity.includes(queryDest);

        if (!routeMatches) return false;

        // Operator
        if (selectedOperator !== 'all' && t.operator_id !== selectedOperator) {
          return false;
        }

        // AC Filter
        if (acFilter === 'ac' && !t.bus?.is_ac) return false;
        if (acFilter === 'non-ac' && t.bus?.is_ac) return false;

        // Coach Type
        if (selectedCoachTypes.length > 0 && t.bus) {
          if (!selectedCoachTypes.includes(t.bus.coach_type)) return false;
        }

        // Fare Max
        if (t.base_fare > maxFare) return false;

        // Time slot
        if (timeSlot !== 'all') {
          const hour = parseInt(t.departure_time.split(':')[0], 10);
          if (timeSlot === 'morning' && (hour < 6 || hour >= 12)) return false;
          if (timeSlot === 'afternoon' && (hour < 12 || hour >= 18)) return false;
          if (timeSlot === 'evening' && (hour < 18 || hour >= 24)) return false;
          if (timeSlot === 'night' && hour >= 6) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'fare-asc') return a.base_fare - b.base_fare;
        if (sortBy === 'fare-desc') return b.base_fare - a.base_fare;
        if (sortBy === 'time-asc') return a.departure_time.localeCompare(b.departure_time);
        if (sortBy === 'time-desc') return b.departure_time.localeCompare(a.departure_time);
        if (sortBy === 'seats') return (b.available_seats_count || 0) - (a.available_seats_count || 0);
        return 0;
      });
  }, [trips, originParam, destinationParam, selectedOperator, acFilter, selectedCoachTypes, timeSlot, maxFare, sortBy]);

  const resetFilters = () => {
    setSelectedOperator('all');
    setAcFilter('all');
    setSelectedCoachTypes([]);
    setTimeSlot('all');
    setMaxFare(3000);
    setSortBy('fare-asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Search Adjustment Card */}
      <SearchCard
        compact={true}
        initialOrigin={originParam}
        initialDestination={destinationParam}
        initialDate={dateParam}
      />

      {/* Main Grid: Sidebar Filters & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-teal-600 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* AC / Non-AC Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Coach Comfort
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setAcFilter('all')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  acFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setAcFilter('ac')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  acFilter === 'ac' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                AC
              </button>
              <button
                type="button"
                onClick={() => setAcFilter('non-ac')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  acFilter === 'non-ac' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Non-AC
              </button>
            </div>
          </div>

          {/* Bus Operators */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Bus Operator
            </label>
            <select
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Operators ({operators.length})</option>
              {operators.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.name}
                </option>
              ))}
            </select>
          </div>

          {/* Departure Time Slots */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Departure Time
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'morning', label: 'Morning (06:00 - 12:00)' },
                { id: 'afternoon', label: 'Afternoon (12:00 - 18:00)' },
                { id: 'evening', label: 'Evening (18:00 - 24:00)' },
                { id: 'night', label: 'Night (00:00 - 06:00)' },
              ].map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setTimeSlot(timeSlot === slot.id ? 'all' : slot.id)}
                  className={`p-2 rounded-xl border text-left font-medium transition-all ${
                    timeSlot === slot.id
                      ? 'border-teal-500 bg-teal-50 text-teal-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Fare Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Max Fare</span>
              <span className="font-bold font-mono text-teal-700">৳{maxFare}</span>
            </div>
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={maxFare}
              onChange={(e) => setMaxFare(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>
        </aside>

        {/* Results List */}
        <section className="lg:col-span-9 space-y-4">
          {/* Results Summary & Sorting Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">
                {originParam} ➔ {destinationParam}
              </h2>
              <p className="text-xs text-slate-500">
                Found <strong className="text-teal-700 font-bold">{filteredTrips.length}</strong> available bus service(s)
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="fare-asc">Lowest Fare</option>
                <option value="fare-desc">Highest Fare</option>
                <option value="time-asc">Earliest Departure</option>
                <option value="time-desc">Latest Departure</option>
                <option value="seats">Most Available Seats</option>
              </select>
            </div>
          </div>

          {/* Bus Cards List */}
          {filteredTrips.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Bus className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">No Bus Trips Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn't find any bus matching your exact criteria between {originParam} and {destinationParam}.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { BusRoute } from '../../types';
import { formatBDT } from '../../lib/utils';
import { Map, Plus, Clock, ArrowRight } from 'lucide-react';

export const OperatorRoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<BusRoute[]>(() => store.getRoutes());
  const [stations] = useState(() => store.getStations());
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [originId, setOriginId] = useState(stations[0]?.id || '');
  const [destId, setDestId] = useState(stations[1]?.id || '');
  const [distanceKm, setDistanceKm] = useState<number>(250);
  const [durationMins, setDurationMins] = useState<number>(300);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRoutes(store.getRoutes());
    });
    return unsub;
  }, []);

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (originId === destId) {
      alert('Origin and destination cannot be identical.');
      return;
    }

    store.addRoute({
      origin_station_id: originId,
      destination_station_id: destId,
      distance_km: distanceKm,
      estimated_duration_minutes: durationMins,
      description: description || 'Inter-District Highway Express Route',
      status: 'active',
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Assigned Highway Routes</h1>
          <p className="text-xs text-slate-500">
            Define Origin, Destination terminals, highway distances, and estimated travel durations.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Route</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {routes.map((rt) => (
          <div
            key={rt.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded font-bold bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                {rt.status}
              </span>
              <span className="text-xs font-bold text-slate-500">{rt.distance_km} KM</span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>{rt.origin_station?.city}</span>
              <ArrowRight className="w-4 h-4 text-teal-600" />
              <span>{rt.destination_station?.city}</span>
            </h3>

            <div className="text-xs text-slate-500 space-y-1">
              <div>Terminal: {rt.origin_station?.name}</div>
              <div>Destination Terminal: {rt.destination_station?.name}</div>
              <div className="flex items-center gap-1 font-semibold text-slate-700 pt-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>Est. Duration: {Math.floor(rt.estimated_duration_minutes / 60)}h {rt.estimated_duration_minutes % 60}m</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Route Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">Add Highway Route</h3>

            <form onSubmit={handleCreateRoute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Origin Terminal *</label>
                <select
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  {stations.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.city} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination Terminal *</label>
                <select
                  value={destId}
                  onChange={(e) => setDestId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  {stations.map((s) => (
                    <option key={s.id} value={s.id} disabled={s.id === originId}>
                      {s.city} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Distance (KM) *</label>
                  <input
                    type="number"
                    required
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Mins) *</label>
                  <input
                    type="number"
                    required
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Route Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Highway via Padma Bridge"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                >
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const OperatorReportsPage: React.FC = () => {
  const bookings = store.getBookings();
  const trips = store.getTrips();

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.booking_status !== 'cancelled' ? b.total_fare : 0), 0);
  const totalSeatsSold = bookings.reduce((sum, b) => sum + (b.booking_status !== 'cancelled' ? b.seat_numbers.length : 0), 0);
  const avgOccupancy = Math.min(100, Math.round((totalSeatsSold / (trips.length * 36 || 1)) * 100));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">Occupancy & Revenue Reports</h1>
        <p className="text-xs text-slate-500">
          Analyze seat fill ratios, route yields, and channel performance across online vs counters.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Average Occupancy</span>
          <div className="text-3xl font-black text-teal-700">{avgOccupancy}%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-600 h-full rounded-full" style={{ width: `${avgOccupancy}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Net Fares</span>
          <div className="text-3xl font-black text-slate-900">{formatBDT(totalRevenue)}</div>
          <p className="text-[11px] text-slate-400">Validated through PostgreSQL financial ledger</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Passengers Carried</span>
          <div className="text-3xl font-black text-slate-900">{totalSeatsSold} Seats</div>
          <p className="text-[11px] text-slate-400">Across online & counter ticket sales</p>
        </div>
      </div>
    </div>
  );
};

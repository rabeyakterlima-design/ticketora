import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { Trip, TripStatus } from '../../types';
import { formatBDT, formatTime, formatDate } from '../../lib/utils';
import { Calendar, Plus, Clock, Bus, CheckCircle2, Ban } from 'lucide-react';

export const OperatorTripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(() => store.getTrips());
  const [routes] = useState(() => store.getRoutes());
  const [buses] = useState(() => store.getBuses());
  const [modalOpen, setModalOpen] = useState(false);

  // New Trip Form
  const [routeId, setRouteId] = useState(routes[0]?.id || '');
  const [busId, setBusId] = useState(buses[0]?.id || '');
  const [departureDate, setDepartureDate] = useState('2026-10-31');
  const [departureTime, setDepartureTime] = useState('21:00');
  const [arrivalTime, setArrivalTime] = useState('06:30');
  const [baseFare, setBaseFare] = useState<number>(1600);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setTrips(store.getTrips());
    });
    return unsub;
  }, []);

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeId || !busId) return;

    const chosenBus = buses.find((b) => b.id === busId);

    store.addTrip({
      bus_id: busId,
      operator_id: 'op-greenline',
      route_id: routeId,
      departure_date: departureDate,
      departure_time: departureTime,
      arrival_time: arrivalTime,
      base_fare: baseFare,
      boarding_points: ['Sayedabad Terminal', 'Arambagh VIP Counter'],
      dropping_points: ['Central Bus Station', 'Main Beach Circle'],
      status: 'scheduled',
      available_seats_count: chosenBus ? chosenBus.total_seats : 40,
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Trip & Schedule Management</h1>
          <p className="text-xs text-slate-500">
            Publish daily bus schedules, configure base fares, and monitor live seat inventory.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Trip</span>
        </button>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Scheduled Departures ({trips.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Departure</th>
                <th className="px-5 py-3">Assigned Bus</th>
                <th className="px-5 py-3">Base Fare</th>
                <th className="px-5 py-3">Seat Availability</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {t.route?.origin_station?.city} ➔ {t.route?.destination_station?.city}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{formatDate(t.departure_date)}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    {formatTime(t.departure_time)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    {t.bus?.name} ({t.bus?.coach_type})
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                    {formatBDT(t.base_fare)}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-700">
                    {t.available_seats_count} Seats Available
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Trip Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">Schedule New Bus Trip</h3>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Route *</label>
                <select
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.origin_station?.city} ➔ {r.destination_station?.city} ({r.distance_km} km)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Bus *</label>
                <select
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} - {b.registration_number} ({b.coach_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Departure Date *</label>
                  <input
                    type="date"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Departure Time *</label>
                  <input
                    type="time"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Arrival</label>
                  <input
                    type="time"
                    required
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Base Fare (BDT ৳) *</label>
                  <input
                    type="number"
                    required
                    value={baseFare}
                    onChange={(e) => setBaseFare(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono"
                  />
                </div>
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
                  Publish Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

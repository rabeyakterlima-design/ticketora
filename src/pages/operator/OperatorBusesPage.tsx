import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { Bus, CoachType } from '../../types';
import { Bus as BusIcon, Plus, CheckCircle2, AlertTriangle, ShieldCheck, Wrench } from 'lucide-react';

export const OperatorBusesPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>(() => store.getBuses());
  const [layouts] = useState(() => store.getLayouts());
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [coachType, setCoachType] = useState<CoachType>('AC Deluxe');
  const [isAc, setIsAc] = useState(true);
  const [layoutId, setLayoutId] = useState(layouts[0]?.id || '');
  const [model, setModel] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBuses(store.getBuses());
    });
    return unsub;
  }, []);

  const handleCreateBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !registrationNumber.trim()) return;

    const chosenLayout = layouts.find((l) => l.id === layoutId);
    const totalSeats = chosenLayout ? chosenLayout.total_seats : 40;

    store.addBus({
      operator_id: 'op-greenline',
      operator_name: 'Green Line Paribahan',
      name,
      registration_number: registrationNumber.toUpperCase(),
      coach_type: coachType,
      is_ac: isAc,
      total_seats: totalSeats,
      layout_id: layoutId,
      amenities: ['Air Conditioning', 'WiFi', 'Charging Ports', 'Water'],
      model: model || 'Scania Touring',
      status: 'active',
    });

    setModalOpen(false);
    setName('');
    setRegistrationNumber('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Bus Fleet Management</h1>
          <p className="text-xs text-slate-500">
            Configure bus vehicles, registration identifiers, amenities, and seat layout assignments.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Bus</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {buses.map((bus) => (
          <div
            key={bus.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold">
                  <BusIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{bus.name}</h3>
                  <span className="font-mono text-xs text-slate-500">{bus.registration_number}</span>
                </div>
              </div>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  bus.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {bus.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Coach Type</span>
                <span className="font-bold text-slate-900">{bus.coach_type}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Capacity</span>
                <span className="font-bold text-teal-700">{bus.total_seats} Seats</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">AC Status</span>
                <span className="font-semibold text-slate-800">{bus.is_ac ? 'Air Conditioned' : 'Non-AC'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Chassis / Model</span>
                <span className="font-medium text-slate-600 truncate block">{bus.model || 'Standard'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1">
              {bus.amenities?.slice(0, 3).map((a) => (
                <span key={a} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                  {a}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Bus Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">Add New Bus Vehicle</h3>

            <form onSubmit={handleCreateBus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bus Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Green Line Scania Express #4"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registration Number (Bangladesh BRTA) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DHAKA METRO-BA-15-9988"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Coach Type</label>
                  <select
                    value={coachType}
                    onChange={(e) => setCoachType(e.target.value as CoachType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="AC Deluxe">AC Deluxe</option>
                    <option value="Non-AC">Non-AC</option>
                    <option value="Business Class AC">Business Class AC</option>
                    <option value="Sleeper Coach AC">Sleeper Coach AC</option>
                    <option value="Double Decker AC">Double Decker AC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seat Layout</label>
                  <select
                    value={layoutId}
                    onChange={(e) => setLayoutId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    {layouts.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isAcCheck"
                  checked={isAc}
                  onChange={(e) => setIsAc(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="isAcCheck" className="text-xs font-bold text-slate-700">
                  Air Conditioned Vehicle
                </label>
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
                  Save Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

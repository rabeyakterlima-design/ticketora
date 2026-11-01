import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { Station } from '../../types';
import { MapPin, Plus, Phone, CheckCircle2 } from 'lucide-react';

export const AdminStationsPage: React.FC = () => {
  const [stations, setStations] = useState<Station[]>(() => store.getStations());
  const [modalOpen, setModalOpen] = useState(false);

  // New Station Form
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('+88017');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setStations(store.getStations());
    });
    return unsub;
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return;

    store.addStation({
      name,
      city,
      district: district || city,
      address,
      contact_number: contactNumber,
      status: 'active',
    });

    setModalOpen(false);
    setName('');
    setCity('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Terminals & Stations Registry
          </h1>
          <p className="text-xs text-slate-500">
            Official bus terminals, inter-district counter hubs, and GPS boarding points.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Terminal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stations.map((st) => (
          <div key={st.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded font-bold bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                {st.city}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold uppercase">{st.status}</span>
            </div>

            <h3 className="font-bold text-base text-slate-900">{st.name}</h3>

            <div className="space-y-1 text-xs text-slate-500">
              <div>District: {st.district}</div>
              <div className="truncate">Address: {st.address}</div>
              <div className="flex items-center gap-1 font-mono text-slate-700 pt-1">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>{st.contact_number || '+880 9612-842538'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Station Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">Add Terminal / Bus Station</h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Terminal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohakhali Inter-District Terminal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    placeholder="e.g. Dhaka"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address Location</label>
                <input
                  type="text"
                  placeholder="e.g. Mohakhali Main Road, Dhaka"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Station Counter Hotline</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
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
                  Save Terminal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

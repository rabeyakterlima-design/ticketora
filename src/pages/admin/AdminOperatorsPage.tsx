import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { BusOperator } from '../../types';
import { Building2, Plus, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export const AdminOperatorsPage: React.FC = () => {
  const [operators, setOperators] = useState<BusOperator[]>(() => store.getOperators());
  const [modalOpen, setModalOpen] = useState(false);

  // New Operator Form
  const [name, setName] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('+88017');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setOperators(store.getOperators());
    });
    return unsub;
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    store.addOperator({
      name,
      registration_no: registrationNo || `REG-BD-${Math.floor(10000 + Math.random() * 90000)}`,
      contact_person: contactPerson,
      phone,
      email,
      address,
      description,
      status: 'active',
    });

    setModalOpen(false);
    setName('');
  };

  const handleToggleStatus = (op: BusOperator) => {
    const nextStatus = op.status === 'active' ? 'suspended' : 'active';
    store.updateOperator(op.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Bus Operators Directory</h1>
          <p className="text-xs text-slate-500">
            Registered transport enterprises, business registration numbers, and operational licensing.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Operator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {operators.map((op) => (
          <div key={op.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-teal-400 font-bold flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{op.name}</h3>
                  <span className="font-mono text-xs text-slate-500">{op.registration_no}</span>
                </div>
              </div>

              <button
                onClick={() => handleToggleStatus(op)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors cursor-pointer ${
                  op.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {op.status}
              </button>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{op.description}</p>

            <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Contact Person:</span>
                <span>{op.contact_person}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>{op.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span>{op.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span className="truncate">{op.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Operator Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">Register New Bus Operator</h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Operator Enterprise Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shyamoli NR Travels"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">BRTA Registration No</label>
                  <input
                    type="text"
                    placeholder="e.g. REG-SN-99001"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Md. Shafiul Islam"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="contact@operator.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Head Office Address</label>
                <input
                  type="text"
                  placeholder="e.g. Sayedabad Bus Stand, Dhaka"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
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
                  Save Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

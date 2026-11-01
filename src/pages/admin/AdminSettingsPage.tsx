import React, { useState } from 'react';
import { store } from '../../services/store';
import { SystemSettings } from '../../types';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(() => store.getSettings());
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof SystemSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Global System Settings
        </h1>
        <p className="text-xs text-slate-500">
          Configure platform branding, hold timeout duration, service charges, and refund policies.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Brand Settings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            Platform Identity & Support
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.website_name}
                onChange={(e) => handleChange('website_name', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Main Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Hotline</label>
              <input
                type="text"
                value={settings.emergency_hotline}
                onChange={(e) => handleChange('emergency_hotline', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Support Phone</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Booking & Inventory Rules */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            Seat Inventory & Booking Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Seat Hold Duration (Seconds)
              </label>
              <input
                type="number"
                value={settings.seat_hold_duration_seconds}
                onChange={(e) => handleChange('seat_hold_duration_seconds', Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono"
              />
              <span className="text-[10px] text-slate-400">Default: 300s (5 mins)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Max Seats Per Booking
              </label>
              <input
                type="number"
                value={settings.max_seats_per_booking}
                onChange={(e) => handleChange('max_seats_per_booking', Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono"
              />
              <span className="text-[10px] text-slate-400">Default: 4 seats</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Online Service Fee (%)
              </label>
              <input
                type="number"
                value={settings.service_charge_percent}
                onChange={(e) => handleChange('service_charge_percent', Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono"
              />
              <span className="text-[10px] text-slate-400">Default: 2% (0% for counter POS)</span>
            </div>
          </div>
        </div>

        {/* Refund Policy Rules */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            Cancellation & Refund Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Refund &gt; 24h Before Departure (%)
              </label>
              <input
                type="number"
                value={settings.refund_above_24h_percent}
                onChange={(e) => handleChange('refund_above_24h_percent', Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Refund 12h–24h Before Departure (%)
              </label>
              <input
                type="number"
                value={settings.refund_12_to_24h_percent}
                onChange={(e) => handleChange('refund_12_to_24h_percent', Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cancellation Cutoff (Hours)
              </label>
              <input
                type="number"
                value={settings.cancellation_cutoff_hours}
                onChange={(e) => handleChange('cancellation_cutoff_hours', Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono"
              />
              <span className="text-[10px] text-slate-400">Non-refundable after cutoff</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </form>
    </div>
  );
};

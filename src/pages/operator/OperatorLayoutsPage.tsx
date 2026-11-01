import React, { useState } from 'react';
import { store } from '../../services/store';
import { BusSeatLayout } from '../../types';
import { Grid, Plus, CheckCircle2, Eye, Compass, Disc } from 'lucide-react';

export const OperatorLayoutsPage: React.FC = () => {
  const [layouts, setLayouts] = useState<BusSeatLayout[]>(() => store.getLayouts());
  const [selectedLayout, setSelectedLayout] = useState<BusSeatLayout>(layouts[0]);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Layout Form
  const [name, setName] = useState('');
  const [layoutType, setLayoutType] = useState<'2x2' | '2x1' | 'sleeper'>('2x2');
  const [numRows, setNumRows] = useState(10);

  const handleCreateLayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Generate seats
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].slice(0, numRows);
    const seats = [];

    if (layoutType === '2x2') {
      for (let r = 0; r < rows.length; r++) {
        for (let c = 1; c <= 4; c++) {
          seats.push({
            id: `seat-custom-${rows[r]}${c}`,
            seat_number: `${rows[r]}${c}`,
            deck: 'lower' as const,
            row: r + 1,
            col: c <= 2 ? c : c + 1,
            seat_type: 'regular' as const,
            position: c === 1 || c === 4 ? ('window' as const) : ('aisle' as const),
            fare_adjustment: 0,
            is_active: true,
          });
        }
      }
    } else {
      // 2x1
      for (let r = 0; r < rows.length; r++) {
        seats.push({
          id: `seat-custom-${rows[r]}1`,
          seat_number: `${rows[r]}1`,
          deck: 'lower' as const,
          row: r + 1,
          col: 1,
          seat_type: 'business' as const,
          position: 'window' as const,
          fare_adjustment: 200,
          is_active: true,
        });
        seats.push({
          id: `seat-custom-${rows[r]}2`,
          seat_number: `${rows[r]}2`,
          deck: 'lower' as const,
          row: r + 1,
          col: 2,
          seat_type: 'business' as const,
          position: 'aisle' as const,
          fare_adjustment: 150,
          is_active: true,
        });
        seats.push({
          id: `seat-custom-${rows[r]}3`,
          seat_number: `${rows[r]}3`,
          deck: 'lower' as const,
          row: r + 1,
          col: 4,
          seat_type: 'vip' as const,
          position: 'window' as const,
          fare_adjustment: 300,
          is_active: true,
        });
      }
    }

    const newLayout = store.addLayout({
      name,
      layout_type: layoutType,
      total_seats: seats.length,
      total_rows: numRows,
      columns_left: 2,
      columns_right: layoutType === '2x2' ? 2 : 1,
      deck_type: 'single',
      seats,
    });

    setLayouts(store.getLayouts());
    setSelectedLayout(newLayout);
    setCreateModalOpen(false);
    setName('');
  };

  const rows = Array.from(new Set(selectedLayout.seats.map((s) => s.row))).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Bus Seat Layout Engine</h1>
          <p className="text-xs text-slate-500">
            Define seat configurations (2+2, 2+1 Business, Royal Sleeper) and preview interactive seat maps.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Layout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Layouts List */}
        <div className="lg:col-span-5 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            Available Seat Layout Templates
          </label>
          {layouts.map((l) => (
            <div
              key={l.id}
              onClick={() => setSelectedLayout(l)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedLayout.id === l.id
                  ? 'border-teal-600 bg-teal-50/60 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <h4 className="font-bold text-sm text-slate-900">{l.name}</h4>
                <p className="text-xs text-slate-500">
                  {l.layout_type.toUpperCase()} Seating • {l.total_rows} Rows • Deck: {l.deck_type}
                </p>
              </div>
              <span className="font-mono text-sm font-black text-teal-800">
                {l.total_seats} Seats
              </span>
            </div>
          ))}
        </div>

        {/* Live Visual Map Preview */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Interactive Layout Preview: {selectedLayout.name}
              </h3>
              <p className="text-xs text-slate-500">
                Total Capacity: <strong className="text-teal-700">{selectedLayout.total_seats} seats</strong>
              </p>
            </div>
          </div>

          {/* Cabin Layout */}
          <div className="max-w-xs mx-auto bg-slate-50 border-2 border-slate-300 rounded-3xl p-4 shadow-inner space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-dashed border-slate-300 px-1 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold">
                <Compass className="w-3.5 h-3.5 text-teal-600" /> Entry Door
              </span>
              <span className="flex items-center gap-1 font-semibold bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                <Disc className="w-3.5 h-3.5 text-slate-800" /> Driver
              </span>
            </div>

            <div className="space-y-2">
              {rows.map((rowNum) => {
                const seatsInRow = selectedLayout.seats.filter((s) => s.row === rowNum);
                const left = seatsInRow.filter((s) => s.col <= 2).sort((a, b) => a.col - b.col);
                const right = seatsInRow.filter((s) => s.col >= 3).sort((a, b) => a.col - b.col);

                return (
                  <div key={rowNum} className="flex items-center justify-between gap-1.5">
                    <div className="flex gap-1.5">
                      {left.map((s) => (
                        <div
                          key={s.id}
                          className="w-8 h-8 rounded-lg bg-white border border-teal-500 text-teal-900 font-bold text-[10px] flex items-center justify-center shadow-xs"
                        >
                          {s.seat_number}
                        </div>
                      ))}
                    </div>

                    <span className="text-[9px] font-mono text-slate-400 select-none">
                      {rowNum}
                    </span>

                    <div className="flex gap-1.5">
                      {right.map((s) => (
                        <div
                          key={s.id}
                          className="w-8 h-8 rounded-lg bg-white border border-teal-500 text-teal-900 font-bold text-[10px] flex items-center justify-center shadow-xs"
                        >
                          {s.seat_number}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Create Layout Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">Create Custom Seat Layout</h3>

            <form onSubmit={handleCreateLayout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Layout Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive 2+1 Suite (24 Seats)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Layout Type</label>
                <select
                  value={layoutType}
                  onChange={(e) => setLayoutType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="2x2">Standard 2+2 Seating</option>
                  <option value="2x1">Business Class 2+1 Seating</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Seat Rows (A, B, C...)
                </label>
                <input
                  type="number"
                  min={5}
                  max={12}
                  value={numRows}
                  onChange={(e) => setNumRows(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                >
                  Save Layout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

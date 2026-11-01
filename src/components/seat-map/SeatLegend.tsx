import React from 'react';

export const SeatLegend: React.FC = () => {
  const items = [
    { label: 'Available', style: 'bg-white border-2 border-teal-500 text-teal-800' },
    { label: 'Selected', style: 'bg-teal-600 border-2 border-teal-700 text-white' },
    { label: 'Booked', style: 'bg-slate-300 border border-slate-400 text-slate-500' },
    { label: 'Held', style: 'bg-amber-400 border-2 border-amber-500 text-amber-950' },
    { label: 'Female Reserved', style: 'bg-pink-50 border-2 border-pink-400 text-pink-700' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shadow-xs ${item.style}`}>
            •
          </div>
          <span className="text-slate-600 font-medium text-[11px] sm:text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

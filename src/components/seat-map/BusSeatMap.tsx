import React, { useState, useEffect } from 'react';
import { Trip, TripSeatInventory } from '../../types';
import { store } from '../../services/store';
import { SeatLegend } from './SeatLegend';
import { formatBDT } from '../../lib/utils';
import { Compass, Disc, AlertCircle } from 'lucide-react';

interface BusSeatMapProps {
  trip: Trip;
  selectedSeats: string[];
  onSeatToggle: (seatNumber: string, fare: number) => void;
  maxSeats?: number;
  sessionId?: string;
  isCounterMode?: boolean;
}

export const BusSeatMap: React.FC<BusSeatMapProps> = ({
  trip,
  selectedSeats,
  onSeatToggle,
  maxSeats = 4,
  sessionId = 'sess-local',
  isCounterMode = false,
}) => {
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');
  const [inventory, setInventory] = useState<TripSeatInventory[]>(() =>
    store.getTripSeatInventory(trip.id, sessionId)
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const updateInventory = () => {
      setInventory(store.getTripSeatInventory(trip.id, sessionId));
    };

    updateInventory();
    const unsub = store.subscribe(updateInventory);
    const interval = setInterval(updateInventory, 3000); // Poll hold status every 3s
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [trip.id, sessionId]);

  const hasUpperDeck = inventory.some((s) => s.deck === 'upper');

  const deckSeats = inventory.filter((s) => s.deck === activeDeck);

  // Group seats by row
  const rowNumbers = Array.from(new Set(deckSeats.map((s) => s.row))).sort((a, b) => a - b);

  const handleSeatClick = (seat: TripSeatInventory) => {
    setErrorMsg(null);

    // If booked, do nothing
    if (seat.status === 'booked') {
      setErrorMsg(`Seat ${seat.seat_number} is already booked.`);
      return;
    }

    // If held by someone else
    if (seat.status === 'held' && seat.held_by !== sessionId && !isCounterMode) {
      setErrorMsg(`Seat ${seat.seat_number} is currently held by another passenger.`);
      return;
    }

    const isAlreadySelected = selectedSeats.includes(seat.seat_number);

    if (!isAlreadySelected && selectedSeats.length >= maxSeats) {
      setErrorMsg(`You can select a maximum of ${maxSeats} seats per booking.`);
      return;
    }

    const seatFare = trip.base_fare + seat.fare_adjustment;
    onSeatToggle(seat.seat_number, seatFare);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-5">
      {/* Deck Selector if double deck */}
      {hasUpperDeck && (
        <div className="flex justify-center">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveDeck('lower')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                activeDeck === 'lower'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lower Deck (Ground)
            </button>
            <button
              type="button"
              onClick={() => setActiveDeck('upper')}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                activeDeck === 'upper'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upper Deck (Executive)
            </button>
          </div>
        </div>
      )}

      {/* Bus Cabin Visual Frame */}
      <div className="max-w-md mx-auto bg-slate-50 border-2 border-slate-300 rounded-3xl p-4 shadow-inner relative">
        {/* Front Bus Driver Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-slate-300 mb-4 px-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Compass className="w-4 h-4 text-teal-600" />
            <span>Passenger Door / Entry</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-200 px-2.5 py-1 rounded-lg text-slate-700 text-xs font-medium" title="Driver Cabin (Right Hand Drive)">
            <Disc className="w-4 h-4 text-slate-800 animate-spin-slow" />
            <span>Driver Seat</span>
          </div>
        </div>

        {/* Seat Rows Grid */}
        <div className="space-y-2.5">
          {rowNumbers.map((rowNum) => {
            const seatsInRow = deckSeats.filter((s) => s.row === rowNum);
            // Left seats (col 1, 2) and Right seats (col 3, 4)
            const leftSeats = seatsInRow.filter((s) => s.col <= 2).sort((a, b) => a.col - b.col);
            const rightSeats = seatsInRow.filter((s) => s.col >= 3).sort((a, b) => a.col - b.col);

            return (
              <div key={rowNum} className="flex items-center justify-between gap-2">
                {/* Left Side (Col 1, 2) */}
                <div className="flex gap-2">
                  {leftSeats.map((seat) => renderSeatButton(seat))}
                </div>

                {/* Central Aisle */}
                <div className="w-8 sm:w-10 text-center text-[10px] font-mono text-slate-400 select-none">
                  {rowNum}
                </div>

                {/* Right Side (Col 3, 4) */}
                <div className="flex gap-2">
                  {rightSeats.map((seat) => renderSeatButton(seat))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rear Engine Indication */}
        <div className="mt-4 pt-3 border-t border-slate-200 text-center text-[11px] text-slate-400 font-medium tracking-wide">
          Rear Cabin / Emergency Window
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Seat Legend */}
      <SeatLegend />
    </div>
  );

  function renderSeatButton(seat: TripSeatInventory) {
    const isSelected = selectedSeats.includes(seat.seat_number);
    const isBooked = seat.status === 'booked';
    const isHeld = seat.status === 'held' && !isSelected;
    const isFemale = seat.status === 'female_reserved';

    let btnClass = 'bg-white border-2 border-teal-500 text-teal-900 hover:bg-teal-50 hover:scale-105 shadow-xs';

    if (isSelected) {
      btnClass = 'bg-teal-600 border-2 border-teal-700 text-white font-bold shadow-md scale-105';
    } else if (isBooked) {
      btnClass = 'bg-slate-300 border border-slate-400 text-slate-500 cursor-not-allowed opacity-80';
    } else if (isHeld) {
      btnClass = 'bg-amber-400 border-2 border-amber-500 text-amber-950 font-semibold cursor-not-allowed';
    } else if (isFemale) {
      btnClass = 'bg-pink-50 border-2 border-pink-400 text-pink-700 hover:bg-pink-100';
    }

    const totalSeatPrice = trip.base_fare + seat.fare_adjustment;

    return (
      <button
        key={seat.id}
        type="button"
        disabled={isBooked || (isHeld && !isCounterMode)}
        onClick={() => handleSeatClick(seat)}
        className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center transition-all ${btnClass}`}
        title={`Seat ${seat.seat_number} • ${seat.seat_type.toUpperCase()} • ${formatBDT(totalSeatPrice)}`}
      >
        <span className="text-[11px] sm:text-xs font-bold leading-none">{seat.seat_number}</span>
        {seat.fare_adjustment > 0 && !isBooked && (
          <span className="text-[8px] font-mono leading-none mt-0.5 opacity-90">
            +{seat.fare_adjustment}
          </span>
        )}
      </button>
    );
  }
};

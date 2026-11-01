import React, { useState } from 'react';
import { Trip } from '../../types';
import { formatBDT, formatTime } from '../../lib/utils';
import { BusSeatMap } from '../seat-map/BusSeatMap';
import { Bus, Clock, Wifi, Droplets, Zap, ShieldCheck, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TripCardProps {
  trip: Trip;
  sessionId?: string;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, sessionId = 'sess-customer' }) => {
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatFares, setSeatFares] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  const handleSeatToggle = (seatNumber: string, fare: number) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        const next = prev.filter((s) => s !== seatNumber);
        const nextFares = { ...seatFares };
        delete nextFares[seatNumber];
        setSeatFares(nextFares);
        return next;
      } else {
        setSeatFares((f) => ({ ...f, [seatNumber]: fare }));
        return [...prev, seatNumber];
      }
    });
  };

  const totalSeatsPrice = Object.values(seatFares).reduce((sum, f) => sum + f, 0);

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) return;
    const params = new URLSearchParams({
      tripId: trip.id,
      seats: selectedSeats.join(','),
    });
    navigate(`/checkout?${params.toString()}`);
  };

  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('wifi')) return <Wifi className="w-3.5 h-3.5 text-teal-600" />;
    if (lower.includes('water')) return <Droplets className="w-3.5 h-3.5 text-blue-500" />;
    if (lower.includes('charging') || lower.includes('usb')) return <Zap className="w-3.5 h-3.5 text-amber-500" />;
    return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
  };

  const isAc = trip.bus?.is_ac;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4 sm:p-6 space-y-4">
        {/* Top Header: Operator & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold shadow-xs">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
                {trip.operator?.name || 'Bus Operator'}
              </h3>
              <p className="text-xs text-slate-500">
                {trip.bus?.name} • <span className="font-mono text-slate-600">{trip.bus?.registration_number}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                isAc
                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {trip.bus?.coach_type}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {trip.available_seats_count ?? 20} Seats Available
            </span>
          </div>
        </div>

        {/* Schedule & Route Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Departure */}
          <div className="md:col-span-3">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatTime(trip.departure_time)}
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">
              {trip.route?.origin_station?.city || 'Origin'}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {trip.boarding_points[0] || 'Main Terminal'}
            </div>
          </div>

          {/* Duration Indicator */}
          <div className="md:col-span-3 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>{Math.floor((trip.route?.estimated_duration_minutes || 360) / 60)}h {(trip.route?.estimated_duration_minutes || 360) % 60}m</span>
            </div>
            <div className="w-full flex items-center my-1.5 px-4">
              <div className="w-2 h-2 rounded-full bg-teal-600" />
              <div className="flex-1 h-0.5 bg-slate-200 border-t border-dashed border-slate-300" />
              <div className="w-2 h-2 rounded-full border-2 border-teal-600 bg-white" />
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Non-Stop Express</div>
          </div>

          {/* Arrival */}
          <div className="md:col-span-3">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatTime(trip.arrival_time)}
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">
              {trip.route?.destination_station?.city || 'Destination'}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {trip.dropping_points[0] || 'Main Counter'}
            </div>
          </div>

          {/* Fare & View Seats Button */}
          <div className="md:col-span-3 flex flex-col md:items-end justify-center">
            <div className="text-xs text-slate-500 font-medium">Starting from</div>
            <div className="text-2xl font-black text-teal-600">
              {formatBDT(trip.base_fare)}
            </div>
            <button
              type="button"
              onClick={() => setShowSeatMap(!showSeatMap)}
              className="mt-2 w-full md:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#142B4A] hover:bg-[#0B1F3A] text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>{showSeatMap ? 'Hide Seats' : 'View Seats'}</span>
              {showSeatMap ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Amenities Bar */}
        {trip.bus?.amenities && trip.bus.amenities.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Amenities:</span>
            {trip.bus.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600"
              >
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expandable Inline Seat Map */}
      {showSeatMap && (
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Select Your Preferred Seats</h4>
                <p className="text-xs text-slate-500">
                  Click on an available seat to select (Max 4 seats).
                </p>
              </div>
              {selectedSeats.length > 0 && (
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-medium">Selected ({selectedSeats.length})</div>
                  <div className="text-sm font-bold text-teal-700">{formatBDT(totalSeatsPrice)}</div>
                </div>
              )}
            </div>

            <BusSeatMap
              trip={trip}
              selectedSeats={selectedSeats}
              onSeatToggle={handleSeatToggle}
              sessionId={sessionId}
            />

            {/* Selected Seats Bar & Action */}
            {selectedSeats.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-teal-200 shadow-sm flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
                <div className="space-y-1">
                  <div className="text-xs text-slate-600 font-semibold flex items-center gap-2">
                    <span>Seats:</span>
                    <span className="text-teal-700 font-mono font-bold">
                      {selectedSeats.join(', ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Total Fare: <span className="font-bold text-slate-900">{formatBDT(totalSeatsPrice)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-all"
                >
                  <span>Continue to Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

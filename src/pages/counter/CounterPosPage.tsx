import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { BusSeatMap } from '../../components/seat-map/BusSeatMap';
import { Trip, PassengerDetail, PaymentMethod } from '../../types';
import { formatBDT, formatTime, formatDate } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  ShoppingCart,
  User,
  Phone,
  DollarSign,
  Printer,
  Bus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const CounterPosPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>(() => store.getTrips());
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatFares, setSeatFares] = useState<Record<string, number>>({});

  // Passenger & Payment State
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('+88017');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuedTicketId, setIssuedTicketId] = useState<string | null>(null);

  const selectedTrip = trips.find((t) => t.id === selectedTripId);
  const activeShift = store.getActiveShiftForStaff(user?.id || 'usr-staff-gabtoli');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setTrips(store.getTrips());
    });
    return unsub;
  }, []);

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

  const totalFare = Object.values(seatFares).reduce((sum, f) => sum + f, 0);
  const changeDue = Math.max(0, cashReceived - totalFare);

  const handleIssueTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || selectedSeats.length === 0) {
      alert('Please select a trip and at least one seat.');
      return;
    }
    if (!passengerName.trim() || !passengerPhone.trim()) {
      alert('Please enter passenger name and mobile number.');
      return;
    }

    if (paymentMethod === 'cash' && cashReceived < totalFare) {
      alert(`Cash received (৳${cashReceived}) is less than total fare (৳${totalFare}).`);
      return;
    }

    setIsSubmitting(true);

    try {
      const passengers: PassengerDetail[] = selectedSeats.map((seatNum) => ({
        seat_number: seatNum,
        name: passengerName,
        phone: passengerPhone,
        gender: 'male',
        fare: seatFares[seatNum] || selectedTrip.base_fare,
      }));

      const newBooking = store.createBooking({
        trip_id: selectedTrip.id,
        customer_name: passengerName,
        customer_phone: passengerPhone,
        boarding_point: selectedTrip.boarding_points[0] || 'Counter Terminal',
        dropping_point: selectedTrip.dropping_points[0] || 'Main Dropping',
        seat_numbers: selectedSeats,
        passengers,
        payment_method: paymentMethod,
        booking_channel: 'counter',
        counter_id: activeShift?.counter_id || 'cnt-gabtoli-01',
        counter_name: activeShift?.counter_name || 'Gabtoli Counter #1',
        staff_user_id: user?.id || 'usr-staff-gabtoli',
        staff_name: user?.full_name || 'Rafiqul Islam',
      });

      setIssuedTicketId(newBooking.id);
      setIsSubmitting(false);
      navigate(`/ticket/${newBooking.id}`);
    } catch (err: any) {
      alert(err.message || 'Error creating counter booking.');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedSeats([]);
    setSeatFares({});
    setPassengerName('');
    setPassengerPhone('+88017');
    setCashReceived(0);
    setIssuedTicketId(null);
  };

  return (
    <div className="space-y-6">
      {/* POS Terminal Top Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-600 text-white font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Fast Counter POS Terminal
            </h1>
            <p className="text-xs text-slate-500">
              Direct physical ticket issuance with cash change calculation & immediate printing
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Order</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Trip Selector & Seat Map */}
        <div className="lg:col-span-7 space-y-6">
          {/* Trip Selection Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Select Scheduled Trip / Departure
            </label>
            <select
              value={selectedTripId}
              onChange={(e) => {
                setSelectedTripId(e.target.value);
                setSelectedSeats([]);
                setSeatFares({});
              }}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.route?.origin_station?.city} ➔ {t.route?.destination_station?.city} | {t.operator?.name} | {formatTime(t.departure_time)} ({t.bus?.coach_type}) - {formatBDT(t.base_fare)}
                </option>
              ))}
            </select>

            {selectedTrip && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs flex flex-wrap justify-between items-center text-slate-600 gap-2">
                <span>
                  Operator: <strong className="text-slate-900">{selectedTrip.operator?.name}</strong> ({selectedTrip.bus?.registration_number})
                </span>
                <span>
                  Available Seats: <strong className="text-emerald-700 font-bold">{selectedTrip.available_seats_count}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Seat Map */}
          {selectedTrip && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
                2. Pick Available Seat(s) on Visual Map
              </label>
              <BusSeatMap
                trip={selectedTrip}
                selectedSeats={selectedSeats}
                onSeatToggle={handleSeatToggle}
                isCounterMode={true}
                maxSeats={10}
              />
            </div>
          )}
        </div>

        {/* Right Column: Fast Passenger & Checkout Form */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleIssueTicket} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                3. Passenger & Payment
              </h3>
              <span className="text-xs font-mono font-bold text-teal-700">
                {selectedSeats.length} Seat(s) Selected
              </span>
            </div>

            {/* Selected Seats Pills */}
            <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 space-y-1">
              <div className="text-[11px] text-teal-800 font-bold uppercase tracking-wider">
                Assigned Seats:
              </div>
              <div className="text-base font-mono font-black text-teal-900">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected yet'}
              </div>
            </div>

            {/* Passenger Name & Phone */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Passenger Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="e.g. Kamal Hossain"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="+88017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cash', label: 'Cash' },
                  { id: 'bkash', label: 'bKash' },
                  { id: 'nagad', label: 'Nagad' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      paymentMethod === m.id
                        ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs ring-1 ring-teal-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Calculator if Cash */}
            {paymentMethod === 'cash' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Cash Received (৳):</span>
                  <input
                    type="number"
                    min={totalFare}
                    value={cashReceived || ''}
                    onChange={(e) => setCashReceived(Number(e.target.value))}
                    placeholder="Enter amount"
                    className="w-32 p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-right"
                  />
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-600">Change Due to Passenger:</span>
                  <span className="font-mono font-black text-sm text-emerald-700">
                    {formatBDT(changeDue)}
                  </span>
                </div>
              </div>
            )}

            {/* Total Fare Display */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Total Counter Fare</span>
                <span className="text-2xl font-black text-slate-900">{formatBDT(totalFare)}</span>
              </div>
              <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                0% Web Fee
              </span>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isSubmitting || selectedSeats.length === 0}
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm transition-all"
            >
              <Printer className="w-5 h-5" />
              <span>{isSubmitting ? 'Issuing Ticket...' : 'Issue Ticket & Print Boarding Pass'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

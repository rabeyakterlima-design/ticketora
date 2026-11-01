import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { store } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { formatBDT, formatTime, formatDate } from '../../lib/utils';
import { PassengerDetail, PaymentMethod } from '../../types';
import {
  Clock,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Bus,
  MapPin,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const tripId = searchParams.get('tripId');
  const seatsParam = searchParams.get('seats');
  const seatNumbers = seatsParam ? seatsParam.split(',') : [];

  const trip = tripId ? store.getTripById(tripId) : undefined;
  const sessionId = 'sess-customer';

  // Hold Timer: 300 seconds (5 mins)
  const [timeLeft, setTimeLeft] = useState(300);
  const [holdError, setHoldError] = useState<string | null>(null);

  // Form State
  const [boardingPoint, setBoardingPoint] = useState<string>('');
  const [droppingPoint, setDroppingPoint] = useState<string>('');
  const [primaryName, setPrimaryName] = useState<string>(user?.full_name || '');
  const [primaryPhone, setPrimaryPhone] = useState<string>(user?.phone || '+88017');
  const [primaryEmail, setPrimaryEmail] = useState<string>(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [passengers, setPassengers] = useState<PassengerDetail[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Initialize holds and passenger objects
  useEffect(() => {
    if (!trip || seatNumbers.length === 0) {
      navigate('/search');
      return;
    }

    try {
      store.holdSeats(trip.id, seatNumbers, sessionId, 300);
    } catch (err: any) {
      setHoldError(err.message || 'Seat could not be held.');
    }

    if (trip.boarding_points.length > 0) setBoardingPoint(trip.boarding_points[0]);
    if (trip.dropping_points.length > 0) setDroppingPoint(trip.dropping_points[0]);

    // Initialize individual passengers
    const initialPassengers: PassengerDetail[] = seatNumbers.map((seatNum, idx) => ({
      seat_number: seatNum,
      name: idx === 0 && user?.full_name ? user.full_name : '',
      gender: 'male',
      age: 26,
      fare: trip.base_fare,
    }));
    setPassengers(initialPassengers);

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert('Your seat reservation hold has expired. Please select your seats again.');
          navigate(`/search`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tripId, seatsParam]);

  if (!trip || seatNumbers.length === 0) {
    return null;
  }

  const baseFareTotal = trip.base_fare * seatNumbers.length;
  const serviceFee = Math.max(25, Math.round((baseFareTotal * 2) / 100));
  const totalAmount = Math.max(0, baseFareTotal + serviceFee - discountAmount);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'TICKETORA100') {
      setDiscountAmount(100);
      alert('Coupon TICKETORA100 applied! You saved ৳100.');
    } else {
      alert('Invalid coupon code. Try TICKETORA100');
    }
  };

  const handlePassengerChange = (index: number, field: keyof PassengerDetail, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleConfirmAndPay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!primaryName.trim() || !primaryPhone.trim()) {
      alert('Please provide primary passenger name and phone number.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create confirmed booking in store
      const booking = store.createBooking({
        trip_id: trip.id,
        customer_id: user?.id,
        customer_name: primaryName,
        customer_phone: primaryPhone,
        customer_email: primaryEmail,
        boarding_point: boardingPoint,
        dropping_point: droppingPoint,
        seat_numbers: seatNumbers,
        passengers: passengers.map((p, idx) => ({
          ...p,
          name: p.name.trim() || `Passenger ${idx + 1}`,
        })),
        payment_method: paymentMethod,
        booking_channel: 'online',
        session_id: sessionId,
      });

      navigate(`/booking-confirmation/${booking.id}`);
    } catch (err: any) {
      alert(err.message || 'Error completing booking.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hold Countdown Header */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-amber-900 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-800">
            <Clock className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Seats Reserved Temporarily</h3>
            <p className="text-xs text-amber-800">
              Seats <strong className="font-mono text-amber-950 font-black">{seatNumbers.join(', ')}</strong> are held for you. Complete payment before the timer expires.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-700">Time Remaining</span>
          <span className="text-2xl font-mono font-extrabold text-amber-900">{formatTimer(timeLeft)}</span>
        </div>
      </div>

      {holdError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{holdError}</span>
        </div>
      )}

      <form onSubmit={handleConfirmAndPay} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Passenger Details & Payment Method */}
        <div className="lg:col-span-8 space-y-6">
          {/* Journey Overview Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">{trip.operator?.name}</h3>
                <p className="text-xs text-slate-500">{trip.bus?.name} • {trip.bus?.coach_type}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Route</span>
                <span className="font-bold text-slate-900 text-sm">
                  {trip.route?.origin_station?.city} ➔ {trip.route?.destination_station?.city}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Date & Time</span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatDate(trip.departure_date)} at {formatTime(trip.departure_time)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Selected Seats</span>
                <span className="font-mono font-black text-teal-700 text-sm">
                  {seatNumbers.join(', ')} ({seatNumbers.length} seats)
                </span>
              </div>
            </div>

            {/* Boarding & Dropping Points Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Boarding Point / Station
                </label>
                <select
                  value={boardingPoint}
                  onChange={(e) => setBoardingPoint(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  {trip.boarding_points.map((pt) => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Dropping Point / Station
                </label>
                <select
                  value={droppingPoint}
                  onChange={(e) => setDroppingPoint(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  {trip.dropping_points.map((pt) => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Primary Passenger Contact Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Primary Passenger & Ticket Delivery
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={primaryName}
                  onChange={(e) => setPrimaryName(e.target.value)}
                  placeholder="e.g. Anik Sen"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (for SMS & E-Ticket) *
                </label>
                <input
                  type="tel"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  placeholder="+88017XXXXXXXX"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (optional)
                </label>
                <input
                  type="email"
                  value={primaryEmail}
                  onChange={(e) => setPrimaryEmail(e.target.value)}
                  placeholder="anik.sen@example.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Individual Passenger Names */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Passenger List per Assigned Seat
            </h3>

            <div className="space-y-3">
              {passengers.map((p, index) => (
                <div key={p.seat_number} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-teal-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                      {p.seat_number}
                    </span>
                    <span className="text-xs font-bold text-slate-700">Seat</span>
                  </div>

                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      placeholder={`Passenger ${index + 1} Name`}
                      value={p.name}
                      onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="sm:col-span-4 flex items-center gap-2">
                    <select
                      value={p.gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-600" />
              <span>Select Payment Method</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'bkash', name: 'bKash', color: 'border-pink-500 bg-pink-50 text-pink-700' },
                { id: 'nagad', name: 'Nagad', color: 'border-orange-500 bg-orange-50 text-orange-700' },
                { id: 'rocket', name: 'Rocket', color: 'border-purple-500 bg-purple-50 text-purple-700' },
                { id: 'sslcommerz', name: 'Cards / Net', color: 'border-blue-500 bg-blue-50 text-blue-700' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                  className={`p-3.5 rounded-2xl border-2 text-center font-bold text-xs transition-all cursor-pointer ${
                    paymentMethod === m.id
                      ? `${m.color} shadow-sm ring-2 ring-teal-500/20`
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-sm font-extrabold">{m.name}</div>
                  <span className="text-[10px] opacity-75 font-normal">Instant Pay</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Fare Summary & Pay Button */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Fare Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({seatNumbers.length} seat(s)):</span>
                <span className="font-semibold text-slate-900">{formatBDT(baseFareTotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Web Platform Service Charge:</span>
                <span className="font-semibold text-slate-900">{formatBDT(serviceFee)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount:</span>
                  <span>-{formatBDT(discountAmount)}</span>
                </div>
              )}

              {/* Coupon input */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
                  >
                    Apply
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Try code: TICKETORA100</span>
              </div>

              <div className="pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block">Total Payable</span>
                  <span className="text-[10px] text-slate-400">Inclusive of all charges</span>
                </div>
                <span className="text-2xl font-black text-teal-600">{formatBDT(totalAmount)}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm sm:text-base"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Verifying Payment...' : `Pay ${formatBDT(totalAmount)} & Confirm`}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>256-bit SSL encrypted transactional security</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

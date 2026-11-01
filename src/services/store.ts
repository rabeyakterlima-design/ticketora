import {
  Booking,
  Bus,
  BusCounter,
  BusOperator,
  BusRoute,
  BusSeatLayout,
  CancellationRequest,
  PaymentRecord,
  StaffShift,
  Station,
  SystemSettings,
  Trip,
  TripSeatInventory,
  UserProfile,
  AppNotification,
  ContactMessage,
  AuditLog,
  PassengerDetail,
  PaymentMethod,
} from '../types';
import {
  initialBuses,
  initialBookings,
  initialCounters,
  initialNotifications,
  initialOperators,
  initialPayments,
  initialRoutes,
  initialSeatLayouts,
  initialSettings,
  initialShifts,
  initialStations,
  initialTrips,
  initialUsers,
  initialCancellations,
  initialContactMessages,
  initialAuditLogs,
} from '../data/initialData';
import { generateBookingRef, generateUUID } from '../lib/utils';

export interface SeatHoldRecord {
  id: string;
  trip_id: string;
  seat_number: string;
  session_id: string;
  expires_at: number; // timestamp ms
}

class TicketoraStore {
  private settings: SystemSettings;
  private users: UserProfile[];
  private stations: Station[];
  private operators: BusOperator[];
  private layouts: BusSeatLayout[];
  private buses: Bus[];
  private routes: BusRoute[];
  private trips: Trip[];
  private counters: BusCounter[];
  private shifts: StaffShift[];
  private bookings: Booking[];
  private payments: PaymentRecord[];
  private cancellations: CancellationRequest[];
  private notifications: AppNotification[];
  private contactMessages: ContactMessage[];
  private auditLogs: AuditLog[];
  private seatHolds: SeatHoldRecord[] = [];

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.settings = this.load('ticketora_settings', initialSettings);
    this.users = this.load('ticketora_users', initialUsers);
    this.stations = this.load('ticketora_stations', initialStations);
    this.operators = this.load('ticketora_operators', initialOperators);
    this.layouts = this.load('ticketora_layouts', initialSeatLayouts);
    this.buses = this.load('ticketora_buses', initialBuses);
    this.routes = this.load('ticketora_routes', initialRoutes);
    this.trips = this.load('ticketora_trips', initialTrips);
    this.counters = this.load('ticketora_counters', initialCounters);
    this.shifts = this.load('ticketora_shifts', initialShifts);
    this.bookings = this.load('ticketora_bookings', initialBookings);
    this.payments = this.load('ticketora_payments', initialPayments);
    this.cancellations = this.load('ticketora_cancellations', initialCancellations);
    this.notifications = this.load('ticketora_notifications', initialNotifications);
    this.contactMessages = this.load('ticketora_messages', initialContactMessages);
    this.auditLogs = this.load('ticketora_audit', initialAuditLogs);
    this.seatHolds = this.load('ticketora_holds', []);

    // Clean up expired holds on startup
    this.cleanupExpiredHolds();
  }

  private load<T>(key: string, fallback: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(key);
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch (e) {
      // Fallback
    }
    return fallback;
  }

  private save<T>(key: string, data: T) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {
      // Fallback
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private cleanupExpiredHolds() {
    const now = Date.now();
    const beforeCount = this.seatHolds.length;
    this.seatHolds = this.seatHolds.filter((h) => h.expires_at > now);
    if (this.seatHolds.length !== beforeCount) {
      this.save('ticketora_holds', this.seatHolds);
    }
  }

  // ================= GETTERS =================

  public getSettings(): SystemSettings {
    return this.settings;
  }

  public getUsers(): UserProfile[] {
    return this.users;
  }

  public getStations(): Station[] {
    return this.stations;
  }

  public getOperators(): BusOperator[] {
    return this.operators;
  }

  public getLayouts(): BusSeatLayout[] {
    return this.layouts;
  }

  public getBuses(): Bus[] {
    return this.buses;
  }

  public getRoutes(): BusRoute[] {
    // Enrich with station names
    return this.routes.map((rt) => {
      const orig = this.stations.find((s) => s.id === rt.origin_station_id);
      const dest = this.stations.find((s) => s.id === rt.destination_station_id);
      return {
        ...rt,
        origin_station: orig,
        destination_station: dest,
      };
    });
  }

  public getTrips(): Trip[] {
    this.cleanupExpiredHolds();
    return this.trips.map((t) => {
      const bus = this.buses.find((b) => b.id === t.bus_id);
      const operator = this.operators.find((op) => op.id === t.operator_id);
      const rawRoute = this.routes.find((r) => r.id === t.route_id);
      const route = rawRoute
        ? {
            ...rawRoute,
            origin_station: this.stations.find((s) => s.id === rawRoute.origin_station_id),
            destination_station: this.stations.find((s) => s.id === rawRoute.destination_station_id),
          }
        : undefined;

      // Calculate available seats count
      const bookedSeats = this.getBookedSeatsForTrip(t.id);
      const heldSeats = this.seatHolds.filter((h) => h.trip_id === t.id).map((h) => h.seat_number);
      const totalCapacity = bus ? bus.total_seats : 40;
      const occupied = new Set([...bookedSeats, ...heldSeats]).size;
      const available_seats_count = Math.max(0, totalCapacity - occupied);

      return {
        ...t,
        bus,
        operator,
        route,
        available_seats_count,
      };
    });
  }

  public getTripById(id: string): Trip | undefined {
    return this.getTrips().find((t) => t.id === id);
  }

  public getCounters(): BusCounter[] {
    return this.counters;
  }

  public getShifts(): StaffShift[] {
    return this.shifts;
  }

  public getActiveShiftForStaff(staffId: string): StaffShift | undefined {
    return this.shifts.find((s) => s.staff_user_id === staffId && s.status === 'open');
  }

  public getBookings(): Booking[] {
    return this.bookings;
  }

  public getBookingById(id: string): Booking | undefined {
    return this.bookings.find((b) => b.id === id);
  }

  public getBookingByReference(ref: string): Booking | undefined {
    const trimmed = ref.trim().toUpperCase();
    return this.bookings.find(
      (b) => b.booking_reference.toUpperCase() === trimmed || b.customer_phone.includes(trimmed)
    );
  }

  public getPayments(): PaymentRecord[] {
    return this.payments;
  }

  public getCancellations(): CancellationRequest[] {
    return this.cancellations;
  }

  public getNotifications(userId?: string): AppNotification[] {
    if (!userId) return this.notifications;
    return this.notifications.filter((n) => !n.user_id || n.user_id === userId || n.recipient_role === 'all');
  }

  public getContactMessages(): ContactMessage[] {
    return this.contactMessages;
  }

  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  // ================= SEAT INVENTORY & HOLDS =================

  public getBookedSeatsForTrip(tripId: string): string[] {
    const activeBookings = this.bookings.filter(
      (b) => b.trip_id === tripId && b.booking_status !== 'cancelled'
    );
    const booked: string[] = [];
    activeBookings.forEach((b) => {
      booked.push(...b.seat_numbers);
    });
    return booked;
  }

  public getTripSeatInventory(tripId: string, currentSessionId?: string): TripSeatInventory[] {
    this.cleanupExpiredHolds();
    const trip = this.getTripById(tripId);
    if (!trip || !trip.bus) return [];

    const layout = this.layouts.find((l) => l.id === trip.bus?.layout_id);
    if (!layout) return [];

    const bookedSeats = new Set(this.getBookedSeatsForTrip(tripId));
    const activeHolds = this.seatHolds.filter((h) => h.trip_id === tripId);
    const holdMap = new Map<string, SeatHoldRecord>();
    activeHolds.forEach((h) => holdMap.set(h.seat_number, h));

    return layout.seats.map((s) => {
      let status: TripSeatInventory['status'] = 'available';
      let held_by: string | undefined = undefined;
      let held_expires_at: string | undefined = undefined;

      if (bookedSeats.has(s.seat_number)) {
        status = 'booked';
      } else if (holdMap.has(s.seat_number)) {
        const hold = holdMap.get(s.seat_number)!;
        status = 'held';
        held_by = hold.session_id;
        held_expires_at = new Date(hold.expires_at).toISOString();
      }

      return {
        id: s.id,
        trip_id: tripId,
        seat_number: s.seat_number,
        deck: s.deck,
        row: s.row,
        col: s.col,
        seat_type: s.seat_type,
        position: s.position,
        fare_adjustment: s.fare_adjustment,
        status,
        held_by,
        held_expires_at,
      };
    });
  }

  /**
   * Holds seats atomically. If any seat is booked or held by another session, throws an error.
   */
  public holdSeats(
    tripId: string,
    seatNumbers: string[],
    sessionId: string,
    durationSeconds: number = 300
  ): { success: boolean; expires_at: number } {
    this.cleanupExpiredHolds();

    const bookedSeats = new Set(this.getBookedSeatsForTrip(tripId));
    const now = Date.now();
    const expires_at = now + durationSeconds * 1000;

    // Check availability
    for (const seatNum of seatNumbers) {
      if (bookedSeats.has(seatNum)) {
        throw new Error(`Seat ${seatNum} is already booked.`);
      }
      const existingHold = this.seatHolds.find(
        (h) => h.trip_id === tripId && h.seat_number === seatNum && h.expires_at > now
      );
      if (existingHold && existingHold.session_id !== sessionId) {
        throw new Error(`Seat ${seatNum} is currently held by another passenger. Please choose another seat.`);
      }
    }

    // Remove any previous holds by this session on this trip for seats not in seatNumbers
    this.seatHolds = this.seatHolds.filter(
      (h) => !(h.trip_id === tripId && h.session_id === sessionId && !seatNumbers.includes(h.seat_number))
    );

    // Insert or update holds
    for (const seatNum of seatNumbers) {
      const idx = this.seatHolds.findIndex(
        (h) => h.trip_id === tripId && h.seat_number === seatNum && h.session_id === sessionId
      );
      if (idx >= 0) {
        this.seatHolds[idx].expires_at = expires_at;
      } else {
        this.seatHolds.push({
          id: generateUUID(),
          trip_id: tripId,
          seat_number: seatNum,
          session_id: sessionId,
          expires_at,
        });
      }
    }

    this.save('ticketora_holds', this.seatHolds);
    this.notify();

    return { success: true, expires_at };
  }

  public releaseHolds(tripId: string, seatNumbers: string[], sessionId: string) {
    this.seatHolds = this.seatHolds.filter(
      (h) => !(h.trip_id === tripId && h.session_id === sessionId && seatNumbers.includes(h.seat_number))
    );
    this.save('ticketora_holds', this.seatHolds);
    this.notify();
  }

  // ================= BOOKING TRANSACTION =================

  public createBooking(payload: {
    trip_id: string;
    customer_id?: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    boarding_point: string;
    dropping_point: string;
    seat_numbers: string[];
    passengers: PassengerDetail[];
    payment_method: PaymentMethod;
    transaction_reference?: string;
    booking_channel: 'online' | 'counter' | 'admin';
    counter_id?: string;
    counter_name?: string;
    staff_user_id?: string;
    staff_name?: string;
    session_id?: string;
  }): Booking {
    this.cleanupExpiredHolds();

    const trip = this.getTripById(payload.trip_id);
    if (!trip) {
      throw new Error('Selected trip not found.');
    }

    // Verify seats are not already booked
    const booked = new Set(this.getBookedSeatsForTrip(payload.trip_id));
    for (const s of payload.seat_numbers) {
      if (booked.has(s)) {
        throw new Error(`Seat ${s} has just been booked by another customer. Please choose other seats.`);
      }
    }

    // Calculate fare
    let base_fare = 0;
    let seat_adjustment = 0;
    payload.passengers.forEach((p) => {
      base_fare += trip.base_fare;
      seat_adjustment += p.fare - trip.base_fare;
    });

    const isCounter = payload.booking_channel === 'counter';
    const serviceFeePercent = isCounter ? 0 : this.settings.service_charge_percent;
    const computedServiceFee = isCounter ? 0 : Math.round((base_fare * serviceFeePercent) / 100);
    const service_fee = isCounter ? 0 : Math.max(this.settings.min_service_charge_bdt, computedServiceFee);
    const total_fare = base_fare + seat_adjustment + service_fee;

    const booking_reference = generateBookingRef();
    const bookingId = `bk-${generateUUID().substring(0, 8)}`;
    const nowIso = new Date().toISOString();

    const newBooking: Booking = {
      id: bookingId,
      booking_reference,
      customer_id: payload.customer_id,
      operator_id: trip.operator_id,
      operator_name: trip.operator?.name || 'Bus Operator',
      trip_id: trip.id,
      origin_city: trip.route?.origin_station?.city || 'Dhaka',
      destination_city: trip.route?.destination_station?.city || "Cox's Bazar",
      boarding_point: payload.boarding_point,
      dropping_point: payload.dropping_point,
      journey_date: trip.departure_date,
      departure_time: trip.departure_time,
      bus_name: trip.bus?.name || 'Luxury Express',
      coach_type: trip.bus?.coach_type || 'AC Deluxe',
      seat_numbers: payload.seat_numbers,
      passengers: payload.passengers,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_email: payload.customer_email,
      base_fare,
      seat_adjustment,
      service_fee,
      discount_amount: 0,
      total_fare,
      payment_status: 'paid',
      booking_status: 'confirmed',
      booking_channel: payload.booking_channel,
      counter_id: payload.counter_id,
      counter_name: payload.counter_name,
      booked_by_staff_id: payload.staff_user_id,
      booked_by_staff_name: payload.staff_name,
      qr_token: `${booking_reference}-SECURE-${trip.operator_id}-${Date.now()}`,
      created_at: nowIso,
      updated_at: nowIso,
    };

    // Save booking
    this.bookings.unshift(newBooking);
    this.save('ticketora_bookings', this.bookings);

    // Remove holds for these seats
    this.seatHolds = this.seatHolds.filter(
      (h) => !(h.trip_id === payload.trip_id && payload.seat_numbers.includes(h.seat_number))
    );
    this.save('ticketora_holds', this.seatHolds);

    // Create payment record
    const paymentId = `pay-${generateUUID().substring(0, 8)}`;
    const newPayment: PaymentRecord = {
      id: paymentId,
      booking_id: bookingId,
      booking_reference,
      amount: total_fare,
      currency: 'BDT',
      payment_method: payload.payment_method,
      payment_status: 'paid',
      provider_reference: payload.payment_method === 'cash' ? undefined : `GATEWAY-${Date.now()}`,
      transaction_reference: payload.transaction_reference || `TRX${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      counter_id: payload.counter_id,
      collected_by_name: payload.staff_name,
      created_at: nowIso,
      verified_at: nowIso,
    };
    this.payments.unshift(newPayment);
    this.save('ticketora_payments', this.payments);

    // If counter booking, update active staff shift
    if (isCounter && payload.staff_user_id) {
      const shift = this.getActiveShiftForStaff(payload.staff_user_id);
      if (shift) {
        shift.total_sales_amount += total_fare;
        shift.total_tickets_sold += payload.seat_numbers.length;
        this.save('ticketora_shifts', this.shifts);
      }
    }

    // Add Audit Log
    this.addAuditLog({
      user_name: payload.staff_name || payload.customer_name,
      role: payload.booking_channel === 'counter' ? 'counter_staff' : 'customer',
      action: payload.booking_channel === 'counter' ? 'COUNTER_TICKET_ISSUED' : 'ONLINE_BOOKING_CONFIRMED',
      entity_type: 'booking',
      entity_id: bookingId,
      details: `Created booking ${booking_reference} for ${payload.customer_name} (${payload.seat_numbers.join(', ')}). Total: ৳${total_fare}`,
    });

    // Add Notification
    this.addNotification({
      user_id: payload.customer_id,
      recipient_role: payload.booking_channel === 'counter' ? 'counter_staff' : 'customer',
      title: 'Booking Confirmed!',
      message: `Your booking ${booking_reference} for ${newBooking.origin_city} to ${newBooking.destination_city} has been confirmed. Seats: ${payload.seat_numbers.join(', ')}.`,
      category: 'booking',
      link_url: `/ticket/${bookingId}`,
    });

    this.notify();
    return newBooking;
  }

  // ================= CANCELLATION & REFUNDS =================

  public requestCancellation(payload: {
    booking_id: string;
    reason: string;
    actor_name?: string;
  }): CancellationRequest {
    const booking = this.getBookingById(payload.booking_id);
    if (!booking) throw new Error('Booking not found.');
    if (booking.booking_status === 'cancelled') {
      throw new Error('This booking has already been cancelled.');
    }

    // Calculate eligible refund based on hours before departure
    const departureDateTime = new Date(`${booking.journey_date}T${booking.departure_time}:00`);
    const hoursUntilTrip = (departureDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    let refundPercent = 0;
    if (hoursUntilTrip >= 24) {
      refundPercent = this.settings.refund_above_24h_percent;
    } else if (hoursUntilTrip >= 12) {
      refundPercent = this.settings.refund_12_to_24h_percent;
    } else if (hoursUntilTrip >= this.settings.cancellation_cutoff_hours) {
      refundPercent = this.settings.refund_below_12h_percent;
    } else {
      refundPercent = 0;
    }

    const refund_amount = Math.round((booking.total_fare * refundPercent) / 100);
    const deduction_fee = booking.total_fare - refund_amount;

    const reqId = `can-${generateUUID().substring(0, 8)}`;
    const nowIso = new Date().toISOString();

    const newRequest: CancellationRequest = {
      id: reqId,
      booking_id: booking.id,
      booking_reference: booking.booking_reference,
      customer_name: booking.customer_name,
      customer_phone: booking.customer_phone,
      journey_date: booking.journey_date,
      total_fare: booking.total_fare,
      refund_percentage: refundPercent,
      refund_amount,
      deduction_fee,
      reason: payload.reason,
      status: 'approved', // Auto-approved or pending for admin review
      reviewed_by_name: payload.actor_name || 'System Automated Policy',
      reviewed_at: nowIso,
      created_at: nowIso,
    };

    // Update booking status
    booking.booking_status = 'cancelled';
    booking.payment_status = refundPercent > 0 ? 'refunded' : 'paid';
    booking.updated_at = nowIso;
    this.save('ticketora_bookings', this.bookings);

    this.cancellations.unshift(newRequest);
    this.save('ticketora_cancellations', this.cancellations);

    // Log & notify
    this.addAuditLog({
      user_name: payload.actor_name || booking.customer_name,
      role: 'customer',
      action: 'BOOKING_CANCELLED',
      entity_type: 'cancellation',
      entity_id: reqId,
      details: `Cancelled booking ${booking.booking_reference}. Refund eligible: ৳${refund_amount} (${refundPercent}%). Seats freed.`,
    });

    this.addNotification({
      user_id: booking.customer_id,
      recipient_role: 'customer',
      title: 'Booking Cancelled',
      message: `Your booking ${booking.booking_reference} has been cancelled. Eligible refund: ৳${refund_amount}.`,
      category: 'booking',
    });

    this.notify();
    return newRequest;
  }

  // ================= COUNTER SHIFTS =================

  public startShift(payload: {
    counter_id: string;
    staff_user_id: string;
    staff_name: string;
    opening_cash: number;
    notes?: string;
  }): StaffShift {
    const counter = this.counters.find((c) => c.id === payload.counter_id);
    const nowIso = new Date().toISOString();

    const newShift: StaffShift = {
      id: `shf-${generateUUID().substring(0, 8)}`,
      counter_id: payload.counter_id,
      counter_name: counter?.name || 'Bus Counter',
      staff_user_id: payload.staff_user_id,
      staff_name: payload.staff_name,
      shift_start: nowIso,
      opening_cash: payload.opening_cash,
      total_sales_amount: 0,
      total_tickets_sold: 0,
      status: 'open',
      notes: payload.notes,
      created_at: nowIso,
    };

    this.shifts.unshift(newShift);
    this.save('ticketora_shifts', this.shifts);

    this.addAuditLog({
      user_name: payload.staff_name,
      role: 'counter_staff',
      action: 'SHIFT_STARTED',
      entity_type: 'shift',
      entity_id: newShift.id,
      details: `Started shift at ${counter?.name} with opening cash ৳${payload.opening_cash}.`,
    });

    this.notify();
    return newShift;
  }

  public closeShift(shiftId: string, closingCash: number, notes?: string): StaffShift {
    const shift = this.shifts.find((s) => s.id === shiftId);
    if (!shift) throw new Error('Shift not found.');

    shift.status = 'closed';
    shift.shift_end = new Date().toISOString();
    shift.closing_cash = closingCash;
    if (notes) shift.notes = `${shift.notes || ''} | Closing Notes: ${notes}`;

    this.save('ticketora_shifts', this.shifts);

    this.addAuditLog({
      user_name: shift.staff_name,
      role: 'counter_staff',
      action: 'SHIFT_CLOSED',
      entity_type: 'shift',
      entity_id: shift.id,
      details: `Closed shift at ${shift.counter_name}. Tickets sold: ${shift.total_tickets_sold}, Sales: ৳${shift.total_sales_amount}, Closing Cash: ৳${closingCash}.`,
    });

    this.notify();
    return shift;
  }

  // ================= CRUD HELPERS =================

  public addStation(station: Omit<Station, 'id' | 'created_at'>): Station {
    const newSt: Station = {
      ...station,
      id: `st-${generateUUID().substring(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.stations.unshift(newSt);
    this.save('ticketora_stations', this.stations);
    this.notify();
    return newSt;
  }

  public updateStation(id: string, updates: Partial<Station>) {
    const idx = this.stations.findIndex((s) => s.id === id);
    if (idx >= 0) {
      this.stations[idx] = { ...this.stations[idx], ...updates };
      this.save('ticketora_stations', this.stations);
      this.notify();
    }
  }

  public addOperator(op: Omit<BusOperator, 'id' | 'created_at'>): BusOperator {
    const newOp: BusOperator = {
      ...op,
      id: `op-${generateUUID().substring(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.operators.unshift(newOp);
    this.save('ticketora_operators', this.operators);
    this.notify();
    return newOp;
  }

  public updateOperator(id: string, updates: Partial<BusOperator>) {
    const idx = this.operators.findIndex((o) => o.id === id);
    if (idx >= 0) {
      this.operators[idx] = { ...this.operators[idx], ...updates };
      this.save('ticketora_operators', this.operators);
      this.notify();
    }
  }

  public addBus(bus: Omit<Bus, 'id' | 'created_at'>): Bus {
    const newBus: Bus = {
      ...bus,
      id: `bus-${generateUUID().substring(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.buses.unshift(newBus);
    this.save('ticketora_buses', this.buses);
    this.notify();
    return newBus;
  }

  public updateBus(id: string, updates: Partial<Bus>) {
    const idx = this.buses.findIndex((b) => b.id === id);
    if (idx >= 0) {
      this.buses[idx] = { ...this.buses[idx], ...updates };
      this.save('ticketora_buses', this.buses);
      this.notify();
    }
  }

  public addLayout(layout: Omit<BusSeatLayout, 'id' | 'created_at'>): BusSeatLayout {
    const newLayout: BusSeatLayout = {
      ...layout,
      id: `ly-${generateUUID().substring(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.layouts.unshift(newLayout);
    this.save('ticketora_layouts', this.layouts);
    this.notify();
    return newLayout;
  }

  public addRoute(route: Omit<BusRoute, 'id' | 'created_at'>): BusRoute {
    const newRoute: BusRoute = {
      ...route,
      id: `rt-${generateUUID().substring(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.routes.unshift(newRoute);
    this.save('ticketora_routes', this.routes);
    this.notify();
    return newRoute;
  }

  public addTrip(trip: Omit<Trip, 'id' | 'created_at'>): Trip {
    const newTrip: Trip = {
      ...trip,
      id: `trip-${generateUUID().substring(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.trips.unshift(newTrip);
    this.save('ticketora_trips', this.trips);
    this.notify();
    return newTrip;
  }

  public updateTrip(id: string, updates: Partial<Trip>) {
    const idx = this.trips.findIndex((t) => t.id === id);
    if (idx >= 0) {
      this.trips[idx] = { ...this.trips[idx], ...updates };
      this.save('ticketora_trips', this.trips);
      this.notify();
    }
  }

  public updateSettings(updates: Partial<SystemSettings>) {
    this.settings = { ...this.settings, ...updates };
    this.save('ticketora_settings', this.settings);
    this.notify();
  }

  public addContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${generateUUID().substring(0, 8)}`,
      status: 'unread',
      created_at: new Date().toISOString(),
    };
    this.contactMessages.unshift(newMsg);
    this.save('ticketora_messages', this.contactMessages);
    this.notify();
    return newMsg;
  }

  public addNotification(notif: Omit<AppNotification, 'id' | 'is_read' | 'created_at'>) {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${generateUUID().substring(0, 8)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    this.save('ticketora_notifications', this.notifications);
    this.notify();
  }

  public markNotificationRead(id: string) {
    const n = this.notifications.find((notif) => notif.id === id);
    if (n) {
      n.is_read = true;
      this.save('ticketora_notifications', this.notifications);
      this.notify();
    }
  }

  public markAllNotificationsRead() {
    this.notifications.forEach((n) => (n.is_read = true));
    this.save('ticketora_notifications', this.notifications);
    this.notify();
  }

  private addAuditLog(log: Omit<AuditLog, 'id' | 'created_at'>) {
    const newLog: AuditLog = {
      ...log,
      id: `aud-${generateUUID().substring(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    this.save('ticketora_audit', this.auditLogs);
  }
}

export const store = new TicketoraStore();

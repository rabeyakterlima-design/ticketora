import { describe, it, expect, beforeEach } from 'vitest';
import { formatBDT, formatTime, formatDate, generateBookingRef } from '../src/lib/utils';
import { store } from '../src/services/store';

describe('TICKETORA Core Test Suite', () => {
  describe('01. Unit Tests: Currency, Formatting & Generators', () => {
    it('formats BDT currency with Bangladeshi Taka symbol', () => {
      const formatted = formatBDT(1600);
      expect(formatted).toContain('৳');
      expect(formatted).toContain('1,600');
    });

    it('formats travel departure times into 12-hour AM/PM format', () => {
      expect(formatTime('20:30')).toBe('8:30 PM');
      expect(formatTime('08:00')).toBe('8:00 AM');
      expect(formatTime('12:15')).toBe('12:15 PM');
    });

    it('generates unique booking reference starting with TKT-', () => {
      const ref1 = generateBookingRef();
      const ref2 = generateBookingRef();
      expect(ref1).toMatch(/^TKT-[0-9A-Z]{6}$/);
      expect(ref2).toMatch(/^TKT-[0-9A-Z]{6}$/);
      expect(ref1).not.toBe(ref2);
    });
  });

  describe('02. Concurrency & Seat Holding Engine', () => {
    const tripId = 'trip-gl-101';
    const testSeat = 'H1';
    const sessionAlice = 'session-alice-123';
    const sessionBob = 'session-bob-456';

    it('allows a customer to hold an available seat', () => {
      const hold = store.holdSeats(tripId, [testSeat], sessionAlice, 300);
      expect(hold.success).toBe(true);
      expect(hold.expires_at).toBeGreaterThan(Date.now());
    });

    it('prevents concurrent double-reservation when another user requests the same seat', () => {
      // Alice holds seat H1
      store.holdSeats(tripId, [testSeat], sessionAlice, 300);

      // Bob attempts to hold the same seat concurrently -> MUST throw error!
      expect(() => {
        store.holdSeats(tripId, [testSeat], sessionBob, 300);
      }).toThrow(/currently held by another passenger/);
    });

    it('releases seat hold correctly', () => {
      store.releaseHolds(tripId, [testSeat], sessionAlice);
      // Now Bob can hold it
      const hold = store.holdSeats(tripId, [testSeat], sessionBob, 300);
      expect(hold.success).toBe(true);
      store.releaseHolds(tripId, [testSeat], sessionBob);
    });
  });

  describe('03. Transactional Booking & Double-Booking Prevention', () => {
    const tripId = 'trip-gl-101';
    const seatToBook = 'G1';

    it('creates a confirmed booking with accurate fare and payment', () => {
      const booking = store.createBooking({
        trip_id: tripId,
        customer_name: 'Test Passenger',
        customer_phone: '+8801700112233',
        boarding_point: 'Sayedabad Terminal',
        dropping_point: 'Kolatoli Beach Circle',
        seat_numbers: [seatToBook],
        passengers: [
          {
            seat_number: seatToBook,
            name: 'Test Passenger',
            gender: 'male',
            fare: 1600,
          },
        ],
        payment_method: 'bkash',
        booking_channel: 'online',
      });

      expect(booking).toBeDefined();
      expect(booking.booking_reference).toMatch(/^TKT-/);
      expect(booking.booking_status).toBe('confirmed');
      expect(booking.payment_status).toBe('paid');
      expect(booking.total_fare).toBeGreaterThanOrEqual(1600);

      // Verify booked seats list contains the seat
      const booked = store.getBookedSeatsForTrip(tripId);
      expect(booked).toContain(seatToBook);
    });

    it('strictly prevents double-booking the same confirmed seat on the same trip', () => {
      // Attempting to book seat G1 again MUST throw error
      expect(() => {
        store.createBooking({
          trip_id: tripId,
          customer_name: 'Second Customer',
          customer_phone: '+8801799887766',
          boarding_point: 'Sayedabad Terminal',
          dropping_point: 'Kolatoli Beach Circle',
          seat_numbers: [seatToBook],
          passengers: [
            {
              seat_number: seatToBook,
              name: 'Second Customer',
              gender: 'female',
              fare: 1600,
            },
          ],
          payment_method: 'nagad',
          booking_channel: 'online',
        });
      }).toThrow(/booked/);
    });
  });

  describe('04. Counter Operations & Shift Reconciliation', () => {
    it('records counter ticket sale and increments active staff shift metrics', () => {
      const staffId = 'usr-staff-gabtoli';
      const shiftBefore = store.getActiveShiftForStaff(staffId);
      const initialSales = shiftBefore?.total_sales_amount || 0;
      const initialTickets = shiftBefore?.total_tickets_sold || 0;

      const counterBooking = store.createBooking({
        trip_id: 'trip-gl-102',
        customer_name: 'Walk-in Counter Passenger',
        customer_phone: '+8801811223344',
        boarding_point: 'Gabtoli Main Concourse',
        dropping_point: 'Kolatoli Beach',
        seat_numbers: ['C1'],
        passengers: [
          {
            seat_number: 'C1',
            name: 'Walk-in Passenger',
            gender: 'male',
            fare: 2200,
          },
        ],
        payment_method: 'cash',
        booking_channel: 'counter',
        counter_id: 'cnt-gabtoli-01',
        counter_name: 'Green Line Gabtoli Counter #1',
        staff_user_id: staffId,
        staff_name: 'Rafiqul Islam',
      });

      expect(counterBooking.booking_channel).toBe('counter');

      const shiftAfter = store.getActiveShiftForStaff(staffId);
      expect(shiftAfter?.total_sales_amount).toBe(initialSales + counterBooking.total_fare);
      expect(shiftAfter?.total_tickets_sold).toBe(initialTickets + 1);
    });
  });

  describe('05. Cancellation & Policy-Based Refund Calculations', () => {
    it('processes booking cancellation and frees seats back to available inventory', () => {
      // First create a booking on trip-hanif-201
      const booking = store.createBooking({
        trip_id: 'trip-hanif-201',
        customer_name: 'Cancellation Tester',
        customer_phone: '+8801733445566',
        boarding_point: 'Sayedabad',
        dropping_point: 'Cox’s Bazar',
        seat_numbers: ['D1'],
        passengers: [
          {
            seat_number: 'D1',
            name: 'Cancellation Tester',
            gender: 'male',
            fare: 900,
          },
        ],
        payment_method: 'bkash',
        booking_channel: 'online',
      });

      // Verify seat is booked
      expect(store.getBookedSeatsForTrip('trip-hanif-201')).toContain('D1');

      // Request cancellation
      const cancelReq = store.requestCancellation({
        booking_id: booking.id,
        reason: 'Change of schedule',
        actor_name: 'Cancellation Tester',
      });

      expect(cancelReq.status).toBe('approved');
      expect(cancelReq.refund_percentage).toBeGreaterThanOrEqual(0);

      // Verify seat D1 is no longer in active booked seats!
      expect(store.getBookedSeatsForTrip('trip-hanif-201')).not.toContain('D1');
    });
  });
});

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'operator_admin'
  | 'counter_manager'
  | 'counter_staff'
  | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  operator_id?: string;
  counter_id?: string;
  created_at: string;
}

export interface Station {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  contact_number?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface BusOperator {
  id: string;
  name: string;
  registration_no?: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  logo_url?: string;
  description?: string;
  rating?: number;
  status: 'active' | 'suspended' | 'inactive';
  created_at: string;
}

export type CoachType =
  | 'AC Deluxe'
  | 'Non-AC'
  | 'Business Class AC'
  | 'Sleeper Coach AC'
  | 'Double Decker AC'
  | 'Executive AC';

export type SeatDeck = 'lower' | 'upper';
export type SeatType = 'regular' | 'business' | 'sleeper' | 'vip' | 'empty';
export type SeatPosition = 'window' | 'aisle' | 'middle';

export interface SeatConfig {
  id: string;
  seat_number: string;
  deck: SeatDeck;
  row: number;
  col: number;
  seat_type: SeatType;
  position: SeatPosition;
  fare_adjustment: number;
  is_active: boolean;
}

export interface BusSeatLayout {
  id: string;
  operator_id?: string;
  name: string;
  layout_type: '2x2' | '2x1' | '1x1' | 'sleeper';
  total_seats: number;
  total_rows: number;
  columns_left: number;
  columns_right: number;
  deck_type: 'single' | 'double';
  seats: SeatConfig[];
  created_at: string;
}

export interface Bus {
  id: string;
  operator_id: string;
  operator_name?: string;
  name: string;
  registration_number: string;
  coach_type: CoachType;
  is_ac: boolean;
  total_seats: number;
  layout_id: string;
  amenities: string[];
  model?: string;
  status: 'active' | 'maintenance' | 'archived';
  created_at: string;
}

export interface RouteStop {
  id: string;
  route_id: string;
  station_id: string;
  station_name?: string;
  city?: string;
  stop_order: number;
  arrival_offset_minutes: number;
  departure_offset_minutes: number;
  fare_from_origin: number;
}

export interface BusRoute {
  id: string;
  operator_id?: string;
  operator_name?: string;
  origin_station_id: string;
  destination_station_id: string;
  origin_station?: Station;
  destination_station?: Station;
  distance_km: number;
  estimated_duration_minutes: number;
  description?: string;
  stops?: RouteStop[];
  status: 'active' | 'inactive';
  created_at: string;
}

export type TripStatus = 'scheduled' | 'boarding' | 'departed' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  bus_id: string;
  operator_id: string;
  route_id: string;
  bus?: Bus;
  operator?: BusOperator;
  route?: BusRoute;
  departure_time: string; // ISO string or HH:mm
  arrival_time: string;
  departure_date: string; // YYYY-MM-DD
  base_fare: number;
  boarding_points: string[];
  dropping_points: string[];
  status: TripStatus;
  available_seats_count?: number;
  created_at: string;
}

export type SeatStatus = 'available' | 'held' | 'booked' | 'blocked' | 'female_reserved';

export interface TripSeatInventory {
  id: string;
  trip_id: string;
  seat_number: string;
  deck: SeatDeck;
  row: number;
  col: number;
  seat_type: SeatType;
  position: SeatPosition;
  fare_adjustment: number;
  status: SeatStatus;
  held_by?: string;
  held_expires_at?: string;
  passenger_gender?: 'male' | 'female';
  booking_id?: string;
}

export type BookingChannel = 'online' | 'counter' | 'admin';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'expired';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'sslcommerz' | 'aamarpay' | 'card' | 'cash';

export interface PassengerDetail {
  seat_number: string;
  name: string;
  gender: 'male' | 'female';
  age?: number;
  phone?: string;
  fare: number;
}

export interface Booking {
  id: string;
  booking_reference: string;
  customer_id?: string;
  operator_id: string;
  operator_name?: string;
  trip_id: string;
  trip?: Trip;
  origin_city: string;
  destination_city: string;
  boarding_point: string;
  dropping_point: string;
  journey_date: string;
  departure_time: string;
  bus_name: string;
  coach_type: string;
  seat_numbers: string[];
  passengers: PassengerDetail[];
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  base_fare: number;
  seat_adjustment: number;
  service_fee: number;
  discount_amount: number;
  total_fare: number;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  booking_channel: BookingChannel;
  counter_id?: string;
  counter_name?: string;
  booked_by_staff_id?: string;
  booked_by_staff_name?: string;
  qr_token: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  booking_id: string;
  booking_reference: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  provider_reference?: string;
  transaction_reference: string;
  counter_id?: string;
  collected_by_name?: string;
  created_at: string;
  verified_at?: string;
}

export interface BusCounter {
  id: string;
  operator_id: string;
  operator_name?: string;
  station_id: string;
  station_name?: string;
  name: string;
  code: string;
  contact_number: string;
  address: string;
  city: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface StaffShift {
  id: string;
  counter_id: string;
  counter_name: string;
  staff_user_id: string;
  staff_name: string;
  shift_start: string;
  shift_end?: string;
  opening_cash: number;
  closing_cash?: number;
  total_sales_amount: number;
  total_tickets_sold: number;
  status: 'open' | 'closed';
  notes?: string;
  created_at: string;
}

export interface CancellationRequest {
  id: string;
  booking_id: string;
  booking_reference: string;
  customer_name: string;
  customer_phone: string;
  journey_date: string;
  total_fare: number;
  refund_percentage: number;
  refund_amount: number;
  deduction_fee: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requested_by_id?: string;
  reviewed_by_name?: string;
  reviewed_at?: string;
  notes?: string;
  created_at: string;
}

export interface RefundRecord {
  id: string;
  cancellation_request_id: string;
  booking_id: string;
  booking_reference: string;
  amount: number;
  currency: string;
  refund_method: PaymentMethod;
  transaction_reference: string;
  status: 'completed' | 'failed';
  processed_by_name: string;
  processed_at: string;
}

export interface AppNotification {
  id: string;
  user_id?: string;
  recipient_role?: UserRole | 'all';
  title: string;
  message: string;
  category: 'booking' | 'payment' | 'trip' | 'counter' | 'system';
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  user_name: string;
  role: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: string;
  ip_address?: string;
  created_at: string;
}

export interface SystemSettings {
  website_name: string;
  tagline: string;
  secondary_tagline: string;
  contact_email: string;
  contact_phone: string;
  emergency_hotline: string;
  address: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  seat_hold_duration_seconds: number;
  max_seats_per_booking: number;
  booking_cutoff_minutes: number;
  cancellation_cutoff_hours: number;
  refund_above_24h_percent: number;
  refund_12_to_24h_percent: number;
  refund_below_12h_percent: number;
  service_charge_percent: number;
  min_service_charge_bdt: number;
  maintenance_mode: boolean;
}

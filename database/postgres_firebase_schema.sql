-- ============================================================
-- TICKETORA HYBRID ARCHITECTURE: FIREBASE AUTH + POSTGRESQL
-- Database: Standard PostgreSQL (Google Cloud SQL, Neon, Supabase, Render, AWS RDS)
-- Authentication: Firebase Authentication (Google Federated Sign-in + Email)
-- Currency: BDT (৳) | Timezone: Asia/Dhaka
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 01. PROFILES (Linked directly to Firebase Auth UID)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    -- id stores the exact Firebase Auth user.uid (e.g. 'c7F8jK92LmN4...')
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('super_admin', 'admin', 'operator_admin', 'counter_manager', 'counter_staff', 'customer')),
    avatar_url TEXT,
    operator_id TEXT,
    counter_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 02. BUS OPERATORS & ORGANIZATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS bus_operators (
    id TEXT PRIMARY KEY DEFAULT ('op-' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    registration_no TEXT UNIQUE,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    description TEXT,
    rating NUMERIC(3,2) DEFAULT 4.80,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 03. BUS TERMINALS & STATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS stations (
    id TEXT PRIMARY KEY DEFAULT ('st-' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    address TEXT,
    contact_number TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 04. SEAT LAYOUTS & BUS FLEET
-- ============================================================
CREATE TABLE IF NOT EXISTS bus_seat_layouts (
    id TEXT PRIMARY KEY DEFAULT ('ly-' || substr(md5(random()::text), 1, 8)),
    operator_id TEXT REFERENCES bus_operators(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    layout_type TEXT NOT NULL DEFAULT '2x2',
    total_seats INT NOT NULL DEFAULT 40,
    total_rows INT NOT NULL DEFAULT 10,
    columns_left INT NOT NULL DEFAULT 2,
    columns_right INT NOT NULL DEFAULT 2,
    deck_type TEXT NOT NULL DEFAULT 'single',
    config JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buses (
    id TEXT PRIMARY KEY DEFAULT ('bus-' || substr(md5(random()::text), 1, 8)),
    operator_id TEXT NOT NULL REFERENCES bus_operators(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    coach_type TEXT NOT NULL DEFAULT 'AC Deluxe',
    is_ac BOOLEAN NOT NULL DEFAULT true,
    total_seats INT NOT NULL DEFAULT 40,
    layout_id TEXT REFERENCES bus_seat_layouts(id) ON DELETE SET NULL,
    amenities TEXT[] DEFAULT ARRAY['Air Conditioning', 'WiFi', 'Charging Ports', 'Water']::TEXT[],
    model TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 05. HIGHWAY ROUTES & STOPS
-- ============================================================
CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY DEFAULT ('rt-' || substr(md5(random()::text), 1, 8)),
    operator_id TEXT REFERENCES bus_operators(id) ON DELETE SET NULL,
    origin_station_id TEXT NOT NULL REFERENCES stations(id),
    destination_station_id TEXT NOT NULL REFERENCES stations(id),
    distance_km INT NOT NULL DEFAULT 250,
    estimated_duration_minutes INT NOT NULL DEFAULT 300,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_diff_origin_dest CHECK (origin_station_id <> destination_station_id)
);

-- ============================================================
-- 06. SCHEDULED TRIPS & INVENTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY DEFAULT ('trip-' || substr(md5(random()::text), 1, 8)),
    bus_id TEXT NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    operator_id TEXT NOT NULL REFERENCES bus_operators(id) ON DELETE CASCADE,
    route_id TEXT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    base_fare NUMERIC(10,2) NOT NULL,
    boarding_points TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    dropping_points TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Real-time 5-minute atomic holds
CREATE TABLE IF NOT EXISTS seat_holds (
    id TEXT PRIMARY KEY DEFAULT ('hld-' || substr(md5(random()::text), 1, 8)),
    trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    session_id TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (trip_id, seat_number)
);

-- ============================================================
-- 07. PHYSICAL COUNTERS & SHIFTS
-- ============================================================
CREATE TABLE IF NOT EXISTS counters (
    id TEXT PRIMARY KEY DEFAULT ('cnt-' || substr(md5(random()::text), 1, 8)),
    operator_id TEXT NOT NULL REFERENCES bus_operators(id) ON DELETE CASCADE,
    station_id TEXT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    contact_number TEXT,
    address TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_shifts (
    id TEXT PRIMARY KEY DEFAULT ('shf-' || substr(md5(random()::text), 1, 8)),
    counter_id TEXT NOT NULL REFERENCES counters(id) ON DELETE CASCADE,
    staff_user_id TEXT NOT NULL REFERENCES profiles(id),
    shift_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    shift_end TIMESTAMPTZ,
    opening_cash NUMERIC(10,2) NOT NULL DEFAULT 0,
    closing_cash NUMERIC(10,2),
    total_sales_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_tickets_sold INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 08. BOOKINGS & PASSENGERS
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY DEFAULT ('bk-' || substr(md5(random()::text), 1, 8)),
    booking_reference TEXT UNIQUE NOT NULL,
    customer_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    operator_id TEXT NOT NULL REFERENCES bus_operators(id),
    trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE RESTRICT,
    origin_city TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    boarding_point TEXT NOT NULL,
    dropping_point TEXT NOT NULL,
    journey_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    bus_name TEXT NOT NULL,
    coach_type TEXT NOT NULL,
    seat_numbers TEXT[] NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    base_fare NUMERIC(10,2) NOT NULL,
    seat_adjustment NUMERIC(10,2) NOT NULL DEFAULT 0,
    service_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_fare NUMERIC(10,2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
    booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'pending', 'cancelled', 'completed')),
    booking_channel TEXT NOT NULL DEFAULT 'online' CHECK (booking_channel IN ('online', 'counter', 'admin')),
    counter_id TEXT REFERENCES counters(id) ON DELETE SET NULL,
    booked_by_staff_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    qr_token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CRITICAL: PostgreSQL Unique Constraint to guarantee ZERO double bookings
CREATE TABLE IF NOT EXISTS booking_seats (
    id TEXT PRIMARY KEY DEFAULT ('bs-' || substr(md5(random()::text), 1, 8)),
    booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    fare NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (trip_id, seat_number)
);

CREATE TABLE IF NOT EXISTS booking_passengers (
    id TEXT PRIMARY KEY DEFAULT ('bp-' || substr(md5(random()::text), 1, 8)),
    booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    name TEXT NOT NULL,
    gender TEXT NOT NULL DEFAULT 'male',
    age INT,
    phone TEXT,
    fare NUMERIC(10,2) NOT NULL
);

-- ============================================================
-- 09. PAYMENTS & FINANCIAL AUDIT
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY DEFAULT ('pay-' || substr(md5(random()::text), 1, 8)),
    booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    booking_reference TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'BDT',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('bkash', 'nagad', 'rocket', 'sslcommerz', 'card', 'cash')),
    payment_status TEXT NOT NULL DEFAULT 'paid',
    transaction_reference TEXT UNIQUE NOT NULL,
    counter_id TEXT REFERENCES counters(id) ON DELETE SET NULL,
    collected_by_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cancellation_requests (
    id TEXT PRIMARY KEY DEFAULT ('can-' || substr(md5(random()::text), 1, 8)),
    booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    booking_reference TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    journey_date DATE NOT NULL,
    total_fare NUMERIC(10,2) NOT NULL,
    refund_percentage INT NOT NULL DEFAULT 85,
    refund_amount NUMERIC(10,2) NOT NULL,
    deduction_fee NUMERIC(10,2) NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved',
    reviewed_by_name TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY DEFAULT ('aud-' || substr(md5(random()::text), 1, 8)),
    user_name TEXT NOT NULL,
    role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_search ON trips (route_id, departure_date);
CREATE INDEX IF NOT EXISTS idx_booking_seats_guard ON booking_seats (trip_id, seat_number);
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON bookings (booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings (customer_id);

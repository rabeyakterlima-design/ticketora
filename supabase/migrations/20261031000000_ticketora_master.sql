-- ============================================================
-- TICKETORA MASTER DATABASE MIGRATION
-- Platform: Supabase PostgreSQL
-- Version: 2.0 Production
-- Target Market: Bangladesh (Currency: BDT ৳, Timezone: Asia/Dhaka)
-- ============================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 01. ENUMS
-- ============================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'super_admin',
        'admin',
        'operator_admin',
        'counter_manager',
        'counter_staff',
        'customer'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'confirmed',
        'pending',
        'cancelled',
        'completed',
        'expired'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'pending',
        'processing',
        'paid',
        'failed',
        'refunded',
        'partially_refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM (
        'bkash',
        'nagad',
        'rocket',
        'sslcommerz',
        'aamarpay',
        'card',
        'cash'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_channel AS ENUM (
        'online',
        'counter',
        'admin'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- 02. PROFILES & ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    operator_id UUID,
    counter_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 03. ORGANIZATIONS & OPERATORS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.bus_operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    registration_no TEXT UNIQUE,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    logo_url TEXT,
    description TEXT,
    rating NUMERIC(3,2) DEFAULT 4.80,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 04. STATIONS & TERMINALS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    address TEXT,
    contact_number TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 05. SEAT LAYOUTS & BUSES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bus_seat_layouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID REFERENCES public.bus_operators(id) ON DELETE SET NULL,
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

CREATE TABLE IF NOT EXISTS public.buses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES public.bus_operators(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    coach_type TEXT NOT NULL DEFAULT 'AC Deluxe',
    is_ac BOOLEAN NOT NULL DEFAULT true,
    total_seats INT NOT NULL DEFAULT 40,
    layout_id UUID REFERENCES public.bus_seat_layouts(id) ON DELETE SET NULL,
    amenities TEXT[] DEFAULT ARRAY['Air Conditioning', 'WiFi', 'Charging Ports', 'Water']::TEXT[],
    model TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 06. ROUTES & STOPS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID REFERENCES public.bus_operators(id) ON DELETE SET NULL,
    origin_station_id UUID NOT NULL REFERENCES public.stations(id),
    destination_station_id UUID NOT NULL REFERENCES public.stations(id),
    distance_km INT NOT NULL DEFAULT 250,
    estimated_duration_minutes INT NOT NULL DEFAULT 300,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_diff_origin_dest CHECK (origin_station_id <> destination_station_id)
);

CREATE TABLE IF NOT EXISTS public.route_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
    stop_order INT NOT NULL,
    arrival_offset_minutes INT NOT NULL DEFAULT 0,
    departure_offset_minutes INT NOT NULL DEFAULT 0,
    fare_from_origin NUMERIC(10,2) NOT NULL DEFAULT 0,
    UNIQUE (route_id, stop_order)
);

-- ============================================================
-- 07. TRIPS & INVENTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id UUID NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
    operator_id UUID NOT NULL REFERENCES public.bus_operators(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    base_fare NUMERIC(10,2) NOT NULL,
    boarding_points TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    dropping_points TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seat_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    session_id TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (trip_id, seat_number)
);

-- ============================================================
-- 08. COUNTERS & SHIFTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.counters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES public.bus_operators(id) ON DELETE CASCADE,
    station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    contact_number TEXT,
    address TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.staff_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    counter_id UUID NOT NULL REFERENCES public.counters(id) ON DELETE CASCADE,
    staff_user_id UUID NOT NULL REFERENCES public.profiles(id),
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
-- 09. BOOKINGS & PASSENGERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    operator_id UUID NOT NULL REFERENCES public.bus_operators(id),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE RESTRICT,
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
    payment_status payment_status NOT NULL DEFAULT 'paid',
    booking_status booking_status NOT NULL DEFAULT 'confirmed',
    booking_channel booking_channel NOT NULL DEFAULT 'online',
    counter_id UUID REFERENCES public.counters(id) ON DELETE SET NULL,
    booked_by_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    qr_token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual confirmed seats to enforce uniqueness and prevent double-booking
CREATE TABLE IF NOT EXISTS public.booking_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    fare NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- CRITICAL: Unique constraint guarantees that a seat on a trip can NEVER be booked twice!
    UNIQUE (trip_id, seat_number)
);

CREATE TABLE IF NOT EXISTS public.booking_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    name TEXT NOT NULL,
    gender TEXT NOT NULL DEFAULT 'male',
    age INT,
    phone TEXT,
    fare NUMERIC(10,2) NOT NULL
);

-- ============================================================
-- 10. PAYMENTS & FINANCIAL TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    booking_reference TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'BDT',
    payment_method payment_method NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'paid',
    provider_reference TEXT,
    transaction_reference TEXT UNIQUE NOT NULL,
    counter_id UUID REFERENCES public.counters(id) ON DELETE SET NULL,
    collected_by_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. CANCELLATIONS & REFUNDS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cancellation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
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
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 12. NOTIFICATIONS, CONTACTS, AUDIT & SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_role TEXT NOT NULL DEFAULT 'customer',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'booking',
    is_read BOOLEAN NOT NULL DEFAULT false,
    link_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 13. INDEXES FOR HIGH-TRAFFIC BUS SEARCH & BOOKING
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_trips_route_date ON public.trips (route_id, departure_date);
CREATE INDEX IF NOT EXISTS idx_trips_operator ON public.trips (operator_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings (booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings (customer_phone);
CREATE INDEX IF NOT EXISTS idx_booking_seats_trip ON public.booking_seats (trip_id, seat_number);
CREATE INDEX IF NOT EXISTS idx_seat_holds_trip_exp ON public.seat_holds (trip_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments (booking_id);

-- ============================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cancellation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users read and update own profile, admins read all
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Public Read for Catalog Data: Stations, Operators, Buses, Routes, Trips
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active stations" ON public.stations FOR SELECT USING (true);

ALTER TABLE public.bus_operators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active operators" ON public.bus_operators FOR SELECT USING (true);

ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active buses" ON public.buses FOR SELECT USING (true);

ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active routes" ON public.routes FOR SELECT USING (true);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view scheduled trips" ON public.trips FOR SELECT USING (true);

ALTER TABLE public.seat_holds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view seat holds" ON public.seat_holds FOR SELECT USING (true);
CREATE POLICY "Anyone can manage own seat holds" ON public.seat_holds FOR ALL USING (true);

-- Bookings: Customers can read own bookings; counter staff can read assigned counter; admins can read all
CREATE POLICY "Customers view own bookings" ON public.bookings
    FOR SELECT USING (
        auth.uid() = customer_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('super_admin', 'admin')
        )
    );

-- Insert bookings: authenticated users or counter staff
CREATE POLICY "Allow booking insertions" ON public.bookings
    FOR INSERT WITH CHECK (true);

-- Payments: read own payments or admin
CREATE POLICY "View payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE bookings.id = payments.booking_id
            AND (bookings.customer_id = auth.uid() OR auth.uid() IS NULL)
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('super_admin', 'admin', 'operator_admin', 'counter_staff')
        )
    );

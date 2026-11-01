-- ============================================================
-- TICKETORA BANGLADESH SEED DATA
-- Stations, Operators, Buses, Routes, Trips, Layouts
-- ============================================================

-- Stations
INSERT INTO public.stations (id, name, city, district, address, contact_number, status) VALUES
('st-dhk-gabtoli', 'Gabtoli Inter-District Terminal', 'Dhaka', 'Dhaka', 'Mirpur Road, Gabtoli, Dhaka', '+8801711223344', 'active'),
('st-dhk-sayedabad', 'Sayedabad Bus Terminal', 'Dhaka', 'Dhaka', 'Sayedabad, Jatrabari, Dhaka', '+8801711223345', 'active'),
('st-dhk-arambagh', 'Arambagh VIP Counter', 'Dhaka', 'Dhaka', 'Arambagh, Motijheel, Dhaka', '+8801711223346', 'active'),
('st-ctg-dampara', 'Dampara Bus Terminal', 'Chattogram', 'Chattogram', 'Dampara, Zakir Hossain Road, Chattogram', '+8801811223344', 'active'),
('st-cox-kolatoli', 'Kolatoli Beach Terminal', 'Cox''s Bazar', 'Cox''s Bazar', 'Kolatoli Road, Cox’s Bazar', '+8801819887766', 'active'),
('st-syl-kadamtoli', 'Kadamtoli Central Bus Terminal', 'Sylhet', 'Sylhet', 'Kadamtoli, South Surma, Sylhet', '+8801712334455', 'active'),
('st-raj-shiroil', 'Shiroil Bus Terminal', 'Rajshahi', 'Rajshahi', 'Railway Station Road, Shiroil, Rajshahi', '+8801713445566', 'active'),
('st-khu-sonadanga', 'Sonadanga Bus Terminal', 'Khulna', 'Khulna', 'Sonadanga Bypass, Khulna', '+8801714556677', 'active')
ON CONFLICT (id) DO NOTHING;

-- Operators
INSERT INTO public.bus_operators (id, name, registration_no, contact_person, email, phone, address, description, rating, status) VALUES
('op-greenline', 'Green Line Paribahan', 'REG-GL-10492', 'Ashraf Hossain', 'info@greenlinebd.com', '+8801711-000003', '9/2 Outer Circular Road, Rajarbagh, Dhaka', 'Pioneers of luxury bus transportation in Bangladesh with Scania Double Decker and Sleeper fleet.', 4.90, 'active'),
('op-hanif', 'Hanif Enterprise', 'REG-HE-88310', 'Md. Kafiluddin Hanif', 'support@hanifenterprise.com', '+8801713-040506', 'Panthapath, Dhanmondi, Dhaka', 'The largest and most extensive inter-district bus network connecting every corner of Bangladesh.', 4.70, 'active'),
('op-shyamoli', 'Shyamoli Paribahan', 'REG-SP-44120', 'Ramesh Ghosh', 'help@shyamolibd.com', '+8801711-440022', 'Kalyanpur, Mirpur Road, Dhaka', 'Trusted nationwide operator offering both luxury AC and comfortable Economy services.', 4.80, 'active'),
('op-shohagh', 'Shohagh Paribahan', 'REG-SH-99214', 'Faruk Talukder', 'contact@shohagh.com', '+8801711-558899', 'Malibagh DIT Road, Dhaka', 'First to introduce luxury Scania coaches and premium customer hospitality in Bangladesh.', 4.90, 'active')
ON CONFLICT (id) DO NOTHING;

-- Counters
INSERT INTO public.counters (id, operator_id, station_id, name, code, contact_number, address, status) VALUES
('cnt-gabtoli-01', 'op-greenline', 'st-dhk-gabtoli', 'Green Line Gabtoli Counter #1', 'GL-GB-01', '+8801711-000005', 'Counter 14, Main Concourse, Gabtoli Terminal, Dhaka', 'active'),
('cnt-sayedabad-03', 'op-greenline', 'st-dhk-sayedabad', 'Green Line Sayedabad Counter #3', 'GL-SY-03', '+8801711-000006', 'Counter 03, Janapath Road, Sayedabad, Dhaka', 'active'),
('cnt-dampara-02', 'op-greenline', 'st-ctg-dampara', 'Green Line Chattogram Dampara Counter', 'GL-CTG-02', '+8801811-000007', 'Zakir Hossain Road, Dampara, Chattogram', 'active'),
('cnt-kolatoli-01', 'op-greenline', 'st-cox-kolatoli', 'Green Line Cox’s Bazar Kolatoli Counter', 'GL-COX-01', '+8801819-000008', 'Hotel Sea Palace Circle, Kolatoli, Cox’s Bazar', 'active')
ON CONFLICT (id) DO NOTHING;

-- Routes
INSERT INTO public.routes (id, origin_station_id, destination_station_id, distance_km, estimated_duration_minutes, description, status) VALUES
('rt-dhk-cox', 'st-dhk-sayedabad', 'st-cox-kolatoli', 410, 570, 'Direct Highway via Dhaka-Chittagong-Cox’s Bazar National Highway', 'active'),
('rt-cox-dhk', 'st-cox-kolatoli', 'st-dhk-sayedabad', 410, 570, 'Direct Highway via Cox’s Bazar-Chittagong-Dhaka National Highway', 'active'),
('rt-dhk-ctg', 'st-dhk-sayedabad', 'st-ctg-dampara', 245, 330, 'Via Dhaka-Chittagong 4-lane Highway', 'active'),
('rt-dhk-syl', 'st-dhk-sayedabad', 'st-syl-kadamtoli', 240, 345, 'Via Dhaka-Sylhet Highway (N2)', 'active'),
('rt-dhk-raj', 'st-dhk-gabtoli', 'st-raj-shiroil', 250, 315, 'Via Bangabandhu Jamuna Bridge & Natore Highway', 'active'),
('rt-dhk-khu', 'st-dhk-gabtoli', 'st-khu-sonadanga', 220, 225, 'Expressway via Iconic Padma Multipurpose Bridge', 'active')
ON CONFLICT (id) DO NOTHING;
